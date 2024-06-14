import { GlobalMeasure, TimeSignature } from "../model/GlobalMeasure"
import { NoteEvent } from "../model/Measure"
import { Clef } from "../model/Clef"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalNoteEvent } from "./GraphicalNoteEvent"
import { GraphicalRestEvent } from "./GraphicalRestEvent"
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
  events: (GraphicalNoteEvent | GraphicalRestEvent)[]

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

    this.events = params.events.map((event) =>
      event.rest ? new GraphicalRestEvent(event) : new GraphicalNoteEvent(event),
    )
  }
}
