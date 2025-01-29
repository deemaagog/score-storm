import Fraction from "fraction.js"
import { GlobalBeat } from "./GlobalBeat"
import { Score } from "./Score"
import { TimeSignature } from "./TimeSignature"
import { Beat } from "./Beat"
interface KeySignature {
  fifths: number
}

export class GlobalMeasure {
  key?: KeySignature
  time?: TimeSignature
  score!: Score
  index!: number

  // TODO: use Fraction as key https://github.com/dataform-co/dataform/blob/main/common/strings/stringifier.ts#L73
  globalBeats: GlobalBeat[] = []
  globalBeatByNote: Map<Beat, GlobalBeat> = new Map()

  constructor() {}

  createGlobalBeats() {
    const timeSignature = this.score.getMeasureTimeSignature(this.index)
    if (!timeSignature) {
      throw new Error("Failed to determine time signature")
    }
    const globalBeats: Map<string, GlobalBeat> = new Map()
    for (const instrument of this.score.instruments) {
      let currentBeat = new Fraction(1, 1)
      const measure = instrument.measures[this.index]

      for (let b = measure.events.length - 1; b >= 0; b--) {
        const beat = measure.events[b]
        // const dots = duration.dots || 0
        let fraction = new Fraction(timeSignature.unit, timeSignature.count).mul(beat.durationValue)

        // for (let i = 0; i < dots; i++) {
        //   fraction.add(fraction.clone().div(2))
        // }

        currentBeat = currentBeat.sub(fraction)
        const currentBeatString = currentBeat.toFraction()
        const currentBeatFractionValue = currentBeat.valueOf()

        let globalBeat: GlobalBeat

        if (globalBeats.has(currentBeatString)) {
          globalBeat = globalBeats.get(currentBeatString)!
          globalBeat.beats.push(beat)
          if (beat.durationValue < globalBeat.duration) {
            globalBeat.duration = beat.durationValue
          }
        } else {
          globalBeat = {
            duration: beat.durationValue,
            beats: [beat],
            fraction: currentBeatFractionValue,
          }
          globalBeats.set(currentBeatString, globalBeat)
        }
        this.globalBeatByNote.set(beat, globalBeat)
      }
    }

    const sorted = new Map([...globalBeats].sort((a, b) => new Fraction(a[0]).compare(new Fraction(b[0]))))
    // console.log("sorted graphicalGlobalBeats", sorted, timeSignature)
    this.globalBeats = [...sorted.values()]
  }
}
