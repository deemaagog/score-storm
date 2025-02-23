import { note } from "@tonaljs/pitch-note"
import { Settings } from "../Settings"
import { IRenderer } from "../interfaces"
import { Note, Beat } from "../model/Beat"
import { BaseGraphical } from "./BaseGraphical"
import { DoubleFlat, DoubleSharp, Flat, Natural, Sharp } from "./glyphs/accidental"
import { NoteheadHalf, NoteheadQuarter, NoteheadWhole } from "./glyphs/notehead"
import { Flag8thUp, Flag16thUp, Flag32ndUp, Flag64thUp } from "./glyphs/flag"
import { BBox, Glyph, IGraphical } from "./interfaces"

const STEM_THICKNESS = 0.12
const STEM_HEIGHT = 3.5
const STEM_HEIGHT_CUT = 0.17

const LEDGER_LINE_LENGTH = 1.8

type GlyphMap = Record<string, Glyph>
type FlagMap = Record<string, Glyph>
type GlyphAccidentalMap = Record<number, Glyph>

export class GraphicalNoteEvent extends BaseGraphical implements IGraphical {
  noteEvent: Beat
  height!: number
  width!: number
  noteheadGlyph!: Glyph
  verticalShift!: number // value in stave spaces
  drawStem!: boolean
  x!: number
  y!: number
  accidentalGlyph?: Glyph
  accidentalWidth?: number
  flagGlyph?: Glyph

  static glyphMap: GlyphMap = {
    whole: NoteheadWhole,
    half: NoteheadHalf,
    quarter: NoteheadQuarter,
    eighth: NoteheadQuarter,
    "16th": NoteheadQuarter,
    "32nd": NoteheadQuarter,
    "64th": NoteheadQuarter,
  }

  static flagMap: FlagMap = {
    eighth: Flag8thUp,
    "16th": Flag16thUp,
    "32nd": Flag32ndUp,
    "64th": Flag64thUp,
  }

  static glyphAccidentalMap: GlyphAccidentalMap = {
    [-2]: DoubleFlat,
    [-1]: Flat,
    [0]: Natural,
    [1]: Sharp,
    [2]: DoubleSharp,
  }

  constructor(noteEvent: Beat) {
    super()
    this.noteEvent = noteEvent
    this.calculateMetrics(noteEvent)
  }

  calculateMetrics(noteEvent: Beat) {
    const duration = noteEvent.duration?.base

    if (duration !== "whole") {
      this.drawStem = true
    }

    // for now only first note in chord
    const firstNote = noteEvent.notes![0]
    const showAccidentals = !!firstNote.accidentalDisplay?.show
    const accidental = firstNote.pitch.alter || 0
    const accidentalGlyph = GraphicalNoteEvent.glyphAccidentalMap[accidental as keyof GlyphAccidentalMap]
    if (typeof accidental === "number" && !accidentalGlyph) {
      throw new Error(`Invalid accidental ${accidental}`)
    }
    if (showAccidentals) {
      this.accidentalGlyph = accidentalGlyph
    }

    this.verticalShift = this.calculateVerticalShift()

    this.noteheadGlyph = GraphicalNoteEvent.glyphMap[duration as keyof GlyphMap]

    this.flagGlyph = GraphicalNoteEvent.flagMap[duration as keyof FlagMap]

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

  setPosition(x: number, y: number, settings: Settings): void {
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
    const currentColor = renderer.getColor()

    // draw accidental
    if (this.accidentalGlyph) {
      renderer.setColor(settings.mainColor)
      renderer.drawGlyph(
        this.getTextFromUnicode(this.accidentalGlyph.symbol),
        this.x - this.accidentalGlyph.bBoxes.bBoxSW[0] * settings.unit,
        this.y,
      )
      xShift = xShift + this.accidentalWidth! * settings.unit + 0.5 * settings.unit
    }

    // draw ledger lines
    if (Math.abs(this.verticalShift) >= 3) {
      renderer.setColor(settings.staveLineColor)

      const ledgerLineX =
        this.x -
        this.noteheadGlyph.bBoxes.bBoxSW[0] * settings.unit +
        xShift -
        ((LEDGER_LINE_LENGTH - this.width) * settings.unit) / 2

      const ledgerLineLength = LEDGER_LINE_LENGTH * settings.unit
      const ledgerLineThickness = settings.staffLineThickness
      const ledgerLineCount = Math.floor(Math.abs(this.verticalShift)) - 2

      // render ledger lines above or below the stave
      const ledgerLineDirection = this.verticalShift > 0 ? -1 : 1
      const staveCenterY = this.y - this.verticalShift * settings.unit
      for (let i = 0; i < ledgerLineCount; i++) {
        const ledgerLineY =
          staveCenterY - ledgerLineDirection * (i + 3) * settings.unit - settings.staffLineThickness / 2
        renderer.drawRect(ledgerLineX, ledgerLineY, ledgerLineLength, ledgerLineThickness)
      }
    }

    // draw stem and flag
    if (this.drawStem) {
      renderer.setColor(settings.mainColor)
      const stemThickness = STEM_THICKNESS * settings.unit
      const stemHeight = STEM_HEIGHT * settings.unit
      const stemHeightCut = STEM_HEIGHT_CUT * settings.unit

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

    renderer.setColor(currentColor)
    renderer.drawGlyph(
      this.getTextFromUnicode(this.noteheadGlyph.symbol),
      this.x - this.noteheadGlyph.bBoxes.bBoxSW[0] * settings.unit + xShift,
      this.y,
    )
  }

  calculateVerticalShift(): number {
    const pitch = this.noteEvent.notes![0].pitch

    // TODO: account for clef changes
    const clef = this.noteEvent.measure.getCurrentClef()

    const middlePitch = clef.getMiddleLinePitch()

    const pitchNote = note(`${pitch.step}${pitch.octave}`)
    const middlePitchNote = note(`${middlePitch.step}${middlePitch.octave}`)

    const distance = pitchNote.step - middlePitchNote.step + (pitchNote.oct! - middlePitchNote.oct!) * 7

    return -distance / 2
  }

  getBeatOffsetLeft(): number {
    let offsetLeft = 0
    if (this.accidentalGlyph) {
      offsetLeft += this.accidentalWidth! + 0.5
    }
    return offsetLeft
  }

  getBeatOffsetRight(): number {
    let offsetRight = this.width

    if (this.flagGlyph) {
      const stemThickness = STEM_THICKNESS
      offsetRight = offsetRight - stemThickness

      const flagWidth = this.flagGlyph.bBoxes.bBoxNE[0] - this.flagGlyph.bBoxes.bBoxSW[0]
      offsetRight += flagWidth
    }
    return offsetRight
  }

  getTopStaveOverflow(settings: Settings) {
    if (this.drawStem) {
      return STEM_HEIGHT * settings.unit - this.verticalShift * settings.unit - settings.midStave
    }
    return Math.max(
      this.noteheadGlyph.bBoxes.bBoxNE[1] * settings.unit - this.verticalShift * settings.unit - settings.midStave,
      0,
    )
  }

  getBottomStaveOverflow(settings: Settings) {
    if (this.accidentalGlyph) {
      return Math.max(
        -this.accidentalGlyph.bBoxes.bBoxSW[1] * settings.unit + this.verticalShift * settings.unit - settings.midStave,
        0,
      )
    }
    return Math.max(
      -this.noteheadGlyph.bBoxes.bBoxSW[1] * settings.unit + this.verticalShift * settings.unit - settings.midStave,
      0,
    )
  }
}
