import BaseRenderer from "./BaseRenderer"
import { IRenderer } from "./interfaces"
import { Score } from "./model/Score"

export interface ScoreStormSettings {
  scale: number
  debug?: {
    bBoxes: boolean
  }
  editor?: {
    enable: boolean,
    styles: {
      hoverColor: string
    }
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
    this.score = Score.createQuickScore()
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

  public setRenderer(renderer: IRenderer) {
    this.baseRenderer.setRenderer(renderer)
  }

  public render() {
    this.baseRenderer.render(this.score)
  }
}
