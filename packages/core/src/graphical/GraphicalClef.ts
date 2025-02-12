import { Settings } from "../Settings"
import { IRenderer } from "../interfaces"
import { Clef } from "../model/Clef"
import { BaseGraphical } from "./BaseGraphical"
import { ClefG, ClefF } from "./glyphs/clef"
import { BBox, Glyph, IGraphical } from "./interfaces"

type GlyphMap = Record<"G" | "F", Glyph>

export class GraphicalClef extends BaseGraphical implements IGraphical {
  height!: number
  width!: number
  clefGlyph!: Glyph
  verticalShift!: number // value in stave spaces
  x!: number // todo : create Point2d type
  y!: number
  clef: Clef

  static glyphMap: GlyphMap = {
    G: ClefG,
    F: ClefF,
  }

  constructor(clef: Clef) {
    super()
    this.clef = clef
    this.calculateMetrics()
  }

  calculateMetrics() {
    const { position, sign } = this.clef

    this.verticalShift = position * -0.5

    this.clefGlyph = GraphicalClef.glyphMap[sign as keyof GlyphMap]

    // TODO: this validation has to be done at score model level
    if (!this.clefGlyph) {
      throw new Error(`Invalid time signature ${sign}`)
    }

    const clefGlyphHeight = this.clefGlyph.bBoxes.bBoxNE[1] - this.clefGlyph.bBoxes.bBoxSW[1]

    this.height = clefGlyphHeight

    const clefGlyphWidth = this.clefGlyph.bBoxes.bBoxNE[0] - this.clefGlyph.bBoxes.bBoxSW[0]

    this.width = clefGlyphWidth
  }

  setPosition(x: number, y: number, settings: Settings): void {
    this.x = x
    this.y = y + this.verticalShift * settings.unit
  }

  getBBox(settings: Settings): BBox {
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

  getTopStaveOverflow(settings: Settings) {
    return Math.max(
      this.clefGlyph.bBoxes.bBoxNE[1] * settings.unit - this.verticalShift * settings.unit - settings.midStave,
      0,
    )
  }

  getBottomStaveOverflow(settings: Settings) {
    return Math.max(
      -this.clefGlyph.bBoxes.bBoxSW[1] * settings.unit + this.verticalShift * settings.unit - settings.midStave,
      0,
    )
  }
}
