import { Settings } from './BaseRenderer'
import { BBox, IGraphical } from "./graphical/interfaces"

/* eslint-disable no-unused-vars */
export interface IRenderer {
  containerWidth: number
  isInitialized: boolean
  settings: Settings // adding this temporarily. TODO: make settings singlton or use dependency injection

  init(): void

  preRender(height: number, fontSize: number): void

  postRender(): void

  clear(): void

  destroy(): void

  setColor(color: string): void

  drawRect(x: number, y: number, width: number, height: number): void

  drawGlyph(glyph: string | number, x: number, y: number): void

  // setOnMouseMoveHandler?(handler: (x: number, y: number) => void): void

  registerInteractionArea(graphicalObject: IGraphical, bBox: BBox, renderCallback: () => void): void
}
