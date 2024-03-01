import { GlobalMeasure } from "../model/GlobalMeasure"
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
import { GraphicalObject, PositionedGlyph } from "./interfaces"

export class GraphicalTimeSignature implements GraphicalObject {
  height!: number
  width!: number
  object!: PositionedGlyph[]

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

  constructor(time: GlobalMeasure["time"]) {
    const { count, unit } = time!

    const countGlyph = GraphicalTimeSignature.glyphMap[count as keyof typeof GraphicalTimeSignature.glyphMap]

    const unitGlyph = GraphicalTimeSignature.glyphMap[unit as keyof typeof GraphicalTimeSignature.glyphMap]

    if (!countGlyph || !unitGlyph) {
      throw new Error("Invalid time signature")
    }

    const countGlyphHeight = countGlyph.bBoxes.bBoxNE[1] - countGlyph.bBoxes.bBoxSW[1]
    const unitGlyphHeight = unitGlyph.bBoxes.bBoxNE[1] - unitGlyph.bBoxes.bBoxSW[1]

    this.height = countGlyphHeight + unitGlyphHeight

    const countGlyphWidth = countGlyph.bBoxes.bBoxNE[0] + countGlyph.bBoxes.bBoxSW[0]
    const unitGlyphWidth = unitGlyph.bBoxes.bBoxNE[0] - unitGlyph.bBoxes.bBoxSW[0]

    this.width = Math.max(countGlyphWidth, unitGlyphWidth)

    this.object = [
      { glyph: countGlyph, shift: -1 },
      { glyph: unitGlyph, shift: 1 },
    ]
  }
}
