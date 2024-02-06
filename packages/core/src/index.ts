import { GraphicalScore } from "./GraphicalScore"
import { Renderer } from "./interfaces"
import { Score } from "./Score"
export { Score, Renderer, GraphicalScore }

const SCALE_TO_FONT_RATIO = 64 / 100
const NUMBER_OF_STAFF_LINES = 5 // hardcode for now

function getText(unicodeSymbol: string) {
  const codeString = parseInt(unicodeSymbol.replace("U+", ""), 16)
  return String.fromCharCode(codeString)
}

function getTimeSignatureSymbol(n: number) {
  const map = {
    0: "U+E080",
    1: "U+E081",
    2: "U+E082",
    3: "U+E083",
    4: "U+E084",
    5: "U+E085",
    6: "U+E086",
    7: "U+E087",
    8: "U+E088",
    9: "U+E089",
  }

  // @ts-expect-error temp
  return map[n] || map[0]
}

export interface ScoreStormOptions {
  scale: number
}

export interface RenderParams {
  fontSize: number
  unit: number
  numberOfStaffLines: number
  staffLineThickness: number
  clefPadding: number
  barLineThickness: number
  barlineHeight: number
  midStave: number
  mainColor: string
  staveLineColor: string
}

class ScoreStorm {
  private score: Score
  private renderer?: Renderer
  private renderParams: RenderParams

  constructor(options?: ScoreStormOptions) {
    const scale = options?.scale || 100
    const fontSize = scale * SCALE_TO_FONT_RATIO
    const unit = fontSize / 4
    const staffLineThickness = unit / 8
    const barlineHeight = unit * 4 + staffLineThickness

    this.renderParams = {
      fontSize,
      unit,
      numberOfStaffLines: NUMBER_OF_STAFF_LINES,
      staffLineThickness,
      clefPadding: unit,
      barLineThickness: staffLineThickness * 1.2,
      mainColor: "black",
      staveLineColor: "red",
      barlineHeight,
      midStave: barlineHeight / 2,
    }

    this.score = Score.createDefaultScore()
  }

  setScore(score: Score) {
    this.score = score
  }

  getScore() {
    return this.score
  }

  setRenderer(renderer: Renderer) {
    this.renderer = renderer
  }

  render() {
    if (!this.renderer) {
      throw new Error("Renderer is not set!")
    }

    const graphicalScore = new GraphicalScore(this.score, this.renderer.containerWidth, this.renderParams)

    // Render score. TODO: refactor this to separate class
    // clear
    this.renderer.clear()
    // set sizes
    this.renderer.prepare(graphicalScore.height, this.renderParams.fontSize)
    // loop through measures and draw
    let x = 0
    let y = 0

    for (let ri = 0; ri < graphicalScore.rows.length; ri++) {
      const latestRow = ri === graphicalScore.rows.length - 1
      const row = graphicalScore.rows[ri]

      for (let mi = 0; mi < row.measures.length; mi++) {
        const latestMeasureInRow = mi === row.measures.length - 1
        const graphicalMeasure = row.measures[mi]

        // draw staff lines

        this.renderer.setColor("#666666")
        const half = Math.floor(this.renderParams.numberOfStaffLines / 2)
        for (let index = -half; index <= half; index++) {
          this.renderer.drawRect(
            x,
            y + this.renderParams.midStave + this.renderParams.unit * index - this.renderParams.staffLineThickness / 2,
            graphicalMeasure.width,
            this.renderParams.staffLineThickness,
          )
        }

        // draw start bar line
        this.renderer.setColor(this.renderParams.mainColor)
        this.renderer.drawRect(x, y, this.renderParams.barLineThickness, this.renderParams.barlineHeight)

        //  draw measure content
        //  draw time signature
        this.renderer.drawGlyph(getText("U+E4E3"), x + graphicalMeasure.width / 2, y + this.renderParams.midStave)

        if (graphicalMeasure.globalMeasure.time) {
          const { count, unit } = graphicalMeasure.globalMeasure.time
          this.renderer.drawGlyph(
            getText(getTimeSignatureSymbol(count)),
            x + this.renderParams.unit,
            y + this.renderParams.midStave - this.renderParams.unit,
          )
          this.renderer.drawGlyph(
            getText(getTimeSignatureSymbol(unit)),
            x + this.renderParams.unit,
            y + this.renderParams.midStave + this.renderParams.unit,
          )
        }

        x += graphicalMeasure.width
        // draw end barline
        if (latestMeasureInRow) {
          if (latestRow) {
            this.renderer.drawRect(
              x - this.renderParams.unit,
              y,
              this.renderParams.barLineThickness,
              this.renderParams.barlineHeight,
            )
            this.renderer.drawRect(
              x - this.renderParams.barLineThickness * 3.8,
              y,
              this.renderParams.barLineThickness * 3.8,
              this.renderParams.barlineHeight,
            )
          } else {
            this.renderer.drawRect(
              x - this.renderParams.barLineThickness,
              y,
              this.renderParams.barLineThickness,
              this.renderParams.barlineHeight,
            )
          }
        }
      }
      x = 0
      y += row.height
    }
  }
}

export default ScoreStorm
