import { ScoreStorm } from "./ScoreStorm"

/* eslint-disable no-unused-vars */
export interface IRenderer {
  /**
   * This holds the reference to the ScoreStorm instance. It is set by the RenderManager and should not be set manually.
   * It is used to access the settings and eventManager.
   */
  scoreStorm: ScoreStorm

  containerWidth: number
  isInitialized: boolean

  init(): void

  preRender(height: number, fontSize: number): void

  postRender(): void

  clear(): void

  destroy(): void

  setColor(color: string): void

  getColor(): string

  drawRect(x: number, y: number, width: number, height: number): void

  drawGlyph(glyph: string | number, x: number, y: number): void

  renderInGroup(object: object, renderCallback: () => void): void
}
