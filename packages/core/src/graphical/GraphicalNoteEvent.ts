import { Settings } from "../BaseRenderer"
import { Renderer } from "../interfaces"
import { NoteEvent } from "../model/Measure"
import { BaseGraphical } from "./BaseGraphical"
import { NoteheadHalf, NoteheadQuarter, NoteheadWhole } from "./glyphs/notehead"
import { Glyph, IGraphical } from "./interfaces"

export class GraphicalNoteEvent extends BaseGraphical implements IGraphical {
  height!: number
  width!: number
  noteheadGlyph: Glyph
  verticalShift: number // value in stave spaces

  static glyphMap = {
    whole: NoteheadWhole,
    half: NoteheadHalf,
    quarter: NoteheadQuarter,
  }

  constructor(noteEvent: NoteEvent) {
    super()
    const duration = noteEvent.duration?.base

    this.verticalShift = 0 // TODO: respect pitch

    this.noteheadGlyph = GraphicalNoteEvent.glyphMap[duration as keyof typeof GraphicalNoteEvent.glyphMap]

    // TODO: this validation has to be done at score model level
    if (!this.noteheadGlyph) {
      throw new Error(`Invalid duration ${duration}`)
    }

    const glyphHeight = this.noteheadGlyph.bBoxes.bBoxNE[1] - this.noteheadGlyph.bBoxes.bBoxSW[1]

    this.height = glyphHeight

    const glyphWidth = this.noteheadGlyph.bBoxes.bBoxNE[0] - this.noteheadGlyph.bBoxes.bBoxSW[0]

    this.width = glyphWidth
  }

  render(x: number, y: number, renderer: Renderer, settings: Settings) {
    renderer.drawGlyph(
      this.getTextFromUnicode(this.noteheadGlyph.symbol),
      x - this.noteheadGlyph.bBoxes.bBoxSW[0] * settings.unit,
      y + this.verticalShift * settings.unit,
    )

    if (settings.debug?.bBoxes) {
      renderer.setColor("#ff8a8a80")
      renderer.drawRect(
        x,
        y + this.verticalShift * settings.unit - this.noteheadGlyph.bBoxes.bBoxNE[1] * settings.unit,
        this.width * settings.unit,
        this.height * settings.unit,
      )

      // renderer.setColor("#ff0000a6")
      // renderer.drawRect(x, y, settings.unit / 32, settings.barlineHeight)
      renderer.setColor("black")
    }
  }
}
