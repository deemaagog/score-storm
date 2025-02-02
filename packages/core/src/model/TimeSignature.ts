import { GraphicalTimeSignature } from '../graphical'

export class TimeSignature {
  count: number
  unit: number

  graphical: GraphicalTimeSignature

  /**
   * @param count Indicates how many such note values constitute a measure
   * @param unit Indicates the note value that the signature is counting
   * @example new TimeSignature(2, 4) // 2 quarter notes per measure
   */
  constructor(count: number, unit: number) {
    if (count < 1 || count > 12) {
      throw new Error(`Time signature count must be greater than 0 and less than 13, got ${count}`)
    }
    if (unit !== 4 && unit !== 8) {
      throw new Error(`Time signature unit must be 4 or 8, got ${unit}`)
    }
    this.count = count
    this.unit = unit
    this.graphical = new GraphicalTimeSignature(this)
  }

  unitToDuration(): string {
    return this.unit === 4 ? "quarter" : "eighth"
  }
}
