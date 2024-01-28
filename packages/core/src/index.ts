import { Renderer } from "./interfaces"
import { Score } from "./model/Score"
export { Score, Renderer }

const SCALE_TO_FONT_RATIO = 64 / 100
const NUMBER_OF_STAFF_LINES = 5 // hardcode for now

export interface ScoreStormOptions {
  scale: number
}

export interface RenderParams {
  fontSize: number
  unit: number
  padding: number
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
      padding: 40,
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
    this.renderer.render(this.score, this.renderParams)
  }
}

export default ScoreStorm
