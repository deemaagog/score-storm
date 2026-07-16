import { Settings } from "../Settings"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"
import { GraphicalGlobalMeasure } from "./GraphicalGlobalMeasure"
import { GraphicalMeasure } from "./GraphicalMeasure"
import { GraphicalInstrument } from "./GraphicalInstrument"
import { Clef } from "../model/Clef"
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

  calculateLineBreaks(containerWidth: number) {
    const rows: Pick<Row, "globalMeasures">[] = []
    // tracks current Clef/TimeSignature model objects per instrument — fresh graphical
    // instances are created for each row so every occurrence gets its own stable x, y position
    const instrumentsCurrentClefs: (Clef | undefined)[] = []
    let currentTimeSignature: TimeSignature | undefined

    let currentRowGlobalMeasures: GraphicalGlobalMeasure[] = []
    let currentRowWidth = 0

    for (let gm = 0; gm < this.globalMeasures.length; gm++) {
      if (currentRowWidth >= containerWidth) {
        rows.push({ globalMeasures: currentRowGlobalMeasures })
        currentRowWidth = 0
        currentRowGlobalMeasures = []
      }

      const graphicalGlobalMeasure = this.globalMeasures[gm]
      if (graphicalGlobalMeasure.globalMeasure.time) {
        currentTimeSignature = graphicalGlobalMeasure.globalMeasure.time
      }
      graphicalGlobalMeasure.calculateMinContentWidth()

      // calculate measure attributes relative positions TODO: move to GraphicalGlobalMeasure
      let timeSignatureRelativeWidth = 0,
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

        // first measure in row — create a fresh GraphicalClef instance for this specific
        // row/measure so each occurrence gets its own stable position for hover/selection
        if (!currentRowGlobalMeasures.length) {
          if (instrumentsCurrentClefs[i]) {
            const graphicalClef = new GraphicalClef(instrumentsCurrentClefs[i]!, measure)
            graphicalMeasure.clef = graphicalClef
            if (graphicalClef.width > clefRelativeWidth) {
              clefRelativeWidth = graphicalClef.width
            }
          }
        } else {
          graphicalMeasure.clef = undefined // TODO: assign null instead of undefined???
        }
      }

      graphicalGlobalMeasure.timeSignatureRelativeWidth = timeSignatureRelativeWidth
      graphicalGlobalMeasure.clefRelativeWidth = clefRelativeWidth

      // const minContentWidth = graphicalGlobalMeasure.minContentWidth
      const minContentWidth = containerWidth / 2 // temp, just for demo
      // TODO: set graphical measure attributes, distribute available space , set actual width to graphicalGlobalMeasures
      graphicalGlobalMeasure.width = minContentWidth

      currentRowWidth += minContentWidth
      currentRowGlobalMeasures.push(graphicalGlobalMeasure)
    }

    if (currentRowGlobalMeasures.length) {
      rows.push({ globalMeasures: currentRowGlobalMeasures })
    }

    return rows
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
