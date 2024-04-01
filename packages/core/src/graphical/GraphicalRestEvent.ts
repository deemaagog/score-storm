import { Settings } from "../BaseRenderer"
import { Renderer } from "../interfaces"
import { NoteEvent } from "../model/Measure"
import { BaseGraphical } from "./BaseGraphical"
import { RestHalf, RestWhole, RestQuarter } from "./glyphs/rest"
import { Glyph, IGraphical } from "./interfaces"

export class GraphicalRestEvent extends BaseGraphical implements IGraphical {
  height!: number
  width!: number
  restGlyph: Glyph
  verticalShift: number // value in stave spaces

  static glyphMap = {
    whole: RestWhole,
    half: RestHalf,
    quarter: RestQuarter,
  }

  constructor(noteEvent: NoteEvent) {
    super()
    const duration = noteEvent.duration?.base

    this.verticalShift = duration === "whole" ? -1 : 0 // TODO: respect rest position

    this.restGlyph = GraphicalRestEvent.glyphMap[duration as keyof typeof GraphicalRestEvent.glyphMap]

    // TODO: this validation has to be done at score model level
    if (!this.restGlyph) {
      throw new Error(`Invalid duration ${duration}`)
    }

    const glyphHeight = this.restGlyph.bBoxes.bBoxNE[1] - this.restGlyph.bBoxes.bBoxSW[1]

    this.height = glyphHeight

    const glyphWidth = this.restGlyph.bBoxes.bBoxNE[0] - this.restGlyph.bBoxes.bBoxSW[0]

    this.width = glyphWidth
  }

  render(x: number, y: number, renderer: Renderer, settings: Settings) {
    renderer.drawGlyph(
      this.getTextFromUnicode(this.restGlyph.symbol),
      x - this.restGlyph.bBoxes.bBoxSW[0] * settings.unit,
      y + this.verticalShift * settings.unit,
    )

    if (settings.debug?.bBoxes) {
      renderer.setColor("#ff8a8a80")
      renderer.drawRect(
        x,
        y + this.verticalShift * settings.unit - this.restGlyph.bBoxes.bBoxNE[1] * settings.unit,
        this.width * settings.unit,
        this.height * settings.unit,
      )

      renderer.setColor("black")
    }
  }
}
