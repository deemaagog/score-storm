import { Settings } from "../Settings"
import { IRenderer } from "../interfaces"
import { Measure } from "../model/Measure"
import { GraphicalClef } from "./GraphicalClef"
import { GraphicalNoteEvent } from "./GraphicalNoteEvent"
import { GraphicalRestEvent } from "./GraphicalRestEvent"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"

export class GraphicalMeasure {
  time?: GraphicalTimeSignature
  // // key?: GlobalMeasure["key"]
  clef?: GraphicalClef
  readonly measure: Measure
  events: (GraphicalNoteEvent | GraphicalRestEvent)[] = []

  constructor(measure: Measure) {
    this.measure = measure
  }

  getTopStaveOverflow(settings: Settings) {
    let maxY = 0
    if (this.clef) {
      maxY = this.clef.getTopStaveOverflow(settings)
    }

    return this.events.reduce(
      (max, event) => Math.max(max, event.getTopStaveOverflow(settings)),
      maxY,
    )
  }

  getBottomStaveOverflow(settings: Settings) {
    let minY = 0
    if (this.clef) {
      minY = this.clef.getBottomStaveOverflow(settings)
    }

    return this.events.reduce(
      (min, event) => Math.max(min, event.getBottomStaveOverflow(settings)),
      minY,
    )
  }

  renderStaveLines(renderer: IRenderer, x: number, y: number, settings: Settings, measureWidth: number) {
    renderer.setColor(settings.staveLineColor)
    const half = Math.floor(settings.numberOfStaffLines / 2)
    for (let index = -half; index <= half; index++) {
      renderer.drawRect(
        x,
        y + settings.midStave + settings.unit * index - settings.staffLineThickness / 2,
        measureWidth,
        settings.staffLineThickness,
      )
    }
    renderer.setColor(settings.mainColor)
  }
}
