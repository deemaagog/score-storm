import { Settings } from "../Settings"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalKeySignature } from "./GraphicalKeySignature"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"
import { GraphicalGlobalMeasure } from "./GraphicalGlobalMeasure"
import { GraphicalMeasure } from "./GraphicalMeasure"
import { GraphicalInstrument } from "./GraphicalInstrument"
import { Clef } from "../model/Clef"
import { KeySignature } from "../model/KeySignature"
import { TimeSignature } from "../model/TimeSignature"

export type InstrumentPosition = number

export class Row {
  globalMeasures!: GraphicalGlobalMeasure[]
  relativeInstrumentsPosition!: InstrumentPosition[]
  systemYPosition!: number
  systemHeight!: number // TODO: come up with a better name for this
}

export class Page {
  rows!: Row[]
  height!: number
}

/**
 * The main class for graphical representation of music score model.
 * Owns the full graphical tree — instruments, measures, events, global measures and global beats.
 * Built by RenderManager.buildGraphical() on each render call.
 */
export class GraphicalScore {
  pages!: Page[]
  instruments: GraphicalInstrument[] = []
  globalMeasures: GraphicalGlobalMeasure[] = []

  calculateLineBreaks(containerWidth: number, settings: Settings) {
    const rows: Pick<Row, "globalMeasures">[] = []
    // tracks current Clef/TimeSignature model objects per instrument — fresh graphical
    // instances are created for each row so every occurrence gets its own stable x, y position
    const instrumentsCurrentClefs: (Clef | undefined)[] = []
    let currentTimeSignature: TimeSignature | undefined
    let currentKeySignature: KeySignature | undefined

    let currentRowGlobalMeasures: GraphicalGlobalMeasure[] = []
    let currentRowWidth = 0

    for (let gm = 0; gm < this.globalMeasures.length; gm++) {
      const graphicalGlobalMeasure = this.globalMeasures[gm]
      if (graphicalGlobalMeasure.globalMeasure.time) {
        currentTimeSignature = graphicalGlobalMeasure.globalMeasure.time
      }
      if (graphicalGlobalMeasure.globalMeasure.key) {
        currentKeySignature = graphicalGlobalMeasure.globalMeasure.key
      }
      graphicalGlobalMeasure.calculateMinContentWidth(settings)

      let minWidthInSpaces = graphicalGlobalMeasure.minContentWidth + settings.contentMargin

      if (
        currentRowGlobalMeasures.length > 0 &&
        currentRowWidth + minWidthInSpaces * settings.unit > containerWidth
      ) {
        rows.push({ globalMeasures: currentRowGlobalMeasures })
        currentRowWidth = 0
        currentRowGlobalMeasures = []
      }

      // calculate measure attributes relative positions TODO: move to GraphicalGlobalMeasure
      let timeSignatureRelativeWidth = 0,
        keySignatureRelativeWidth = 0,
        clefRelativeWidth = 0

      for (let i = 0; i < this.instruments.length; i++) {
        const graphicalMeasure = this.instruments[i].measures[gm]
        const measure = graphicalMeasure.measure

        if (measure.clef) {
          instrumentsCurrentClefs[i] = measure.clef
        }

        // first row — create a fresh GraphicalTimeSignature per instrument so each stave
        // gets its own stable x, y position and ID for hover/selection
        if (!currentRowGlobalMeasures.length && gm === 0) {
          const graphicalTime = new GraphicalTimeSignature(currentTimeSignature!, measure)
          graphicalMeasure.time = graphicalTime
          if (graphicalTime.width > timeSignatureRelativeWidth) {
            timeSignatureRelativeWidth = graphicalTime.width
          }
        }

        // first measure in row — fresh clef and courtesy key so each system has
        // its own stable positions for hover/selection
        if (!currentRowGlobalMeasures.length) {
          if (instrumentsCurrentClefs[i]) {
            const graphicalClef = new GraphicalClef(instrumentsCurrentClefs[i]!, measure)
            graphicalMeasure.clef = graphicalClef
            if (graphicalClef.width > clefRelativeWidth) {
              clefRelativeWidth = graphicalClef.width
            }
          }

          if (currentKeySignature && currentKeySignature.fifths !== 0 && instrumentsCurrentClefs[i]) {
            const graphicalKey = new GraphicalKeySignature(
              currentKeySignature,
              measure,
              instrumentsCurrentClefs[i]!,
            )
            graphicalMeasure.key = graphicalKey
            if (graphicalKey.width > keySignatureRelativeWidth) {
              keySignatureRelativeWidth = graphicalKey.width
            }
          }
        } else {
          graphicalMeasure.clef = undefined // TODO: assign null instead of undefined???
          graphicalMeasure.key = undefined
        }
      }

      graphicalGlobalMeasure.timeSignatureRelativeWidth = timeSignatureRelativeWidth
      graphicalGlobalMeasure.keySignatureRelativeWidth = keySignatureRelativeWidth
      graphicalGlobalMeasure.clefRelativeWidth = clefRelativeWidth

      if (clefRelativeWidth > 0) {
        minWidthInSpaces += settings.clefMargin + clefRelativeWidth
      }
      if (keySignatureRelativeWidth > 0) {
        minWidthInSpaces += settings.keySignatureMargin + keySignatureRelativeWidth
      }
      if (timeSignatureRelativeWidth > 0) {
        minWidthInSpaces += settings.timeSignatureMargin + timeSignatureRelativeWidth
      }

      graphicalGlobalMeasure.width = minWidthInSpaces * settings.unit

      currentRowWidth += graphicalGlobalMeasure.width
      currentRowGlobalMeasures.push(graphicalGlobalMeasure)
    }

    if (currentRowGlobalMeasures.length) {
      rows.push({ globalMeasures: currentRowGlobalMeasures })
    }

    // #2a: stretch every row except the last to fill containerWidth
    for (let r = 0; r < rows.length; r++) {
      const rowMeasures = rows[r].globalMeasures
      if (r < rows.length - 1) {
        this.stretchRowToWidth(rowMeasures, containerWidth, settings)
      } else {
        for (const measure of rowMeasures) {
          measure.justifyContent(settings)
        }
      }
    }

    return rows
  }

  private stretchRowToWidth(
    rowMeasures: GraphicalGlobalMeasure[],
    targetWidth: number,
    settings: Settings,
  ) {
    const minWidths = rowMeasures.map((measure) => measure.width)
    const minTotal = minWidths.reduce((sum, width) => sum + width, 0)
    const extra = targetWidth - minTotal

    if (extra <= 0 || minTotal <= 0) {
      for (const measure of rowMeasures) {
        measure.justifyContent(settings)
      }
      return
    }

    let assignedExtra = 0
    for (let i = 0; i < rowMeasures.length; i++) {
      if (i === rowMeasures.length - 1) {
        rowMeasures[i].width = minWidths[i] + (extra - assignedExtra)
      } else {
        const share = extra * (minWidths[i] / minTotal)
        rowMeasures[i].width = minWidths[i] + share
        assignedExtra += share
      }
      rowMeasures[i].justifyContent(settings)
    }
  }

  calculatePageBreaks(rows: Pick<Row, "globalMeasures">[], settings: Settings, pageHeight: number) {
    this.pages = []
    let currentPage: Page = { height: 0, rows: [] }
    let currentYPosition = 0
    let previousBottomOverflow = 0

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]

      // Calculate system layout for this row
      const { systemHeight, instrumentPositions, topOverflow, bottomOverflow } = this.calculateRowLayout(row, settings)

      // Calculate total page height if we add this row
      let potentialPageHeight = this.calculatePotentialPageHeight(
        currentPage,
        systemHeight,
        topOverflow,
        bottomOverflow,
        settings,
      )

      // Handle page break if needed
      if (this.shouldBreakPage(potentialPageHeight, pageHeight)) {
        this.finalizePage(currentPage, pageHeight)

        // Start new page
        currentPage = { height: 0, rows: [] }
        currentYPosition = 0
        previousBottomOverflow = 0

        // Recalculate page height for the new page
        potentialPageHeight = this.calculatePotentialPageHeight(
          currentPage,
          systemHeight,
          topOverflow,
          bottomOverflow,
          settings,
        )
      }

      // Add top overflow space for first row on page
      if (this.isFirstRowOnPage(currentPage)) {
        currentYPosition += topOverflow
      }

      // Add row to current page
      const completedRow: Row = {
        ...row,
        relativeInstrumentsPosition: instrumentPositions,
        systemHeight,
        systemYPosition: currentYPosition,
      }
      currentPage.rows.push(completedRow)

      // Update page height and prepare for next row
      currentPage.height = potentialPageHeight - previousBottomOverflow
      currentYPosition = currentPage.height + settings.unit * settings.spaceBetweenStaveRows - bottomOverflow
      previousBottomOverflow = bottomOverflow
    }

    this.finalizePage(currentPage, pageHeight)
  }

  /**
   * Calculates the complete layout information for a row including system height,
   * instrument positions, and overflow values
   */
  private calculateRowLayout(row: Pick<Row, "globalMeasures">, settings: Settings) {
    let systemHeight = 0
    let currentInstrumentPosition = 0
    const instrumentPositions: InstrumentPosition[] = []
    let topOverflow = 0
    let bottomOverflow = 0

    // Calculate positions and overflow for each instrument
    for (let instrumentIndex = 0; instrumentIndex < this.instruments.length; instrumentIndex++) {
      // Set position for this instrument
      instrumentPositions[instrumentIndex] = currentInstrumentPosition

      // Add instrument height and spacing
      const instrumentHeight = settings.barlineHeight
      const spacingAbove = instrumentIndex > 0 ? settings.unit * settings.spaceBetweenInstrumentsRows : 0
      systemHeight += instrumentHeight + spacingAbove
      currentInstrumentPosition += instrumentHeight + settings.unit * settings.spaceBetweenInstrumentsRows

      // Calculate overflow for each measure in this row
      for (const graphicalGlobalMeasure of row.globalMeasures) {
        const graphicalMeasure = this.instruments[instrumentIndex].measures[graphicalGlobalMeasure.globalMeasure.index]

        // Only check top overflow for first instrument
        if (instrumentIndex === 0) {
          topOverflow = Math.max(topOverflow, graphicalMeasure.getTopStaveOverflow(settings))
        }

        // Only check bottom overflow for last instrument
        if (instrumentIndex === this.instruments.length - 1) {
          bottomOverflow = Math.max(bottomOverflow, graphicalMeasure.getBottomStaveOverflow(settings))
        }
      }
    }

    return { systemHeight, instrumentPositions, topOverflow, bottomOverflow }
  }

  /**
   * Calculates the total page height needed if we add a row with the given dimensions
   */
  private calculatePotentialPageHeight(
    currentPage: Page,
    systemHeight: number,
    topOverflow: number,
    bottomOverflow: number,
    settings: Settings,
  ): number {
    const spaceBetweenRows = currentPage.rows.length > 0 ? settings.unit * settings.spaceBetweenStaveRows : 0
    const topOverflowForPage = currentPage.rows.length > 0 ? 0 : topOverflow

    return currentPage.height + spaceBetweenRows + systemHeight + topOverflowForPage + bottomOverflow
  }

  /**
   * Determines if we need to break to a new page
   */
  private shouldBreakPage(requiredHeight: number, maxPageHeight: number): boolean {
    return maxPageHeight !== Infinity && requiredHeight > maxPageHeight
  }

  /**
   * Checks if this would be the first row on the current page
   */
  private isFirstRowOnPage(page: Page): boolean {
    return page.rows.length === 0
  }

  /**
   * Finalizes a page by setting its final height and adding it to the pages array
   */
  private finalizePage(page: Page, pageHeight: number): void {
    if (pageHeight === Infinity) {
      page.height = Math.ceil(page.height)
    } else {
      page.height = pageHeight
    }
    this.pages.push(page)
  }
}
