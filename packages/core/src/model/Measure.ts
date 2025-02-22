import { GlobalMeasure } from "."
import { GraphicalMeasure } from "../graphical/GraphicalMeasure"
import { Beat } from "./Beat"
import { Clef } from "./Clef"
import { Instrument } from "./Instrument"

export class Measure {
  clef?: Clef
  events!: Beat[]
  instrument!: Instrument
  index!: number

  graphical: GraphicalMeasure

  constructor() {
    this.graphical = new GraphicalMeasure(this)
  }

  getCurrentClef(): Clef {
    // TODO: account for clef changes
    return this.instrument.measures[0].clef!
  }

  getGlobalMeasure(): GlobalMeasure {
    return this.instrument.score.globalMeasures[this.index]
  }
}
