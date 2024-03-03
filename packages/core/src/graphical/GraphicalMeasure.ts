import { GlobalMeasure, TimeSignature } from "../model/GlobalMeasure"
import { Clef } from "../model/Measure"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"

interface GraphicalMeasureParams {
  width: number
  time?: TimeSignature
  // key?: GlobalMeasure["key"]
  clef?: Clef
}

export class GraphicalMeasure {
  width!: number
  time?: GraphicalTimeSignature
  // key?: GlobalMeasure["key"]
  clef?: GraphicalClef

  constructor(params: GraphicalMeasureParams) {
    this.width = params.width

    if (params.clef) {
      this.clef = new GraphicalClef(params.clef)
    }

    // if (params.key) {
    //   this.key = params.key
    // }

    if (params.time) {
      this.time = new GraphicalTimeSignature(params.time)
    }
  }
}
