import { GlobalMeasure } from "../model/GlobalMeasure"
import { GraphicalGlobalBeat } from "./GraphicalGlobalBeat"
import { GraphicalNoteEvent } from "./GraphicalNoteEvent"
import { GraphicalRestEvent } from "./GraphicalRestEvent"
import { Point } from './interfaces'

export class GraphicalGlobalMeasure {
  readonly globalMeasure: GlobalMeasure

  globalBeats: GraphicalGlobalBeat[] = []
  globalBeatByBeat: Map<GraphicalNoteEvent | GraphicalRestEvent, GraphicalGlobalBeat> = new Map()

  minContentWidth!: number // notes/rests only, measure attributes are not taken into account
  width!: number // actual width calculated at the time of line breaking
  height!: number
  position!: Point

  // horizontal relative positions
  timeSignatureRelativeWidth = 0
  clefRelativeWidth = 0

  constructor(globalMeasure: GlobalMeasure) {
    this.globalMeasure = globalMeasure
  }

  setPosition(position: Point): void {
    this.position = position
  }

  calculateMinContentWidth() {
    let minContentWidth = 0
    for (const graphicalGlobalBeat of this.globalBeats) {
      let offsetLeft = 0
      let offsetRight = 0
      for (const beat of graphicalGlobalBeat.beats) {
        offsetLeft = Math.max(offsetLeft, beat.getBeatOffsetLeft())
        offsetRight = Math.max(offsetRight, beat.getBeatOffsetRight())
      }
      graphicalGlobalBeat.setOffsets(offsetLeft, offsetRight)
      minContentWidth += offsetLeft + offsetRight
    }

    this.minContentWidth = minContentWidth
  }
}
