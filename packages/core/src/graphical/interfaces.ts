/* eslint-disable no-unused-vars */

import { Settings } from "../Settings"
import { IRenderer } from "../interfaces"

export interface GlyphBBoxes {
  bBoxNE: readonly [number, number]
  bBoxSW: readonly [number, number]
}

export interface Glyph {
  symbol: string
  smuflName: string
  advancedWidth: number // in spaces
  bBoxes: GlyphBBoxes
}

export type BBox = {
  x: number
  y: number
  width: number
  height: number
}

export interface IGraphical {
  id: string
  width: number // TODO: do we need that?
  height: number // TODO: do we need that?
  x: number
  y: number

  setPosition(x: number, y: number, settings: Settings): void

  render(renderer: IRenderer, settings: Settings): void

  getBBox(settings: Settings): BBox
}
