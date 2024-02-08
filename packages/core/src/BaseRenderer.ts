import { GraphicalScore, ScoreStormOptions } from "."
import { GraphicalMeasure } from "./GraphicalScore"
import { Score } from "./Score"
import { Renderer } from "./interfaces"

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

const SCALE_TO_FONT_RATIO = 64 / 100
const NUMBER_OF_STAFF_LINES = 5 // hardcode for now

/**
 * Main class responsible for rendering music score.
 */
class BaseRenderer {
  private renderParams: RenderParams
  private renderer!: Renderer
  private graphicalScore!: GraphicalScore
  private x: number = 0
  private y: number = 0

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
  }

  setRenderer(renderer: Renderer) {
    if (this.renderer) {
      console.log("destroying...")
      this.renderer.destroy()
    }
    this.renderer = renderer
  }

  render(score: Score) {
    console.log("rendering...")
    if (!this.renderer) {
      throw new Error("Renderer is not set!")
    }

    if (!this.renderer.isInitialized) {
      console.log("initializing...")
      this.renderer.init()
    }

    this.graphicalScore = new GraphicalScore(score, this.renderer.containerWidth, this.renderParams.unit)

    // clear
    this.renderer.clear()
    // set sizes and other stuff
    this.renderer.preRender(this.graphicalScore.height, this.renderParams.fontSize)
    // loop through measures and draw
    this.renderScore()
    // do some stuff when socre is rendered
    this.renderer.postRender()
  }

  renderScore() {
    this.x = 0
    this.y = 0

    for (let ri = 0; ri < this.graphicalScore.rows.length; ri++) {
      const latestRow = ri === this.graphicalScore.rows.length - 1
      const row = this.graphicalScore.rows[ri]

      for (let mi = 0; mi < row.measures.length; mi++) {
        const latestMeasureInRow = mi === row.measures.length - 1
        const graphicalMeasure = row.measures[mi]
        this.renderMeasure(graphicalMeasure, latestRow, latestMeasureInRow)
      }
      this.x = 0
      this.y += row.height
    }
  }

  renderMeasure(graphicalMeasure: GraphicalMeasure, latestRow: boolean, latestMeasureInRow: boolean) {
    // draw staff lines

    this.renderStaveLines(graphicalMeasure)

    // draw start bar line
    this.renderer.setColor(this.renderParams.mainColor)
    this.renderer.drawRect(this.x, this.y, this.renderParams.barLineThickness, this.renderParams.barlineHeight)

    this.renderMeasureNotes(graphicalMeasure)

    this.x += graphicalMeasure.width
    // draw end barline
    if (latestMeasureInRow) {
      if (latestRow) {
        this.renderer.drawRect(
          this.x - this.renderParams.unit,
          this.y,
          this.renderParams.barLineThickness,
          this.renderParams.barlineHeight,
        )
        this.renderer.drawRect(
          this.x - this.renderParams.barLineThickness * 3.8,
          this.y,
          this.renderParams.barLineThickness * 3.8,
          this.renderParams.barlineHeight,
        )
      } else {
        this.renderer.drawRect(
          this.x - this.renderParams.barLineThickness,
          this.y,
          this.renderParams.barLineThickness,
          this.renderParams.barlineHeight,
        )
      }
    }
  }

  renderStaveLines(graphicalMeasure: GraphicalMeasure) {
    this.renderer.setColor("#666666")
    const half = Math.floor(this.renderParams.numberOfStaffLines / 2)
    for (let index = -half; index <= half; index++) {
      this.renderer.drawRect(
        this.x,
        this.y + this.renderParams.midStave + this.renderParams.unit * index - this.renderParams.staffLineThickness / 2,
        graphicalMeasure.width,
        this.renderParams.staffLineThickness,
      )
    }
  }

  renderMeasureNotes(graphicalMeasure: GraphicalMeasure) {
    //  draw measure content
    //  for demo purpose, render whole rest
    this.renderer.drawGlyph(getText("U+E4E3"), this.x + graphicalMeasure.width / 2, this.y + this.renderParams.midStave)

    // time signature
    if (graphicalMeasure.globalMeasure.time) {
      const { count, unit } = graphicalMeasure.globalMeasure.time
      this.renderer.drawGlyph(
        getText(getTimeSignatureSymbol(count)),
        this.x + this.renderParams.unit,
        this.y + this.renderParams.midStave - this.renderParams.unit,
      )
      this.renderer.drawGlyph(
        getText(getTimeSignatureSymbol(unit)),
        this.x + this.renderParams.unit,
        this.y + this.renderParams.midStave + this.renderParams.unit,
      )
    }
  }
}

export default BaseRenderer
