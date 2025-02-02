import { Settings } from "../Settings"
import { IRenderer } from "../interfaces"
import { Beat } from "../model/Beat"
import { BaseGraphical } from "./BaseGraphical"
import { RestHalf, RestWhole, RestQuarter, RestEighth, Rest16th, Rest32nd, Rest64th } from "./glyphs/rest"
import { BBox, Glyph, IGraphical } from "./interfaces"

type GlyphMap = Record<string, Glyph>

export class GraphicalRestEvent extends BaseGraphical implements IGraphical {
  height!: number
  width!: number
  restGlyph!: Glyph
  verticalShift!: number // value in stave spaces
  x!: number
  y!: number
  noteEvent: Beat

  static glyphMap: GlyphMap = {
    whole: RestWhole,
    half: RestHalf,
    quarter: RestQuarter,
    eighth: RestEighth,
    "16th": Rest16th,
    "32nd": Rest32nd,
    "64th": Rest64th,
  }

  constructor(noteEvent: Beat) {
    super()
    this.noteEvent = noteEvent
    this.calculateMetrics(noteEvent)
  }

  calculateMetrics(noteEvent: Beat) {
    const duration = noteEvent.duration?.base

    this.verticalShift = duration === "whole" ? -1 : 0 // TODO: respect rest position

    this.restGlyph = GraphicalRestEvent.glyphMap[duration as keyof GlyphMap]

    // TODO: this validation has to be done at score model level
    if (!this.restGlyph) {
      throw new Error(`Invalid duration ${duration}`)
    }

    const glyphHeight = this.restGlyph.bBoxes.bBoxNE[1] - this.restGlyph.bBoxes.bBoxSW[1]

    this.height = glyphHeight

    const glyphWidth = this.restGlyph.bBoxes.bBoxNE[0] - this.restGlyph.bBoxes.bBoxSW[0]

    this.width = glyphWidth
  }

  setPosition(x: number, y: number, settings: Settings): void {
    this.x = x
    this.y = y + this.verticalShift * settings.unit
  }

  getBBox(settings: Settings): BBox {
    return {
      x: this.x,
      y: this.y - this.restGlyph.bBoxes.bBoxNE[1] * settings.unit,
      width: this.width * settings.unit,
      height: this.height * settings.unit,
    }
  }

  render(renderer: IRenderer, settings: Settings) {
    renderer.drawGlyph(
      this.getTextFromUnicode(this.restGlyph.symbol),
      this.x - this.restGlyph.bBoxes.bBoxSW[0] * settings.unit,
      this.y,
    )
  }

  getBeatOffsetLeft(): number {
    return 0
  }

  getBeatOffsetRight(): number {
    return this.width
  }

  getTopStaveOverflow(settings: Settings) {
    return Math.max(
      this.restGlyph.bBoxes.bBoxNE[1] * settings.unit - this.verticalShift * settings.unit - settings.midStave,
      0,
    )
  }

  getBottomStaveOverflow(settings: Settings) {
    return Math.max(
      -this.restGlyph.bBoxes.bBoxSW[1] * settings.unit + this.verticalShift * settings.unit - settings.midStave,
      0,
    )
  }
}
