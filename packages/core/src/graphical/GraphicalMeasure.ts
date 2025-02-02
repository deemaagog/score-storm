import { Settings } from "../Settings"
import { Measure } from "../model/Measure"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"

export class GraphicalMeasure {
  time?: GraphicalTimeSignature
  // // key?: GlobalMeasure["key"]
  clef?: GraphicalClef
  measure: Measure

  constructor(measure: Measure) {
    this.measure = measure
  }

  getTopStaveOverflow(settings: Settings) {
    let maxY = 0
    if (this.clef) {
      maxY = this.measure.getCurrentClef().graphical.getTopStaveOverflow(settings)
    }

    return this.measure.events.reduce(
      (max, event) => Math.max(max, event.graphical.getTopStaveOverflow(settings)),
      maxY,
    )
  }

  getBottomStaveOverflow(settings: Settings) {
    let minY = 0
    if (this.clef) {
      minY = this.measure.getCurrentClef().graphical.getBottomStaveOverflow(settings)
    }

    return this.measure.events.reduce(
      (min, event) => Math.max(min, event.graphical.getBottomStaveOverflow(settings)),
      minY,
    )
  }
}
