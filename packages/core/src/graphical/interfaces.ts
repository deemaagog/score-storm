/* eslint-disable no-unused-vars */

import { Settings } from "../BaseRenderer"
import { Renderer } from "../interfaces"

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

export interface IGraphical {
  width: number // TODO: do we need that?
  height: number // TODO: do we need that?

  render(
    x: number /*  measure start X coodinate */,
    y: number /*  middle of stave */,
    renderer: Renderer,
    settings: Settings,
  ): void
}
