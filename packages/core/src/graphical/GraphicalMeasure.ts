import { GlobalMeasure, TimeSignature } from "../model/GlobalMeasure"
import { Clef, NoteEvent } from "../model/Measure"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalNoteEvent } from "./GraphicalNoteEvent"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"

interface GraphicalMeasureParams {
  width: number
  time?: TimeSignature
  // key?: GlobalMeasure["key"]
  clef?: Clef
  events: NoteEvent[]
}

export class GraphicalMeasure {
  width!: number
  time?: GraphicalTimeSignature
  // key?: GlobalMeasure["key"]
  clef?: GraphicalClef
  events: GraphicalNoteEvent[]

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

    this.events = params.events.map((event) => new GraphicalNoteEvent(event))
  }
}
