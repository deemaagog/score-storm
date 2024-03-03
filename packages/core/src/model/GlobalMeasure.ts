export interface TimeSignature {
  count: number
  unit: number
}

export class GlobalMeasure {
  key?: {
    fifths: number
  }
  time?: TimeSignature
}
