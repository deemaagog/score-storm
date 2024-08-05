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

    for (let gm = 0; gm < score.globalMeasures.length; gm++) {
      const globalMeasure = score.globalMeasures[gm]
      const graphicalGlobalMeasure = new GraphicalGlobalMeasure(globalMeasure)
      for (let i = 0; i < score.instruments.length; i++) {
        const instrument = score.instruments[i]
        const measure = instrument.measures[gm]
        graphicalGlobalMeasure.graphicalMeasures.push(new GraphicalMeasure(measure))
      }
      graphicalGlobalMeasure.calculateMinContentWidth()
      this.graphicalGlobalMeasures.push(graphicalGlobalMeasure)
    }
  }

  calculateLineBreaks(containerWidth: number, settings: Settings) {
    // calculate line breaks
    const rows: Omit<GraphicalRow, "instrumentsPosition">[] = []

    let currentRowGraphicalGlobalMeasures: GraphicalGlobalMeasure[] = []
    let currentRowWidth = 0

    for (let i = 0; i < this.graphicalGlobalMeasures.length; i++) {
      if (currentRowWidth >= containerWidth) {
        rows.push({
          graphicalGlobalMeasures: currentRowGraphicalGlobalMeasures,
        })

        currentRowWidth = 0
        currentRowGraphicalGlobalMeasures = []
      }

      const graphicalGlobalMeasure = this.graphicalGlobalMeasures[i]
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
    debugger
    this.height = 0
    this.rows = []
    // calculate instruments Y position and total height
    const instrumentsCurrentClefs: GraphicalClef[] = []
    let currentTimeSignature: GraphicalTimeSignature
    // let currentYTopShift = 0
    // let currentYBottomShift = 0
    let currentYPosition = 0

    for (let ri = 0; ri < rows.length; ri++) {
      const instrumentPositions: InstrumentPosition[] = []

      const row = rows[ri]
      for (let i = 0; i < this.score.instruments.length; i++) {
        for (let gmi = 0; gmi < row.graphicalGlobalMeasures.length; gmi++) {
          const graphicalGlobalMeasure = row.graphicalGlobalMeasures[gmi]

          const graphicalMeasure = graphicalGlobalMeasure.graphicalMeasures[i]
          const measure = graphicalMeasure.measure
          if (measure.clef) {
            instrumentsCurrentClefs[i] = new GraphicalClef(measure.clef)
          }

          if (graphicalGlobalMeasure.globalMeasure.time) {
            currentTimeSignature = new GraphicalTimeSignature(graphicalGlobalMeasure.globalMeasure.time)
          }

          // first row
          if (ri === 0) {
            graphicalMeasure.time = currentTimeSignature! // we are certain that it's defined
          }

          // first measure in row
          if (gmi === 0) {
            graphicalMeasure.clef = instrumentsCurrentClefs[i]
          }

          if (ri === 0 && i === 0) {
            if (graphicalMeasure.clef) {
              currentYPosition += graphicalMeasure.clef.getMaxY(settings)
            }
          } 
        }

        currentYPosition += settings.unit * SPACE_BETWEEN_INSTRUMENTS_ROWS_COEF + settings.barlineHeight
        instrumentPositions[i] = currentYPosition
        this.height += currentYPosition
      }

      this.rows.push({...row, instrumentsPosition: instrumentPositions})
      currentYPosition += settings.unit * SPACE_BETWEEN_STAVE_ROWS_COEF
    }

    
  }
}
