import { Settings } from "../BaseRenderer"
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

    const clefGlyphWidth = this.clefGlyph.bBoxes.bBoxNE[0] - this.clefGlyph.bBoxes.bBoxSW[0]

    this.width = clefGlyphWidth
  }

  render(x: number, y: number, renderer: Renderer, settings: Settings) {
    renderer.drawGlyph(
      this.getTextFromUnicode(this.clefGlyph.symbol),
      x - this.clefGlyph.bBoxes.bBoxSW[0] * settings.unit,
      y + settings.unit * this.verticalShift,
    )

    if (settings.debug?.bBoxes) {
      renderer.setColor("#ff8a8a80")
      renderer.drawRect(
        x,
        y + this.verticalShift * settings.unit - this.clefGlyph.bBoxes.bBoxNE[1] * settings.unit,
        this.width * settings.unit,
        this.height * settings.unit,
      )

      // renderer.setColor("#ff0000a6")
      // renderer.drawRect(x, y, settings.unit / 32, settings.barlineHeight)
      renderer.setColor("black")
    }
  }
}
