import RenderManager from "./RenderManager"
import { EventManager } from "./EventManager"
import { IRenderer } from "./interfaces"
import { Score } from "./model/Score"
import { ScoreStormSettings, Settings } from "./Settings"

/**
 * The main entrypoint
 */
export class ScoreStorm {
  private score: Score
  private renderManager!: RenderManager
  eventManager!: EventManager
  settings!: Settings

  constructor(settings?: ScoreStormSettings) {
    this.score = Score.createQuickScore()
    this.settings = new Settings(settings)
    this.eventManager = new EventManager()
    this.renderManager = new RenderManager(this)
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
    this.settings = new Settings(settings)
  }

  public setRenderer(renderer: IRenderer) {
    this.renderManager.setRenderer(renderer)
  }

  public getRenderer() {
    return this.renderManager.getRenderer()
  }

  public render() {
    this.renderManager.render(this.score)
  }

  public destroy() {
    this.renderManager.destroy()
    this.eventManager.clear()
  }

  public setEventListener(...args: Parameters<typeof EventManager.prototype.on>) {
    this.eventManager.on(...args)
  }
}
