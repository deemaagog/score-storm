import Fraction from "fraction.js"
import { GlobalMeasure } from "../model/GlobalMeasure"
import { TimeSignature } from "../model/TimeSignature"
import { GraphicalMeasure } from "./GraphicalMeasure"
import { GraphicalGlobalBeat } from "./GraphicalGlobalBeat"
import { GraphicalNoteEvent } from "./GraphicalNoteEvent"
import { GraphicalRestEvent } from "./GraphicalRestEvent"

export class GraphicalGlobalMeasure {
  minContentWidth!: number // notes/rests only, measure attributes are not taken into account
  width!: number // actual width calculated at the time of line breaking
  graphicalMeasures: GraphicalMeasure[] = []
  globalMeasure!: GlobalMeasure
  // TODO: use Fraction as key https://github.com/dataform-co/dataform/blob/main/common/strings/stringifier.ts#L73

  graphicalGlobalBeats: GraphicalGlobalBeat[] = []
  graphicalGlobalBeatByNote: Map<GraphicalNoteEvent | GraphicalRestEvent, GraphicalGlobalBeat> = new Map()

  // horizontal relative positions
  timeSignatureRelativeWidth = 0
  clefRelativeWidth = 0

  constructor(globalMeasure: GlobalMeasure) {
    this.globalMeasure = globalMeasure
  }

  calculateMinContentWidth(timeSignature: TimeSignature) {
    const graphicalGlobalBeats: Map<string, GraphicalGlobalBeat> = new Map()
    for (let gm = 0; gm < this.graphicalMeasures.length; gm++) {
      const graphicalMeasure = this.graphicalMeasures[gm]
      let currentBeat = new Fraction(1, 1)
      for (let gev = graphicalMeasure.events.length - 1; gev >= 0; gev--) {
        const graphicalNoteEvent = graphicalMeasure.events[gev]
        const beat = graphicalNoteEvent.noteEvent
        // const dots = duration.dots || 0
        let fraction = new Fraction(timeSignature.unit, timeSignature.count).mul(beat.durationValue)

        // for (let i = 0; i < dots; i++) {
        //   fraction.add(fraction.clone().div(2))
        // }

        currentBeat = currentBeat.sub(fraction)
        const currentBeatString = currentBeat.toFraction()
        const currentBeatFractionValue = currentBeat.valueOf()

        const offsetLeft = graphicalNoteEvent.getBeatOffsetLeft()
        const offsetRight = graphicalNoteEvent.getBeatOffsetRight()

        let graphicalBeat: GraphicalGlobalBeat

        if (graphicalGlobalBeats.has(currentBeatString)) {
          graphicalBeat = graphicalGlobalBeats.get(currentBeatString)!
          graphicalBeat.beats.push(graphicalNoteEvent)
          if (beat.durationValue < graphicalBeat.duration) {
            graphicalBeat.duration = beat.durationValue
          }

          if (offsetLeft > graphicalBeat.offsetLeft) {
            graphicalBeat.offsetLeft = offsetLeft
          }

          if (offsetRight > graphicalBeat.offsetRight) {
            graphicalBeat.offsetRight = offsetRight
          }
        } else {
          graphicalBeat = {
            duration: beat.durationValue,
            beats: [graphicalNoteEvent],
            offsetLeft,
            offsetRight,
            fraction: currentBeatFractionValue,
          }
          graphicalGlobalBeats.set(currentBeatString, graphicalBeat)
        }
        this.graphicalGlobalBeatByNote.set(graphicalNoteEvent, graphicalBeat)
      }
    }
    const sorted = new Map([...graphicalGlobalBeats].sort((a, b) => new Fraction(a[0]).compare(new Fraction(b[0]))))
    // console.log("sorted graphicalGlobalBeats", sorted, timeSignature)
    this.graphicalGlobalBeats = [...sorted.values()]
    this.minContentWidth = this.graphicalGlobalBeats.reduce((acc, { offsetLeft, offsetRight }) => {
      return acc + offsetLeft + offsetRight
    }, 0)
  }
}
