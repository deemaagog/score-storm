import { Score } from "./model/Score"
import { Renderer } from "./interfaces"
import { ScoreStormSettings } from "./ScoreStorm"
import { GraphicalScore } from "./graphical/GraphicalScore"
import { GraphicalMeasure } from "./graphical/GraphicalMeasure"

export type Settings = {
  fontSize: number
  unit: number
  numberOfStaffLines: number
  staffLineThickness: number
  clefMargin: number
  timeSignatureMargin: number
  barLineThickness: number
  barlineHeight: number
  midStave: number
  mainColor: string
  staveLineColor: string
} & Pick<ScoreStormSettings, "debug">

const SCALE_TO_FONT_RATIO = 64 / 100
const NUMBER_OF_STAFF_LINES = 5 // hardcode for now

/**
 * Main class responsible for rendering music score.
 */
class BaseRenderer {
  private settings!: Settings
  private renderer!: Renderer
  private graphicalScore!: GraphicalScore
  private x: number = 0
  private y: number = 0

  constructor(options?: ScoreStormSettings) {
    this.setSettings(options)
  }

  setSettings(options?: ScoreStormSettings) {
    const { scale = 100, ...rest } = options || {}
    const fontSize = scale * SCALE_TO_FONT_RATIO
    const unit = fontSize / 4
    const staffLineThickness = unit / 8
    const barlineHeight = unit * 4 + staffLineThickness

    this.settings = {
      fontSize,
      unit,
      numberOfStaffLines: NUMBER_OF_STAFF_LINES,
      staffLineThickness,
      clefMargin: 1,
      timeSignatureMargin: 1,
      barLineThickness: staffLineThickness * 1.2,
      mainColor: "black",
      staveLineColor: "#666666",
      barlineHeight,
      midStave: barlineHeight / 2,
      ...rest,
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

    this.graphicalScore = new GraphicalScore(score, this.renderer.containerWidth, this.settings)

    // clear
    this.renderer.clear()
    // set sizes and other stuff
    this.renderer.preRender(this.graphicalScore.height, this.settings.fontSize)
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
      this.y = row.yPosition

      for (let mi = 0; mi < row.measures.length; mi++) {
        const latestMeasureInRow = mi === row.measures.length - 1
        const graphicalMeasure = row.measures[mi]
        this.renderMeasure(graphicalMeasure, latestRow, latestMeasureInRow)
      }
      this.x = 0
    }
  }

  renderMeasure(graphicalMeasure: GraphicalMeasure, latestRow: boolean, latestMeasureInRow: boolean) {
    // draw staff lines

    this.renderStaveLines(graphicalMeasure)

    // draw start bar line
    this.renderer.setColor(this.settings.mainColor)
    this.renderer.drawRect(this.x, this.y, this.settings.barLineThickness, this.settings.barlineHeight)

    this.renderMeasureContent(graphicalMeasure)

    this.x += graphicalMeasure.width
    // draw end barline
    if (latestMeasureInRow) {
      if (latestRow) {
        this.renderer.drawRect(
          this.x - this.settings.unit,
          this.y,
          this.settings.barLineThickness,
          this.settings.barlineHeight,
        )
        this.renderer.drawRect(
          this.x - this.settings.barLineThickness * 3.8,
          this.y,
          this.settings.barLineThickness * 3.8,
          this.settings.barlineHeight,
        )
      } else {
        this.renderer.drawRect(
          this.x - this.settings.barLineThickness,
          this.y,
          this.settings.barLineThickness,
          this.settings.barlineHeight,
        )
      }
    }
  }

  renderStaveLines(graphicalMeasure: GraphicalMeasure) {
    this.renderer.setColor(this.settings.staveLineColor)
    const half = Math.floor(this.settings.numberOfStaffLines / 2)
    for (let index = -half; index <= half; index++) {
      this.renderer.drawRect(
        this.x,
        this.y + this.settings.midStave + this.settings.unit * index - this.settings.staffLineThickness / 2,
        graphicalMeasure.width,
        this.settings.staffLineThickness,
      )
    }
  }

  renderMeasureContent(graphicalMeasure: GraphicalMeasure) {
    //  draw measure content
    // temporarily do horizontal positioning here, but ultimately this should be done in GraphicalMeasure
    let measureX = this.x
    if (graphicalMeasure.clef) {
      measureX += this.settings.unit * this.settings.clefMargin
      graphicalMeasure.clef.render(measureX, this.y + this.settings.midStave, this.renderer, this.settings)
      measureX += this.settings.unit * graphicalMeasure.clef.width
    }

    if (graphicalMeasure.time) {
      measureX += this.settings.unit * this.settings.timeSignatureMargin
      graphicalMeasure.time.render(measureX, this.y + this.settings.midStave, this.renderer, this.settings)
    }

    //  for demo purpose, render whole rest
    const bboxes = { bBoxNE: [1.128, 0.036], bBoxSW: [0, -0.54] }
    this.renderer.drawGlyph(
      this.getTextFromUnicode("U+E4E3"),
      this.x + graphicalMeasure.width / 2 - bboxes.bBoxSW[0] * this.settings.unit,
      this.y + this.settings.midStave,
    )
  }

  getTextFromUnicode(unicodeSymbol: string) {
    const codeString = parseInt(unicodeSymbol.replace("U+", ""), 16)
    return String.fromCharCode(codeString)
  }
}

export default BaseRenderer
