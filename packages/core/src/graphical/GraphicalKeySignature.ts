import { note } from "@tonaljs/pitch-note"
import { Settings } from "../Settings"
import { IRenderer } from "../interfaces"
import { Clef } from "../model/Clef"
import { KeySignature } from "../model/KeySignature"
import { Measure } from "../model/Measure"
import { getTextFromUnicode } from "../utils"
import { Flat, Sharp } from "./glyphs/accidental"
import { BBox, Glyph, IGraphical } from "./interfaces"

const ACCIDENTAL_GAP = 0.15

type Pitch = { step: string; octave: number }

// Conventional octaves for key-signature accidentals on G and F staves
const SHARP_PITCHES: Record<"G" | "F", Pitch[]> = {
  G: [
    { step: "F", octave: 5 },
    { step: "C", octave: 5 },
    { step: "G", octave: 5 },
    { step: "D", octave: 5 },
    { step: "A", octave: 4 },
    { step: "E", octave: 5 },
    { step: "B", octave: 4 },
  ],
  F: [
    { step: "F", octave: 3 },
    { step: "C", octave: 3 },
    { step: "G", octave: 3 },
    { step: "D", octave: 3 },
    { step: "A", octave: 2 },
    { step: "E", octave: 3 },
    { step: "B", octave: 2 },
  ],
}

const FLAT_PITCHES: Record<"G" | "F", Pitch[]> = {
  G: [
    { step: "B", octave: 4 },
    { step: "E", octave: 5 },
    { step: "A", octave: 4 },
    { step: "D", octave: 5 },
    { step: "G", octave: 4 },
    { step: "C", octave: 5 },
    { step: "F", octave: 4 },
  ],
  F: [
    { step: "B", octave: 2 },
    { step: "E", octave: 3 },
    { step: "A", octave: 2 },
    { step: "D", octave: 3 },
    { step: "G", octave: 2 },
    { step: "C", octave: 3 },
    { step: "F", octave: 2 },
  ],
}

type KeyAccidental = {
  glyph: Glyph
  verticalShift: number
  xOffset: number
  width: number
}

export class GraphicalKeySignature implements IGraphical {
  readonly id: string
  height!: number
  width!: number
  x!: number
  y!: number
  fifths: number
  readonly measure: Measure
  accidentals: KeyAccidental[] = []

  constructor(key: KeySignature, measure: Measure, clef: Clef) {
    this.id = `gks-${measure.uid}`
    this.fifths = key.fifths
    this.measure = measure
    this.calculateMetrics(clef)
  }

  private calculateMetrics(clef: Clef) {
    const count = Math.abs(this.fifths)
    if (count === 0) {
      this.width = 0
      this.height = 0
      return
    }

    const sign = clef.sign as "G" | "F"
    const pitches = this.fifths > 0 ? SHARP_PITCHES[sign] : FLAT_PITCHES[sign]
    const glyph = this.fifths > 0 ? Sharp : Flat

    if (!pitches || !glyph) {
      throw new Error(`Unsupported clef for key signature: ${clef.sign}`)
    }

    const glyphWidth = glyph.bBoxes.bBoxNE[0] - glyph.bBoxes.bBoxSW[0]
    const glyphHeight = glyph.bBoxes.bBoxNE[1] - glyph.bBoxes.bBoxSW[1]
    let xOffset = 0

    for (let i = 0; i < count; i++) {
      this.accidentals.push({
        glyph,
        verticalShift: this.pitchToVerticalShift(pitches[i], clef),
        xOffset,
        width: glyphWidth,
      })
      xOffset += glyphWidth + ACCIDENTAL_GAP
    }

    this.width = xOffset - ACCIDENTAL_GAP
    this.height = glyphHeight
  }

  private pitchToVerticalShift(pitch: Pitch, clef: Clef): number {
    const middlePitch = clef.getMiddleLinePitch()
    const pitchNote = note(`${pitch.step}${pitch.octave}`)
    const middlePitchNote = note(`${middlePitch.step}${middlePitch.octave}`)
    const distance = pitchNote.step - middlePitchNote.step + (pitchNote.oct! - middlePitchNote.oct!) * 7
    return distance === 0 ? 0 : -distance / 2
  }

  setPosition(x: number, y: number, _settings: Settings): void {
    this.x = x
    this.y = y
  }

  getBBox(settings: Settings): BBox {
    if (this.accidentals.length === 0) {
      return { x: this.x, y: this.y, width: 0, height: 0 }
    }

    let minY = Infinity
    let maxY = -Infinity
    for (const accidental of this.accidentals) {
      const glyphY = this.y + accidental.verticalShift * settings.unit
      minY = Math.min(minY, glyphY - accidental.glyph.bBoxes.bBoxNE[1] * settings.unit)
      maxY = Math.max(maxY, glyphY - accidental.glyph.bBoxes.bBoxSW[1] * settings.unit)
    }

    return {
      x: this.x,
      y: minY,
      width: this.width * settings.unit,
      height: maxY - minY,
    }
  }

  render(renderer: IRenderer, settings: Settings) {
    for (const accidental of this.accidentals) {
      renderer.drawGlyph(
        getTextFromUnicode(accidental.glyph.symbol),
        this.x + accidental.xOffset * settings.unit - accidental.glyph.bBoxes.bBoxSW[0] * settings.unit,
        this.y + accidental.verticalShift * settings.unit,
      )
    }
  }

  getTopStaveOverflow(settings: Settings) {
    return this.accidentals.reduce((max, accidental) => {
      return Math.max(
        max,
        accidental.glyph.bBoxes.bBoxNE[1] * settings.unit -
          accidental.verticalShift * settings.unit -
          settings.midStave,
        0,
      )
    }, 0)
  }

  getBottomStaveOverflow(settings: Settings) {
    return this.accidentals.reduce((max, accidental) => {
      return Math.max(
        max,
        -accidental.glyph.bBoxes.bBoxSW[1] * settings.unit +
          accidental.verticalShift * settings.unit -
          settings.midStave,
        0,
      )
    }, 0)
  }
}
