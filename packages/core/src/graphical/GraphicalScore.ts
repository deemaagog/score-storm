import { Settings } from "../Settings"
import { Score } from "../model/Score"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"
import { GlobalMeasure } from "../model"

export type InstrumentPosition = number

export class Row {
  globalMeasures!: GlobalMeasure[]
  instrumentsPosition!: InstrumentPosition[]
  systemHeight!: number // TODO: come up with a better name for this
}

const SPACE_BETWEEN_STAVE_ROWS_COEF = 6 // space unit
const SPACE_BETWEEN_INSTRUMENTS_ROWS_COEF = 5 // space unit

/**
 * The main class for graphical representation of music score model
 */
export class GraphicalScore {
  rows!: Row[]
  height!: number
  score: Score

  constructor(score: Score) {
    this.score = score
  }

  calculateLineBreaks(containerWidth: number, settings: Settings) {
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

    this.calculateYPositionsAndScoreHeight(rows, settings)
  }

  calculateYPositionsAndScoreHeight(rows: Pick<Row, "globalMeasures">[], settings: Settings) {
    this.height = 0
    this.rows = []
    // calculate instruments Y position and total height

    let currentYPosition = 0
    
    for (let ri = 0; ri < rows.length; ri++) {
      let systemHeight = 0
      const instrumentPositions: InstrumentPosition[] = []

      const row = rows[ri]
      for (let i = 0; i < this.score.instruments.length; i++) {
        let currentYTopShift = 0
        let currentYBottomShift = 0
        for (let gmi = 0; gmi < row.globalMeasures.length; gmi++) {
          const globalMeasure = row.globalMeasures[gmi]

          const graphicalMeasure = this.score.instruments[i].measures[globalMeasure.index].graphical

          if (ri === 0 && i === 0) {
            const topStaveOverflow = graphicalMeasure.getTopStaveOverflow(settings)
            if (topStaveOverflow > currentYTopShift) {
              currentYTopShift = topStaveOverflow
            }
          }

          if (ri === rows.length - 1 && i === this.score.instruments.length - 1) {
            const bottomStaveOverflow = graphicalMeasure.getBottomStaveOverflow(settings)
            if (bottomStaveOverflow > currentYBottomShift) {
              currentYBottomShift = bottomStaveOverflow
            }
          }
        }

        currentYPosition += currentYTopShift
        instrumentPositions[i] = currentYPosition

        systemHeight += settings.barlineHeight
        currentYPosition += settings.barlineHeight
        this.height += currentYTopShift + settings.barlineHeight + currentYBottomShift

        if (i < this.score.instruments.length - 1) {
          systemHeight += settings.unit * SPACE_BETWEEN_INSTRUMENTS_ROWS_COEF
          currentYPosition += settings.unit * SPACE_BETWEEN_INSTRUMENTS_ROWS_COEF
          this.height += settings.unit * SPACE_BETWEEN_INSTRUMENTS_ROWS_COEF
        }
      }

      this.rows.push({ ...row, instrumentsPosition: instrumentPositions, systemHeight })

      if (ri < rows.length - 1) {
        currentYPosition += settings.unit * SPACE_BETWEEN_STAVE_ROWS_COEF
        this.height += settings.unit * SPACE_BETWEEN_STAVE_ROWS_COEF
      }
    }

    this.height = Math.ceil(this.height)
  }
}
