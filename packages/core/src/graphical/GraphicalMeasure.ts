import { Settings } from "../BaseRenderer"
import { Measure } from "../model/Measure"
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

  getTopStaveOverflow(settings: Settings) {
    let maxY = 0
    if (this.clef) {
      maxY = this.clef.getTopStaveOverflow(settings)
    }

    return this.events.reduce((max, event) => Math.max(max, event.getTopStaveOverflow(settings)), maxY)
  }

  getBottomStaveOverflow(settings: Settings) {
    let minY = 0
    if (this.clef) {
      minY = this.clef.getBottomStaveOverflow(settings)
    }

    return this.events.reduce((min, event) => Math.max(min, event.getBottomStaveOverflow(settings)), minY)
  }
}
