import { Settings } from "../Settings"
import { IRenderer } from "../interfaces"
import { Measure } from "../model/Measure"
import { TimeSignature } from "../model/TimeSignature"
import { getTextFromUnicode } from "../utils"
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

type GlyphMap = Record<number, Glyph>

export class GraphicalTimeSignature implements IGraphical {
  readonly id: string
  height!: number
  width!: number
  countGlyph!: Glyph
  unitGlyph!: Glyph
  x!: number
  y!: number
  count: number
  unit: number
  readonly measure: Measure

  static glyphMap: GlyphMap = {
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

  constructor(time: TimeSignature, measure: Measure) {
    this.id = `gts-${measure.uid}`
    this.count = time.count
    this.unit = time.unit
    this.measure = measure
    this.calculateMetrics()
  }

  private calculateMetrics() {
    const { count, unit } = this

    this.countGlyph = GraphicalTimeSignature.glyphMap[count as keyof GlyphMap]
    this.unitGlyph = GraphicalTimeSignature.glyphMap[unit as keyof GlyphMap]

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

  setPosition(x: number, y: number): void {
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
      getTextFromUnicode(this.countGlyph.symbol),
      this.x -
        this.countGlyph.bBoxes.bBoxSW[0] * settings.unit +
        ((this.width - (this.countGlyph.bBoxes.bBoxNE[0] - this.countGlyph.bBoxes.bBoxSW[0])) / 2) * settings.unit,
      this.y + settings.unit * -1,
    )

    renderer.drawGlyph(
      getTextFromUnicode(this.unitGlyph.symbol),
      this.x -
        this.unitGlyph.bBoxes.bBoxSW[0] * settings.unit +
        ((this.width - (this.unitGlyph.bBoxes.bBoxNE[0] - this.unitGlyph.bBoxes.bBoxSW[0])) / 2) * settings.unit,
      this.y + settings.unit * 1,
    )
  }
}
