import { GlobalMeasure } from "./GlobalMeasure"
import { TimeSignature } from "./TimeSignature"
import { Measure } from "./Measure"
import { Beat } from "./Beat"
import { Clef } from "./Clef"
import { Instrument, InstrumentNames, InstrumentType } from "./Instrument"
import { GraphicalScore } from "../graphical"

export type QuickScoreOptions = {
  numberOfMeasures?: number
  timeSignature?: TimeSignature
  instruments?: InstrumentType[]
}

export class Score {
  static createQuickScore(options?: QuickScoreOptions): Score {
    const defaultOptions: Required<QuickScoreOptions> = {
      numberOfMeasures: 1,
      timeSignature: new TimeSignature(2, 4),
      instruments: [InstrumentType.PIANO],
    }
    const mergedOptions = { ...defaultOptions, ...options }

    const score = new Score()

    for (let i = 0; i < mergedOptions.instruments.length; i++) {
      const instrument = new Instrument(InstrumentNames[mergedOptions.instruments[i]])
      instrument.score = score
      instrument.index = i
      for (let m = 0; m < mergedOptions.numberOfMeasures!; m++) {
        const measure = new Measure()
        measure.instrument = instrument
        measure.index = m
        instrument.measures.push(measure)

        if (m === 0) {
          measure.clef = new Clef("G", -2)
        }

        measure.events = Array.from({ length: mergedOptions.timeSignature!.count }, () => {
          const beat = new Beat(
            {
              duration: { base: mergedOptions.timeSignature.unitToDuration() },
              rest: {},
            },
            measure,
          )
          return beat
        })
      }
      score.instruments.push(instrument)
    }

    for (let i = 0; i < mergedOptions.numberOfMeasures!; i++) {
      const globalMeasure = new GlobalMeasure()
      globalMeasure.index = i
      globalMeasure.score = score
      if (i === 0) {
        globalMeasure.time = mergedOptions.timeSignature
      }
      score.globalMeasures.push(globalMeasure)
      globalMeasure.createGlobalBeats()
    }

    return score
  }

  globalMeasures: GlobalMeasure[] = []

  // TODO: staves/measures
  instruments: Instrument[] = []

  graphical: GraphicalScore

  constructor() {
    this.graphical = new GraphicalScore(this)
  }

  getMeasureTimeSignature(index: number): TimeSignature | undefined {
    for (let i = index; i >= 0; i--) {
      const globalMeasure = this.globalMeasures[i]
      if (globalMeasure.time) {
        return globalMeasure.time
      }
    }
    return
  }
}
