import { RenderParams } from "../BaseRenderer"
import { Renderer } from "../interfaces"
import { Clef } from "../model/Measure"
import { BaseGraphical } from "./BaseGraphical"
import { ClefG, ClefF } from "./glyphs/clef"
import { Glyph, IGraphical } from "./interfaces"

export class GraphicalClef extends BaseGraphical implements IGraphical {
  height!: number
  width!: number
  clefGlyph: Glyph
  verticalShift: number // value in stave spaces

  static glyphMap = {
    G: ClefG,
    F: ClefF,
  }

  constructor(clef: Clef) {
    super()
    const { position, sign } = clef

    this.verticalShift = position * -0.5

    this.clefGlyph = GraphicalClef.glyphMap[sign as keyof typeof GraphicalClef.glyphMap]

    // TODO: this validation has to be done at score model level
    if (!this.clefGlyph) {
      throw new Error(`Invalid time signature ${sign}`)
    }

    const clefGlyphHeight = this.clefGlyph.bBoxes.bBoxNE[1] - this.clefGlyph.bBoxes.bBoxSW[1]

    this.height = clefGlyphHeight

    const clefGlyphWidth = this.clefGlyph.bBoxes.bBoxNE[0] + this.clefGlyph.bBoxes.bBoxSW[0]

    this.width = clefGlyphWidth
  }

  render(x: number, y: number, renderer: Renderer, params: RenderParams) {
    renderer.drawGlyph(this.getTextFromUnicode(this.clefGlyph.symbol), x, y + params.unit * this.verticalShift)
  }
}
