import { Score } from "./model/Score"
import { Renderer } from "./interfaces"
import { ScoreStormOptions } from "./ScoreStorm"
import { GraphicalScore } from "./graphical/GraphicalScore"
import { GraphicalMeasure } from "./graphical/GraphicalMeasure"

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
const TIME_SIGNATURE_MARGIN = 1 // space between start barline and time signature

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
      // eslint-disable-next-line no-console
      console.log("destroying...")
      this.renderer.destroy()
    }
    this.renderer = renderer
  }

  render(score: Score) {
    // eslint-disable-next-line no-console
    console.log("rendering...")
    if (!this.renderer) {
      throw new Error("Renderer is not set!")
    }

    if (!this.renderer.isInitialized) {
      // eslint-disable-next-line no-console
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

    this.renderMeasureContent(graphicalMeasure)

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

  renderMeasureContent(graphicalMeasure: GraphicalMeasure) {
    //  draw measure content
    this.renderTimeSignature(graphicalMeasure)

    //  for demo purpose, render whole rest
    this.renderer.drawGlyph(
      this.getTextFromUnicode("U+E4E3"),
      this.x + graphicalMeasure.width / 2,
      this.y + this.renderParams.midStave,
    )
  }

  renderTimeSignature(graphicalMeasure: GraphicalMeasure) {
    if (graphicalMeasure.time) {
      for (const positionedGlyph of graphicalMeasure.time.object) {
        this.renderer.drawGlyph(
          this.getTextFromUnicode(positionedGlyph.glyph.symbol),
          this.x + this.renderParams.unit * TIME_SIGNATURE_MARGIN,
          this.y + this.renderParams.midStave + this.renderParams.unit * positionedGlyph.shift,
        )
      }
    }
  }

  renderClef() {
    // this.renderer.drawGlyph(
    //   getText("U+E050"),
    //   this.x + graphicalMeasure.width / 2 - 60,
    //   this.y + this.renderParams.midStave + this.renderParams.unit,
    // )
    // this.renderer.drawGlyph(
    //   getText("U+E062"),
    //   this.x + graphicalMeasure.width / 2 + 60,
    //   this.y + this.renderParams.midStave - this.renderParams.unit,
    // )
  }

  getTextFromUnicode(unicodeSymbol: string) {
    const codeString = parseInt(unicodeSymbol.replace("U+", ""), 16)
    return String.fromCharCode(codeString)
  }
}

export default BaseRenderer
