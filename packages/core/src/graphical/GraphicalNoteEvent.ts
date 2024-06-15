import { Settings } from "../BaseRenderer"
import { IRenderer } from "../interfaces"
import { Note, NoteEvent } from "../model/Measure"
import { BaseGraphical } from "./BaseGraphical"
import { DoubleFlat, DoubleSharp, Flat, Natural, Sharp } from "./glyphs/accidental"
import { NoteheadHalf, NoteheadQuarter, NoteheadWhole } from "./glyphs/notehead"
import { Flag8thUp, Flag16thUp, Flag32ndUp, Flag64thUp } from "./glyphs/flag"
import { BBox, Glyph, IGraphical } from "./interfaces"

export class GraphicalNoteEvent extends BaseGraphical implements IGraphical {
  noteEvent: NoteEvent
  height!: number
  width!: number
  noteheadGlyph: Glyph
  verticalShift: number // value in stave spaces
  drawStem!: boolean
  x!: number
  y!: number
  accidentalGlyph?: Glyph
  accidentalWidth?: number
  flagGlyph?: Glyph

  static glyphMap = {
    whole: NoteheadWhole,
    half: NoteheadHalf,
    quarter: NoteheadQuarter,
    eighth: NoteheadQuarter,
    "16th": NoteheadQuarter,
    "32nd": NoteheadQuarter,
    "64th": NoteheadQuarter,
  }

  static flagMap = {
    eighth: Flag8thUp,
    "16th": Flag16thUp,
    "32nd": Flag32ndUp,
    "64th": Flag64thUp,
  }

  static glyphAccidentalMap = {
    [-2]: DoubleFlat,
    [-1]: Flat,
    [0]: Natural,
    [1]: Sharp,
    [2]: DoubleSharp,
  }

  constructor(noteEvent: NoteEvent) {
    super()
    this.noteEvent = noteEvent
    const duration = noteEvent.duration?.base

    if (duration !== "whole") {
      this.drawStem = true
    }

    // for now only first note in chord
    const firstNote = noteEvent.notes![0]
    const showAccidentals = !!firstNote.accidentalDisplay?.show
    const accidental = firstNote.pitch.alter || 0
    const accidentalGlyph =
      GraphicalNoteEvent.glyphAccidentalMap[accidental as keyof typeof GraphicalNoteEvent.glyphAccidentalMap]
    if (typeof accidental === "number" && !accidentalGlyph) {
      throw new Error(`Invalid accidental ${accidental}`)
    }
    if (showAccidentals) {
      this.accidentalGlyph = accidentalGlyph
    }

    this.verticalShift = 0 // TODO: respect pitch

    this.noteheadGlyph = GraphicalNoteEvent.glyphMap[duration as keyof typeof GraphicalNoteEvent.glyphMap]

    this.flagGlyph = GraphicalNoteEvent.flagMap[duration as keyof typeof GraphicalNoteEvent.flagMap]

    // TODO: this validation has to be done at score model level
    if (!this.noteheadGlyph) {
      throw new Error(`Invalid duration ${duration}`)
    }

    const glyphHeight = this.noteheadGlyph.bBoxes.bBoxNE[1] - this.noteheadGlyph.bBoxes.bBoxSW[1]

    this.height = glyphHeight

    const glyphWidth = this.noteheadGlyph.bBoxes.bBoxNE[0] - this.noteheadGlyph.bBoxes.bBoxSW[0]

    this.width = glyphWidth

    if (this.accidentalGlyph) {
      const accidentalGlyphWidth = this.accidentalGlyph.bBoxes.bBoxNE[0] - this.accidentalGlyph.bBoxes.bBoxSW[0]
      this.accidentalWidth = accidentalGlyphWidth
    }
  }

  setCoordinates(x: number, y: number, settings: Settings): void {
    this.x = x
    this.y = y + this.verticalShift * settings.unit
  }

  getBBox(settings: Settings): BBox {
    let xShift = 0
    if (this.accidentalGlyph) {
      xShift = xShift + this.accidentalWidth! * settings.unit + 0.5 * settings.unit
    }
    return {
      x: this.x + xShift,
      y: this.y - this.noteheadGlyph.bBoxes.bBoxNE[1] * settings.unit,
      width: this.width * settings.unit,
      height: this.height * settings.unit,
    }
  }

  render(renderer: IRenderer, settings: Settings) {
    let xShift = 0
    if (this.accidentalGlyph) {
      renderer.drawGlyph(
        this.getTextFromUnicode(this.accidentalGlyph.symbol),
        this.x - this.accidentalGlyph.bBoxes.bBoxSW[0] * settings.unit,
        this.y,
      )
      xShift = xShift + this.accidentalWidth! * settings.unit + 0.5 * settings.unit
    }
    renderer.drawGlyph(
      this.getTextFromUnicode(this.noteheadGlyph.symbol),
      this.x - this.noteheadGlyph.bBoxes.bBoxSW[0] * settings.unit + xShift,
      this.y,
    )

    if (this.drawStem) {
      const stemThickness = 0.12 * settings.unit
      const stemHeight = 3.5 * settings.unit
      const stemHeightCut = 0.17 * settings.unit

      renderer.drawRect(
        this.x + this.width * settings.unit - stemThickness + xShift,
        this.y - stemHeight,
        stemThickness,
        stemHeight - stemHeightCut,
      )

      if (this.flagGlyph) {
        renderer.drawGlyph(
          this.getTextFromUnicode(this.flagGlyph.symbol),
          this.x +
            this.width * settings.unit -
            stemThickness -
            this.noteheadGlyph.bBoxes.bBoxSW[0] * settings.unit +
            xShift,
          this.y - 3.5 * settings.unit,
        )
      }
    }
  }
}
