import { Score } from "../model/Score"
import { GraphicalMeasure } from "./GraphicalMeasure"
import { GraphicalRow } from "./GraphicalRow"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"

const SPACE_BETWEEN_STAVE_ROWS_COEF = 10 // space unit

/**
 * The main class for graphical representation of music score model
 */
export class GraphicalScore {
  rows: GraphicalRow[]
  height: number

  constructor(score: Score, containerWidth: number, unit: number) {
    const measureWidth = containerWidth / 2 // temp, just for demo

    const rows: GraphicalRow[] = []
    let currentRowWidth = 0
    let currentRowGraphicalMeasures: GraphicalMeasure[] = []
    let isFirstMeasureInRow = true
    let isFirstRow = true

    for (let i = 0; i < score.measures.length; i++) {
      if (currentRowWidth >= containerWidth) {
        rows.push({ height: unit * SPACE_BETWEEN_STAVE_ROWS_COEF, measures: currentRowGraphicalMeasures })
        currentRowWidth = 0
        currentRowGraphicalMeasures = []
        isFirstMeasureInRow = true
      }

      const measure = score.measures[i]
      const globalMeasure = score.globalMeasures[i]
      currentRowWidth += measureWidth

      const graphicalMeasure = new GraphicalMeasure()
      graphicalMeasure.width = measureWidth

      if (isFirstRow) {
        graphicalMeasure.time = new GraphicalTimeSignature(globalMeasure.time)
      }

      if (isFirstMeasureInRow) {
        graphicalMeasure.clef = measure.clef
        graphicalMeasure.key = globalMeasure.key
      }

      currentRowGraphicalMeasures.push(graphicalMeasure)

      isFirstMeasureInRow = false
      isFirstRow = false
    }

    if (currentRowGraphicalMeasures.length) {
      rows.push({ height: unit * SPACE_BETWEEN_STAVE_ROWS_COEF, measures: currentRowGraphicalMeasures })
    }

    this.rows = rows
    this.height = unit * SPACE_BETWEEN_STAVE_ROWS_COEF * rows.length // very initial attempt to calculate total height
  }
}
