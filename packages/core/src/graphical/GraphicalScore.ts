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
    // calculate instruments Y position and total height
    this.pages = []
    let currentPage: Page = {
      height: 0,
      rows: [],
    }
    let currentYPosition = 0
    let previousBottomShift = 0

    for (let ri = 0; ri < rows.length; ri++) {
      let systemHeight = 0
      let currentRelativeInstrumentsPosition = 0
      const relativeInstrumentsPosition: InstrumentPosition[] = []
      let currentYTopShift = 0
      let currentYBottomShift = 0

      const row = rows[ri]
      for (let i = 0; i < this.score.instruments.length; i++) {
        for (let gmi = 0; gmi < row.globalMeasures.length; gmi++) {
          const globalMeasure = row.globalMeasures[gmi]
          const graphicalMeasure = this.score.instruments[i].measures[globalMeasure.index].graphical

          if (i === 0) {
            const topStaveOverflow = graphicalMeasure.getTopStaveOverflow(settings)
            if (topStaveOverflow > currentYTopShift) {
              currentYTopShift = topStaveOverflow
            }
          }

          if (i === this.score.instruments.length - 1) {
            const bottomStaveOverflow = graphicalMeasure.getBottomStaveOverflow(settings)
            if (bottomStaveOverflow > currentYBottomShift) {
              currentYBottomShift = bottomStaveOverflow
            }
          }
        }

        // currentYPosition += currentYTopShift
        relativeInstrumentsPosition[i] = currentRelativeInstrumentsPosition
        systemHeight += settings.barlineHeight + (i > 0 ? settings.unit * settings.spaceBetweenInstrumentsRows : 0)

        currentRelativeInstrumentsPosition +=
          settings.barlineHeight + settings.unit * settings.spaceBetweenInstrumentsRows
      }

      let newPageHeight =
        currentPage.height +
        (currentPage.rows.length > 0 ? settings.unit * settings.spaceBetweenStaveRows : 0) +
        systemHeight +
        (currentPage.rows.length > 0 ? 0 : currentYTopShift) +
        currentYBottomShift

      if (pageHeight !== Infinity) {
        if (newPageHeight > pageHeight) {
          newPageHeight = newPageHeight - currentPage.height - settings.unit * settings.spaceBetweenStaveRows
          currentPage.height = pageHeight
          this.pages.push(currentPage)
          currentPage = {
            height: 0,
            rows: [],
          }
          currentYPosition = 0
          previousBottomShift = 0
        }
      }

      if (currentPage.rows.length === 0) {
        currentYPosition += currentYTopShift
      }
      currentPage.height = newPageHeight - previousBottomShift
      currentPage.rows.push({ ...row, relativeInstrumentsPosition, systemHeight, systemYPosition: currentYPosition })
      currentYPosition = currentPage.height + settings.unit * settings.spaceBetweenStaveRows - currentYBottomShift

      previousBottomShift = currentYBottomShift
    }

    if (pageHeight === Infinity) {
      currentPage.height = Math.ceil(currentPage.height)
    } else {
      currentPage.height = pageHeight
    }
    this.pages.push(currentPage)
  }
}
