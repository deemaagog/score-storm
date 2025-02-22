import { Settings } from "../Settings"
import { IRenderer } from "../interfaces"
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

  renderStaveLines(renderer: IRenderer, x: number, y: number, settings: Settings) {
    renderer.setColor(settings.staveLineColor)
    const half = Math.floor(settings.numberOfStaffLines / 2)
    for (let index = -half; index <= half; index++) {
      renderer.drawRect(
        x,
        y + settings.midStave + settings.unit * index - settings.staffLineThickness / 2,
        this.measure.getGlobalMeasure().graphical.width,
        settings.staffLineThickness,
      )
    }
    renderer.setColor(settings.mainColor)
  }
}
