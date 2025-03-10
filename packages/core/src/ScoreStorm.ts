import RenderManager from "./RenderManager"
import { EventManager, EventType } from "./EventManager"
import { IRenderer } from "./interfaces"
import { Score } from "./model/Score"
import { ScoreStormSettings, Settings } from "./Settings"
import { ICommand } from "./commands/ICommand"
import { CommandManager } from "./CommandManager"

/**
 * The main entrypoint
 */
export class ScoreStorm {
  private score!: Score
  private renderManager: RenderManager
  private commandManager: CommandManager
  eventManager: EventManager
  settings: Settings

  constructor(settings?: ScoreStormSettings) {
    this.settings = new Settings(settings)
    this.eventManager = new EventManager()
    this.renderManager = new RenderManager(this)
    this.commandManager = new CommandManager(this)
  }

  public setScore(score: Score) {
    this.score = score
    this.eventManager.dispatch(EventType.NUMBER_OF_MEASURES_UPDATED, {
      numberOfMeasures: this.score.globalMeasures.length,
    })
    this.commandManager.clear()
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
    this.renderManager.render()
  }

  public destroy() {
    this.renderManager.destroy()
    this.eventManager.clear()
  }

  public setEventListener(...args: Parameters<typeof EventManager.prototype.on>) {
    this.eventManager.on(...args)
  }

  public executeCommand(command: ICommand) {
    this.commandManager.execute(command)
  }

  public undoCommand() {
    this.commandManager.undo()
  }

  public redoCommand() {
    this.commandManager.redo()
  }
}
