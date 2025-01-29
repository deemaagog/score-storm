import { Settings } from "../BaseRenderer"
import { Clef } from "../model/Clef"
import { Score } from "../model/Score"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalGlobalMeasure } from "./GraphicalGlobalMeasure"
import { GraphicalMeasure } from "./GraphicalMeasure"
import { GraphicalRow, InstrumentPosition } from "./GraphicalRow"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"

const SPACE_BETWEEN_STAVE_ROWS_COEF = 6 // space unit
const SPACE_BETWEEN_INSTRUMENTS_ROWS_COEF = 5 // space unit

/**
 * The main class for graphical representation of music score model
 */
export class GraphicalScore {
  rows!: GraphicalRow[]
  height!: number
  graphicalGlobalMeasures: GraphicalGlobalMeasure[] = []
  score: Score

  constructor(score: Score) {
    this.score = score
    for (let gm = 0; gm < this.score.globalMeasures.length; gm++) {
      const globalMeasure = this.score.globalMeasures[gm]
      const graphicalGlobalMeasure = new GraphicalGlobalMeasure(globalMeasure)
      for (let i = 0; i < this.score.instruments.length; i++) {
        const instrument = this.score.instruments[i]
        const measure = instrument.measures[gm]
        graphicalGlobalMeasure.graphicalMeasures.push(new GraphicalMeasure(measure))
      }
      this.graphicalGlobalMeasures.push(graphicalGlobalMeasure)
    }
  }

  calculateLineBreaks(containerWidth: number, settings: Settings) {
    // calculate line breaks
    const rows: Omit<GraphicalRow, "instrumentsPosition">[] = []
    const instrumentsCurrentClefs: GraphicalClef[] = []
    let currentTimeSignature: GraphicalTimeSignature

    let currentRowGraphicalGlobalMeasures: GraphicalGlobalMeasure[] = []
    let currentRowWidth = 0

    for (let ggm = 0; ggm < this.graphicalGlobalMeasures.length; ggm++) {
      if (currentRowWidth >= containerWidth) {
        rows.push({
          graphicalGlobalMeasures: currentRowGraphicalGlobalMeasures,
        })

        currentRowWidth = 0
        currentRowGraphicalGlobalMeasures = []
      }

      const graphicalGlobalMeasure = this.graphicalGlobalMeasures[ggm]
      if (graphicalGlobalMeasure.globalMeasure.time) {
        currentTimeSignature = new GraphicalTimeSignature(graphicalGlobalMeasure.globalMeasure.time)
      }
      graphicalGlobalMeasure.calculateMinContentWidth()

      // calculate measure attributes relative positions TODO: move to GraphicalGlobalMeasure
      let timeSignatureRelativeWidth = 0,
        clefRelativeWidth = 0
      for (let i = 0; i < this.score.instruments.length; i++) {
        const graphicalMeasure = graphicalGlobalMeasure.graphicalMeasures[i]
        const measure = graphicalMeasure.measure
        if (measure.clef) {
          instrumentsCurrentClefs[i] = new GraphicalClef(measure.clef)
        }

        // first row
        if (!currentRowGraphicalGlobalMeasures.length && ggm === 0) {
          graphicalMeasure.time = currentTimeSignature! // we are certain that it's defined
          if (graphicalMeasure.time.width > timeSignatureRelativeWidth) {
            timeSignatureRelativeWidth = graphicalMeasure.time.width
          }
        }

        // first measure in row
        if (!currentRowGraphicalGlobalMeasures.length) {
          graphicalMeasure.clef = instrumentsCurrentClefs[i]
          if (graphicalMeasure.clef.width > clefRelativeWidth) {
            clefRelativeWidth = graphicalMeasure.clef.width
          }
        }
      }

      graphicalGlobalMeasure.timeSignatureRelativeWidth = timeSignatureRelativeWidth
      graphicalGlobalMeasure.clefRelativeWidth = clefRelativeWidth

      // const minContentWidth = graphicalGlobalMeasure.minContentWidth
      const minContentWidth = containerWidth / 2 // temp, just for demo
      // TODO: set graphical measure attributes, distribute available space , set actual width to graphicalGlobalMeasures
      graphicalGlobalMeasure.width = minContentWidth

      currentRowWidth += minContentWidth
      currentRowGraphicalGlobalMeasures.push(graphicalGlobalMeasure)
    }

    if (currentRowGraphicalGlobalMeasures.length) {
      rows.push({
        graphicalGlobalMeasures: currentRowGraphicalGlobalMeasures,
      })
    }

    this.calculateYPositionsAndScoreHeight(rows, settings)
  }

  calculateYPositionsAndScoreHeight(rows: Omit<GraphicalRow, "instrumentsPosition">[], settings: Settings) {
    this.height = 0
    this.rows = []
    // calculate instruments Y position and total height

    let currentYPosition = 0

    for (let ri = 0; ri < rows.length; ri++) {
      const instrumentPositions: InstrumentPosition[] = []

      const row = rows[ri]
      for (let i = 0; i < this.score.instruments.length; i++) {
        let currentYTopShift = 0
        let currentYBottomShift = 0
        for (let gmi = 0; gmi < row.graphicalGlobalMeasures.length; gmi++) {
          const graphicalGlobalMeasure = row.graphicalGlobalMeasures[gmi]

          const graphicalMeasure = graphicalGlobalMeasure.graphicalMeasures[i]

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

        currentYPosition += settings.barlineHeight
        this.height += currentYTopShift + settings.barlineHeight + currentYBottomShift

        if (i < this.score.instruments.length - 1) {
          currentYPosition += settings.unit * SPACE_BETWEEN_INSTRUMENTS_ROWS_COEF
          this.height += settings.unit * SPACE_BETWEEN_INSTRUMENTS_ROWS_COEF
        }
      }

      this.rows.push({ ...row, instrumentsPosition: instrumentPositions })

      if (ri < rows.length - 1) {
        currentYPosition += settings.unit * SPACE_BETWEEN_STAVE_ROWS_COEF
        this.height += settings.unit * SPACE_BETWEEN_STAVE_ROWS_COEF
      }
    }

    this.height = Math.ceil(this.height)
  }
}
