export interface Time {
  count: number
  unit: number
}

export class GlobalMeasure {
  key?: {
    fifths: number
  }
  time?: Time
}
