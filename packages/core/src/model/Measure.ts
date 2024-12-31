import { Beat } from "./Beat"
import { Clef } from "./Clef"
import { Instrument } from "./Instrument"

export class Measure {
  clef?: Clef
  events!: Beat[]
  instrument!: Instrument
  // previousMeasure?: Measure
  // nextMeasure?: Measure
}
