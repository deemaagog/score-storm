import { Settings } from "../BaseRenderer"
import { Clef } from "../model/Measure"
import { Score } from "../model/Score"
import { GraphicalMeasure } from "./GraphicalMeasure"
import { GraphicalRow } from "./GraphicalRow"

const SPACE_BETWEEN_STAVE_ROWS_COEF = 6 // space unit

/**
 * The main class for graphical representation of music score model
 */
export class GraphicalScore {
  rows: GraphicalRow[]
  height: number

  constructor(score: Score, containerWidth: number, settings: Settings) {
    const measureWidth = containerWidth / 2 // temp, just for demo

    const rows: GraphicalRow[] = []
    let currentRowWidth = 0
    let currentRowGraphicalMeasures: GraphicalMeasure[] = []
    let isFirstMeasureInRow = true
    let isFirstRow = true
    let currentClef: Clef
    let currentYTopShift = 0
    let currentYBottomShift = 0
    let currentYPosition = 0
    this.height = 0

    for (let i = 0; i < score.measures.length; i++) {
      if (currentRowWidth >= containerWidth) {
        currentYPosition =
          currentYPosition +
          (isFirstRow ? currentYTopShift : settings.unit * SPACE_BETWEEN_STAVE_ROWS_COEF + settings.barlineHeight)
        rows.push({
          measures: currentRowGraphicalMeasures,
          yPosition: currentYPosition,
        })

        this.height =
          this.height +
          (isFirstRow ? currentYTopShift : settings.unit * SPACE_BETWEEN_STAVE_ROWS_COEF) +
          settings.barlineHeight

        currentRowWidth = 0
        currentRowGraphicalMeasures = []
        isFirstMeasureInRow = true

        currentYTopShift = 0
        currentYBottomShift = 0

        isFirstRow = false
      }

      const measure = score.measures[i]
      const globalMeasure = score.globalMeasures[i]
      currentRowWidth += measureWidth

      if (isFirstRow && isFirstMeasureInRow) {
        if (!measure.clef) {
          throw new Error("Clef is not set in first measure")
        }
        currentClef = measure.clef
      }

      const graphicalMeasure = new GraphicalMeasure({
        width: measureWidth,
        clef: isFirstMeasureInRow ? currentClef! : undefined,
        time: isFirstRow ? globalMeasure.time : undefined,
        events: measure.events,
      })

      if (graphicalMeasure.clef) {
        currentYTopShift = graphicalMeasure.clef.getMaxY(settings)
        currentYBottomShift = graphicalMeasure.clef.getMinY(settings)
      }

      currentRowGraphicalMeasures.push(graphicalMeasure)

      isFirstMeasureInRow = false
    }

    if (currentRowGraphicalMeasures.length) {
      currentYPosition =
        currentYPosition +
        (isFirstRow ? currentYTopShift : settings.unit * SPACE_BETWEEN_STAVE_ROWS_COEF + settings.barlineHeight)
      this.height +=
        (isFirstRow ? currentYTopShift : settings.unit * SPACE_BETWEEN_STAVE_ROWS_COEF) + settings.barlineHeight
      rows.push({
        measures: currentRowGraphicalMeasures,
        yPosition: currentYPosition,
      })
    }

    this.height += currentYBottomShift
    this.height = Math.ceil(this.height) // that needs to be done at row level
    this.rows = rows
  }
}
