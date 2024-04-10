import { Settings } from "../BaseRenderer"
import { IRenderer } from "../interfaces"
import { NoteEvent } from "../model/Measure"
import { BaseGraphical } from "./BaseGraphical"
import { NoteheadHalf, NoteheadQuarter, NoteheadWhole } from "./glyphs/notehead"
import { BBox, Glyph, IGraphical } from "./interfaces"

export class GraphicalNoteEvent extends BaseGraphical implements IGraphical {
  height!: number
  width!: number
  noteheadGlyph: Glyph
  verticalShift: number // value in stave spaces
  drawStem!: boolean
  x!: number
  y!: number

  static glyphMap = {
    whole: NoteheadWhole,
    half: NoteheadHalf,
    quarter: NoteheadQuarter,
  }

  constructor(noteEvent: NoteEvent) {
    super()
    const duration = noteEvent.duration?.base

    if (duration !== "whole") {
      this.drawStem = true
    }

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

  setCoordinates(x: number, y: number, settings: Settings): void {
    this.x = x
    this.y = y + this.verticalShift * settings.unit
  }

  getBBox(settings: Settings): BBox {
    return {
      x: this.x,
      y: this.y - this.noteheadGlyph.bBoxes.bBoxNE[1] * settings.unit,
      width: this.width * settings.unit,
      height: this.height * settings.unit,
    }
  }

  render(renderer: IRenderer, settings: Settings) {
    renderer.drawGlyph(
      this.getTextFromUnicode(this.noteheadGlyph.symbol),
      this.x - this.noteheadGlyph.bBoxes.bBoxSW[0] * settings.unit,
      this.y,
    )

    if (this.drawStem) {
      const stemThickness = 0.12 * settings.unit
      const stemHeight = 3.5 * settings.unit
      const stemHeightCut = 0.17 * settings.unit
      renderer.drawRect(
        this.x + this.width * settings.unit - stemThickness,
        this.y - stemHeight,
        stemThickness,
        stemHeight - stemHeightCut,
      )
    }
  }
}
