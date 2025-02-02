import { GraphicalNoteEvent, GraphicalRestEvent } from "../graphical"
import { Measure } from "./Measure"

export type Pitch = {
  alter?: number
  octave: number
  step: string
}

type AccidentalDisplay = {
  show: boolean
}

export type Note = {
  pitch: Pitch
  accidentalDisplay?: AccidentalDisplay
}

export type NoteDuration = {
  base: string // duplexMaxima maxima longa breve whole half quarter eighth 16th 32nd 64th 128th 256th 512th 1024th 2048th 4096th
  dots?: number
}

type Rest = {
  position?: number
}

export class Beat {
  duration: NoteDuration
  durationValue: number
  notes?: Note[]
  rest?: Rest
  measure!: Measure

  graphical: GraphicalNoteEvent | GraphicalRestEvent

  constructor(params: { duration?: NoteDuration; notes?: Note[]; rest?: Rest }, measure: Measure) {
    const { duration, notes, rest } = params

    if (!duration) {
      throw new Error(`Duration is not defined`)
    }
    if (notes && notes.length > 1) {
      throw new Error(`Chords are not supported`)
    }

    this.measure = measure

    this.duration = duration
    this.notes = notes
    this.rest = rest

    this.durationValue = this.getDurationValue(duration.base)

    if (notes) {
      this.graphical = new GraphicalNoteEvent(this)
    } else {
      this.graphical = new GraphicalRestEvent(this)
    }
  }

  getDurationValue(base: string): number {
    switch (base) {
      case "whole":
        return 1
      case "half":
        return 1 / 2
      case "quarter":
        return 1 / 4
      case "eighth":
        return 1 / 8
      case "16th":
        return 1 / 16
      case "32nd":
        return 1 / 32
      case "64th":
        return 1 / 64
      default:
        throw new Error(`Note duration ${base} is not supported`)
    }
  }

  // if rest, make it note and vice versa
  switchType() {
    if (this.rest) {
      this.rest = undefined
      this.notes = [
        {
          pitch: this.measure.getCurrentClef().getMiddleLinePitch(),
        },
      ]
      this.graphical = new GraphicalNoteEvent(this)
    } else {
      this.rest = {}
      this.notes = undefined
      this.graphical = new GraphicalRestEvent(this)
    }
  }

  changeAccidental(newAlter?: number) {
    // taking into account key signature is out of scope for now
    const note = this.notes![0]
    const { alter, ...rest } = note.pitch
    const alterChanged = alter !== newAlter
    if (!alterChanged) {
      newAlter = undefined
    }
    note.accidentalDisplay = {
      show: typeof newAlter === "number",
    }
    note.pitch = { ...rest, ...(newAlter !== 0 && { alter: newAlter }) }

    this.graphical = new GraphicalNoteEvent(this)
  }

  changePitch(newPitch: Pitch) {
    // TODO: check equality
    const note = this.notes![0]
    note.pitch = newPitch
    note.accidentalDisplay = {
      show: !!newPitch.alter,
    }

    this.graphical = new GraphicalNoteEvent(this)
  }
}
