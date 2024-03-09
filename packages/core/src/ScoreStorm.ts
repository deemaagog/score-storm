import BaseRenderer from "./BaseRenderer"
import { GraphicalScore } from "./graphical/GraphicalScore"
import { Renderer } from "./interfaces"
import { Score } from "./model/Score"
export { Score, type Renderer, GraphicalScore }

export interface ScoreStormSettings {
  scale: number
  debug?: {
    bBoxes: boolean
  }
}

/**
 * The main entrypoint
 */
export class ScoreStorm {
  private score: Score
  private baseRenderer!: BaseRenderer
  private settings?: ScoreStormSettings

  constructor(settings?: ScoreStormSettings) {
    this.score = Score.createDefaultScore()
    this.settings = settings
    this.baseRenderer = new BaseRenderer(settings)
  }

  public setScore(score: Score) {
    this.score = score
  }

  public getScore() {
    return this.score
  }

  public getSettings() {
    return this.settings
  }

  public setSettings(settings?: ScoreStormSettings) {
    this.settings = settings
    this.baseRenderer.setSettings(settings)
  }

  public setRenderer(renderer: Renderer) {
    this.baseRenderer.setRenderer(renderer)
  }

  public render() {
    this.baseRenderer.render(this.score)
  }
}
