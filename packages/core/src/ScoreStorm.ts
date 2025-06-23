import RenderManager from "./RenderManager"
import { EventManager } from "./EventManager"
import { IRenderer } from "./interfaces"
import { Score } from "./model/Score"
import { ScoreStormSettings, Settings } from "./Settings"
import { ICommand } from "./commands/ICommand"
import { CommandManager } from "./CommandManager"
import { ILayout } from "./layouts"
import { EventMap, EventType, InteractionEventMap } from "./events"

/**
 * The main entrypoint
 */
export class ScoreStorm {
  private score!: Score
  private renderManager: RenderManager
  private commandManager: CommandManager
  eventManager: EventManager<EventMap>
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

  public setEventListener(...args: Parameters<typeof this.eventManager.on>) {
    this.eventManager.on(...args)
  }

  public setInteractionEventListener<K extends keyof InteractionEventMap>(
    eventType: K,
    listener: (event: InteractionEventMap[K]) => void,
  ) {
    this.renderManager.setInteractionEventListener(eventType, listener)
  }

  public dispatchInteractionEvent<K extends keyof InteractionEventMap>(eventType: K, event: InteractionEventMap[K]) {
    this.renderManager.dispatchInteractionEvent(eventType, event)
  }

  public removeInteractionEventListener<K extends keyof InteractionEventMap>(
    eventType: K,
    listener: (event: InteractionEventMap[K]) => void,
  ) {
    this.renderManager.removeInteractionEventListener(eventType, listener)
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

  public setLayout(layout: ILayout) {
    this.renderManager.setLayout(layout)
  }

  public getLayout(): ILayout {
    return this.renderManager.getLayout()
  }
}
