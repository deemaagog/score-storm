type Pitch = {
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

  constructor(params: { duration?: NoteDuration; notes?: Note[]; rest?: Rest }) {
    const { duration, notes, rest } = params

    if (!duration) {
      throw new Error(`Duration is not defined`)
    }
    if (notes && notes.length > 1) {
      throw new Error(`Chords are not supported`)
    }

    this.duration = duration
    this.notes = notes
    this.rest = rest

    this.durationValue = this.getDurationValue(duration.base)
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
}
