import Fraction from "fraction.js"
import { GlobalMeasure } from "../model/GlobalMeasure"
import { TimeSignature } from "../model/TimeSignature"
import { GraphicalMeasure } from "./GraphicalMeasure"
import { GraphicalGlobalBeat } from "./GraphicalGlobalBeat"
import { GraphicalNoteEvent } from "./GraphicalNoteEvent"
import { GraphicalRestEvent } from "./GraphicalRestEvent"
import { GlobalBeat } from "../model/GlobalBeat"

export class GraphicalGlobalMeasure {
  minContentWidth!: number // notes/rests only, measure attributes are not taken into account
  width!: number // actual width calculated at the time of line breaking
  graphicalMeasures: GraphicalMeasure[] = []
  globalMeasure!: GlobalMeasure

  graphicalGlobalBeats: GraphicalGlobalBeat[] = []
  graphicalGlobalBeatByNote: Map<GraphicalNoteEvent | GraphicalRestEvent, GraphicalGlobalBeat> = new Map()

  // horizontal relative positions
  timeSignatureRelativeWidth = 0
  clefRelativeWidth = 0

  constructor(globalMeasure: GlobalMeasure) {
    this.globalMeasure = globalMeasure
  }

  calculateMinContentWidth() {
    const graphicalGlobalBeatByGlobalBeat: Map<GlobalBeat, GraphicalGlobalBeat> = new Map()
    for (let gm = 0; gm < this.graphicalMeasures.length; gm++) {
      const graphicalMeasure = this.graphicalMeasures[gm]
      for (const graphicalNoteEvent of graphicalMeasure.events) {
        const beat = graphicalNoteEvent.noteEvent
        const globalBeat = this.globalMeasure.globalBeatByNote.get(beat)!

        const offsetLeft = graphicalNoteEvent.getBeatOffsetLeft()
        const offsetRight = graphicalNoteEvent.getBeatOffsetRight()

        let graphicalGlobalBeat: GraphicalGlobalBeat

        if (graphicalGlobalBeatByGlobalBeat.has(globalBeat)) {
          graphicalGlobalBeat = graphicalGlobalBeatByGlobalBeat.get(globalBeat)!
        } else {
          graphicalGlobalBeat = {
            globalBeat,
            offsetLeft: 0,
            offsetRight: 0,
          }
          graphicalGlobalBeatByGlobalBeat.set(globalBeat, graphicalGlobalBeat)
        }

        if (offsetLeft > graphicalGlobalBeat.offsetLeft) {
          graphicalGlobalBeat.offsetLeft = offsetLeft
        }

        if (offsetRight > graphicalGlobalBeat.offsetRight) {
          graphicalGlobalBeat.offsetRight = offsetRight
        }
        this.graphicalGlobalBeatByNote.set(graphicalNoteEvent, graphicalGlobalBeat)
      }
    }
    this.minContentWidth = this.graphicalGlobalBeats.reduce((acc, { offsetLeft, offsetRight }) => {
      return acc + offsetLeft + offsetRight
    }, 0)
  }
}
