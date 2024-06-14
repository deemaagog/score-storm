import { Clef } from "./Clef"

export type Note = {
  pitch: {
    alter?: number
    octave: number
    step: string
  }
  accidentalDisplay?: {
    show: boolean
  }
}

export type NoteDuration = {
  base: string // duplexMaxima maxima longa breve whole half quarter eighth 16th 32nd 64th 128th 256th 512th 1024th 2048th 4096th
  dots?: number
}

export class NoteEvent {
  duration?: NoteDuration
  notes?: Note[]
  rest?: {}
}

export class Measure {
  clef?: Clef
  events!: NoteEvent[]
}
