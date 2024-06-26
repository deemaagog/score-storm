import { Settings } from "./BaseRenderer"
import { EventManager } from "./EventManager"

/* eslint-disable no-unused-vars */
export interface IRenderer {
  containerWidth: number
  isInitialized: boolean

  // adding this temporarily. TODO: make settings singlton and eventManager or use dependency injection
  settings: Settings
  eventManager: EventManager

  init(): void

  preRender(height: number, fontSize: number): void

  postRender(): void

  clear(): void

  destroy(): void

  setColor(color: string): void

  drawRect(x: number, y: number, width: number, height: number): void

  drawGlyph(glyph: string | number, x: number, y: number): void

  renderInGroup(object: object, renderCallback: () => void): void
}
