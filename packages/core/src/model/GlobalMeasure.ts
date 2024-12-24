export interface TimeSignature {
  count: number
  unit: number
}

interface KeySignature {
  fifths: number
}

export class GlobalMeasure {
  key?: KeySignature
  time?: TimeSignature
}
