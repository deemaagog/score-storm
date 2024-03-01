/* eslint-disable no-unused-vars */

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

export interface PositionedGlyph {
  glyph: Glyph
  shift: number
}

export interface GraphicalObject {
  width: number
  height: number

  object: PositionedGlyph | PositionedGlyph[]
}
