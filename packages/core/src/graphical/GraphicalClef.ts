import { Settings } from "../BaseRenderer"
import { IRenderer } from "../interfaces"
import { Clef } from "../model/Measure"
import { BaseGraphical } from "./BaseGraphical"
import { ClefG, ClefF } from "./glyphs/clef"
import { Glyph, IGraphical } from "./interfaces"

export class GraphicalClef extends BaseGraphical implements IGraphical {
  height!: number
  width!: number
  clefGlyph: Glyph
  verticalShift: number // value in stave spaces
  x!: number // todo : create Poind2d type
  y!: number
  clef: Clef

  static glyphMap = {
    G: ClefG,
    F: ClefF,
  }

  constructor(clef: Clef) {
    super()
    this.clef = clef
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

  setCoordinates(x: number, y: number, settings: Settings): void {
    this.x = x
    this.y = y + this.verticalShift * settings.unit
  }

  getBBox(settings: Settings) {
    return {
      x: this.x,
      y: this.y - this.clefGlyph.bBoxes.bBoxNE[1] * settings.unit,
      width: this.width * settings.unit,
      height: this.height * settings.unit,
    }
  }

  render(renderer: IRenderer, settings: Settings) {
    renderer.drawGlyph(
      this.getTextFromUnicode(this.clefGlyph.symbol),
      this.x - this.clefGlyph.bBoxes.bBoxSW[0] * settings.unit,
      this.y,
    )
  }

  getMaxY(settings: Settings) {
    return Math.max(
      this.clefGlyph.bBoxes.bBoxNE[1] * settings.unit - this.verticalShift * settings.unit - settings.midStave,
      0,
    )
  }

  getMinY(settings: Settings) {
    return Math.max(
      -this.clefGlyph.bBoxes.bBoxSW[1] * settings.unit + this.verticalShift * settings.unit - settings.midStave,
      0,
    )
  }
}
