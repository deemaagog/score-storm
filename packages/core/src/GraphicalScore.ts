import { RenderParams } from "."
import { GlobalMeasure, Score } from "./Score"

const SPACE_BETWEEN_STAVE_ROWS_COEF = 10 // space unit

interface GraphicalScoreRow {
  height: number
  measures: GraphicalScoreMeasure[]
}

interface GraphicalScoreMeasure {
  width: number
  globalMeasure: GlobalMeasure
}

/**
 * The main class for graphical representation of music score model
 */
export class GraphicalScore {
  rows: GraphicalScoreRow[]
  height: number

  constructor(score: Score, containerWidth: number, renderParams: RenderParams) {
    const measureWidth = containerWidth / 2 // temp, just for demo

    const rows: GraphicalScoreRow[] = []
    let currentRowWidth = 0
    let currentRowGraphicalMeasures: GraphicalScoreMeasure[] = []
    for (const globalMeasure of score.globalMeasures) {
      if (currentRowWidth >= containerWidth) {
        rows.push({ height: renderParams.unit * SPACE_BETWEEN_STAVE_ROWS_COEF, measures: currentRowGraphicalMeasures })
        currentRowWidth = 0
        currentRowGraphicalMeasures = []
      }
      currentRowWidth += measureWidth
      currentRowGraphicalMeasures.push({ width: measureWidth, globalMeasure })
    }

    if (currentRowGraphicalMeasures.length) {
      rows.push({ height: renderParams.unit * SPACE_BETWEEN_STAVE_ROWS_COEF, measures: currentRowGraphicalMeasures })
    }

    this.rows = rows
    this.height= renderParams.unit * SPACE_BETWEEN_STAVE_ROWS_COEF* rows.length // very initial attempt to calculate total height
  }
}