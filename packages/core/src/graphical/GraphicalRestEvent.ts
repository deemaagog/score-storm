import { Settings } from "../BaseRenderer"
import { IRenderer } from "../interfaces"
import { NoteEvent } from "../model/Measure"
import { BaseGraphical } from "./BaseGraphical"
import { RestHalf, RestWhole, RestQuarter } from "./glyphs/rest"
import { BBox, Glyph, IGraphical } from "./interfaces"

export class GraphicalRestEvent extends BaseGraphical implements IGraphical {
  height!: number
  width!: number
  restGlyph: Glyph
  verticalShift: number // value in stave spaces
  x!: number
  y!: number
  noteEvent: NoteEvent

  static glyphMap = {
    whole: RestWhole,
    half: RestHalf,
    quarter: RestQuarter,
  }

  constructor(noteEvent: NoteEvent) {
    super()
    this.noteEvent = noteEvent
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

  setCoordinates(x: number, y: number, settings: Settings): void {
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
}
