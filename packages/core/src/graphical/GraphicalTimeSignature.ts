import { Settings } from "../BaseRenderer"
import { IRenderer } from "../interfaces"
import { TimeSignature } from "../model/GlobalMeasure"
import { BaseGraphical } from "./BaseGraphical"
import {
  TimeSig1,
  TimeSig2,
  TimeSig3,
  TimeSig4,
  TimeSig5,
  TimeSig6,
  TimeSig7,
  TimeSig8,
  TimeSig9,
} from "./glyphs/time-signature"
import { BBox, Glyph, IGraphical } from "./interfaces"

export class GraphicalTimeSignature extends BaseGraphical implements IGraphical {
  height!: number
  width!: number
  countGlyph: Glyph
  unitGlyph: Glyph
  x!: number
  y!: number
  time!: TimeSignature

  static glyphMap = {
    1: TimeSig1,
    2: TimeSig2,
    3: TimeSig3,
    4: TimeSig4,
    5: TimeSig5,
    6: TimeSig6,
    7: TimeSig7,
    8: TimeSig8,
    9: TimeSig9,
  }

  constructor(time: TimeSignature) {
    super()
    this.time = time
    const { count, unit } = time!

    this.countGlyph = GraphicalTimeSignature.glyphMap[count as keyof typeof GraphicalTimeSignature.glyphMap]

    this.unitGlyph = GraphicalTimeSignature.glyphMap[unit as keyof typeof GraphicalTimeSignature.glyphMap]

    if (!this.countGlyph || !this.unitGlyph) {
      throw new Error(`Invalid time signature ${count}/${unit}`)
    }

    // TODO: two digit time signatures, like 12/8

    const countGlyphHeight = this.countGlyph.bBoxes.bBoxNE[1] - this.countGlyph.bBoxes.bBoxSW[1]
    const unitGlyphHeight = this.unitGlyph.bBoxes.bBoxNE[1] - this.unitGlyph.bBoxes.bBoxSW[1]

    this.height = countGlyphHeight + unitGlyphHeight

    const countGlyphWidth = this.countGlyph.bBoxes.bBoxNE[0] - this.countGlyph.bBoxes.bBoxSW[0]
    const unitGlyphWidth = this.unitGlyph.bBoxes.bBoxNE[0] - this.unitGlyph.bBoxes.bBoxSW[0]

    this.width = Math.max(countGlyphWidth, unitGlyphWidth)
  }

  setCoordinates(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  getBBox(settings: Settings): BBox {
    return {
      x: this.x,
      y: this.y - (this.countGlyph.bBoxes.bBoxNE[1] - this.countGlyph.bBoxes.bBoxSW[1]) * settings.unit,
      width: this.width * settings.unit,
      height: this.height * settings.unit,
    }
  }

  render(renderer: IRenderer, settings: Settings) {
    renderer.drawGlyph(
      this.getTextFromUnicode(this.countGlyph.symbol),
      this.x -
        this.countGlyph.bBoxes.bBoxSW[0] * settings.unit +
        ((this.width - (this.countGlyph.bBoxes.bBoxNE[0] - this.countGlyph.bBoxes.bBoxSW[0])) / 2) * settings.unit,
      this.y + settings.unit * -1,
    )

    renderer.drawGlyph(
      this.getTextFromUnicode(this.unitGlyph.symbol),
      this.x -
        this.unitGlyph.bBoxes.bBoxSW[0] * settings.unit +
        ((this.width - (this.unitGlyph.bBoxes.bBoxNE[0] - this.unitGlyph.bBoxes.bBoxSW[0])) / 2) * settings.unit,
      this.y + settings.unit * 1,
    )
  }
}
