import { GlobalMeasure, TimeSignature } from "../model/GlobalMeasure"
import { Measure, NoteEvent } from "../model/Measure"
import { Clef } from "../model/Clef"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalNoteEvent } from "./GraphicalNoteEvent"
import { GraphicalRestEvent } from "./GraphicalRestEvent"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"

export class GraphicalMeasure {
  time?: GraphicalTimeSignature
  // // key?: GlobalMeasure["key"]
  clef?: GraphicalClef
  events: (GraphicalNoteEvent | GraphicalRestEvent)[]
  measure: Measure

  constructor(measure: Measure) {
    this.measure = measure
    this.events = measure.events.map((event) =>
      event.rest ? new GraphicalRestEvent(event) : new GraphicalNoteEvent(event),
    )
  }

  getMaxY() {}

  getMinY() {}
}
