import { GlobalMeasure } from "../model/GlobalMeasure"
import { Point } from './interfaces'

export class GraphicalGlobalMeasure {
  globalMeasure!: GlobalMeasure
  
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
    for(const globalBeat of this.globalMeasure.globalBeats) {
      const graphicalGlobalBeat = globalBeat.graphical
      let offsetLeft = 0
      let offsetRight = 0
      for(const beat of globalBeat.beats) {
        const graphicalBeat = beat.graphical
        const beatOffsetLeft = graphicalBeat.getBeatOffsetLeft()
        const beatOffsetRight = graphicalBeat.getBeatOffsetRight()
        offsetLeft = Math.max(offsetLeft, beatOffsetLeft)
        offsetRight = Math.max(offsetRight, beatOffsetRight)
      }
      graphicalGlobalBeat.setOffsets(offsetLeft, offsetRight)
      minContentWidth += offsetLeft + offsetRight
    }

    this.minContentWidth = minContentWidth
  }
}
