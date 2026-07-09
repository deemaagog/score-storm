import { ScoreStorm } from "./ScoreStorm"

export type PageParameters = {
  height: number
  fontSize: number
  width: number
}

/* eslint-disable no-unused-vars */
export interface IRenderer {
  isInitialized: boolean

  getContainerWidth(): number

  /**
   * Called once when the renderer is first used. ScoreStorm is passed here to give renderers
   * access to interaction event wiring and settings.
   *
   * TODO: this still couples low-level renderers to the top-level ScoreStorm orchestrator.
   * A cleaner approach would be to pass only what each renderer actually needs:
   * - an EventManager<InteractionEventMap> (interactionBus) for event subscription/dispatch
   * - Settings via PageParameters for rendering configuration
   * This would make renderers depend on narrow contracts instead of the full ScoreStorm class.
   */
  init(scoreStorm: ScoreStorm): void

  createPage(parameters: PageParameters): void

  postRender(): void

  clear(): void

  destroy(): void

  setColor(color: string): void

  getColor(): string

  drawRect(x: number, y: number, width: number, height: number): void

  drawCircle(x: number, y: number, radius: number): void

  drawGlyph(glyph: string | number, x: number, y: number): void

  renderInGroup(object: object, renderCallback: () => void): void
}
