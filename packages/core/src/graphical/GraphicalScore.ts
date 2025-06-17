import { Settings } from "../Settings"
import { Score } from "../model/Score"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"
import { GlobalMeasure } from "../model"

export type InstrumentPosition = number

export class Row {
  globalMeasures!: GlobalMeasure[]
  relativeInstrumentsPosition!: InstrumentPosition[]
  systemYPosition!: number
  systemHeight!: number // TODO: come up with a better name for this
}

export class Page {
  rows!: Row[]
  height!: number
}

/**
 * The main class for graphical representation of music score model
 */
export class GraphicalScore {
  pages!: Page[]
  score: Score

  constructor(score: Score) {
    this.score = score
  }

  calculateLineBreaks(containerWidth: number) {
    // calculate line breaks
    const rows: Pick<Row, "globalMeasures">[] = []
    const instrumentsCurrentClefs: GraphicalClef[] = []
    let currentTimeSignature: GraphicalTimeSignature

    let currentRowGlobalMeasures: GlobalMeasure[] = []
    let currentRowWidth = 0

    for (let gm = 0; gm < this.score.globalMeasures.length; gm++) {
      if (currentRowWidth >= containerWidth) {
        rows.push({
          globalMeasures: currentRowGlobalMeasures,
        })

        currentRowWidth = 0
        currentRowGlobalMeasures = []
      }

      const globalMeasure = this.score.globalMeasures[gm]
      if (globalMeasure.time) {
        currentTimeSignature = globalMeasure.time.graphical
      }
      globalMeasure.graphical.calculateMinContentWidth()

      // calculate measure attributes relative positions TODO: move to GraphicalGlobalMeasure
      let timeSignatureRelativeWidth = 0,
        clefRelativeWidth = 0
      for (let i = 0; i < this.score.instruments.length; i++) {
        const measure = this.score.instruments[i].measures[gm]
        if (measure.clef) {
          instrumentsCurrentClefs[i] = measure.clef.graphical
        }

        // first row
        if (!currentRowGlobalMeasures.length && gm === 0) {
          measure.graphical.time = currentTimeSignature! // we are certain that it's defined
          if (currentTimeSignature!.width > timeSignatureRelativeWidth) {
            timeSignatureRelativeWidth = currentTimeSignature!.width
          }
        }

        // first measure in row
        if (!currentRowGlobalMeasures.length) {
          measure.graphical.clef = instrumentsCurrentClefs[i]
          if (instrumentsCurrentClefs[i].width > clefRelativeWidth) {
            clefRelativeWidth = instrumentsCurrentClefs[i].width
          }
        } else {
          measure.graphical.clef = undefined // TODO: assign null instead of undefined???
        }
      }

      globalMeasure.graphical.timeSignatureRelativeWidth = timeSignatureRelativeWidth
      globalMeasure.graphical.clefRelativeWidth = clefRelativeWidth

      // const minContentWidth = graphicalGlobalMeasure.minContentWidth
      const minContentWidth = containerWidth / 2 // temp, just for demo
      // TODO: set graphical measure attributes, distribute available space , set actual width to graphicalGlobalMeasures
      globalMeasure.graphical.width = minContentWidth

      currentRowWidth += minContentWidth
      currentRowGlobalMeasures.push(globalMeasure)
    }

    if (currentRowGlobalMeasures.length) {
      rows.push({
        globalMeasures: currentRowGlobalMeasures,
      })
    }

    return rows
  }

  calculatePageBreaks(rows: Pick<Row, "globalMeasures">[], settings: Settings, pageHeight: number) {
    this.pages = []
    let currentPage: Page = { height: 0, rows: [] }
    let currentYPosition = 0
    let previousBottomOverflow = 0

    console.log("pageHeight", pageHeight)

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]

      // Calculate system layout for this row
      const { systemHeight, instrumentPositions, topOverflow, bottomOverflow } = this.calculateRowLayout(row, settings)
      console.log(
        "row #",
        rowIndex,
        "systemHeight",
        systemHeight,
        "topOverflow",
        topOverflow,
        "bottomOverflow",
        bottomOverflow,
      )

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
    for (let instrumentIndex = 0; instrumentIndex < this.score.instruments.length; instrumentIndex++) {
      // Set position for this instrument
      instrumentPositions[instrumentIndex] = currentInstrumentPosition

      // Add instrument height and spacing
      const instrumentHeight = settings.barlineHeight
      const spacingAbove = instrumentIndex > 0 ? settings.unit * settings.spaceBetweenInstrumentsRows : 0
      systemHeight += instrumentHeight + spacingAbove
      currentInstrumentPosition += instrumentHeight + settings.unit * settings.spaceBetweenInstrumentsRows

      // Calculate overflow for each measure in this row
      for (const globalMeasure of row.globalMeasures) {
        const graphicalMeasure = this.score.instruments[instrumentIndex].measures[globalMeasure.index].graphical

        // Only check top overflow for first instrument
        if (instrumentIndex === 0) {
          const measureTopOverflow = graphicalMeasure.getTopStaveOverflow(settings)
          topOverflow = Math.max(topOverflow, measureTopOverflow)
        }

        // Only check bottom overflow for last instrument
        if (instrumentIndex === this.score.instruments.length - 1) {
          const measureBottomOverflow = graphicalMeasure.getBottomStaveOverflow(settings)
          bottomOverflow = Math.max(bottomOverflow, measureBottomOverflow)
        }
      }
    }

    return {
      systemHeight,
      instrumentPositions,
      topOverflow,
      bottomOverflow,
    }
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
