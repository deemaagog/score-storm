import { getMNXScore, getScoreFromMusicXml } from "mnxconverter"
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

  static fromMusicXML(xml: string): Score {
    const mnxScore = getMNXScore(getScoreFromMusicXml(xml))

    console.log("mnxScore", mnxScore)
    const score = new Score()

    for (let i = 0; i < mnxScore.parts.length; i++) {
      const part = mnxScore.parts[i]
      const instrument = new Instrument({ name: part.name || "", shortName: part["short-name"] || "" })
      instrument.score = score
      instrument.index = i
      for (let m = 0; m < part.measures!.length; m++) {
        const mnxMeasure = part.measures![m]
        const measure = new Measure()
        instrument.measures.push(measure)
        measure.instrument = instrument
        measure.index = m
        measure.events = []
        // TODO: clef changes

        if (mnxMeasure.clefs?.length && !mnxMeasure.clefs[0].position) {
          const { sign, position } = mnxMeasure.clefs[0].clef
          measure.clef = new Clef(sign, position)
        }

        const firstVoice = mnxMeasure.sequences[0]

        for (const event of firstVoice.content) {
          if (event.type === "event") {
            const beat = new Beat(event, measure)
            measure.events.push(beat)
          } else {
            throw new Error(`Event type ${event.type} is not supported`)
          }
        }
      }
      score.instruments.push(instrument)
    }

    for (let i = 0; i < mnxScore.global.measures.length; i++) {
      const mnxGlobalMeasure = mnxScore.global.measures[i]
      const globalMeasure = new GlobalMeasure()
      globalMeasure.index = i
      globalMeasure.score = score
      globalMeasure.key = mnxGlobalMeasure.key
      if (mnxGlobalMeasure.time) {
        globalMeasure.time = new TimeSignature(mnxGlobalMeasure.time.count, mnxGlobalMeasure.time.unit)
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

  addMeasure() {
    const currentTimeSignature = this.getMeasureTimeSignature(this.globalMeasures.length - 1)
    if (!currentTimeSignature) {
      throw new Error("Failed to determine time signature")
    }

    const newMeasureIndex = this.globalMeasures.length

    for (const instrument of this.instruments) {
      // assuming only one stave for now
      const measure = new Measure()
      measure.instrument = instrument
      measure.index = newMeasureIndex
      measure.events = Array.from({ length: currentTimeSignature.count }, () => {
        const beat = new Beat(
          {
            duration: { base: this.globalMeasures[0].time!.unitToDuration() },
            rest: {},
          },
          measure,
        )
        return beat
      })
      instrument.measures.push(measure)
    }

    const globalMeasure = new GlobalMeasure()
    globalMeasure.index = newMeasureIndex
    globalMeasure.score = this
    this.globalMeasures.push(globalMeasure)
    globalMeasure.createGlobalBeats()

    return this
  }

  removeMeasure(index: number) {
    if (this.globalMeasures.length === 1) {
      throw new Error("Failed to remove measure. There should be at least one measure in music score")
    }
    this.globalMeasures.splice(index)
    for (const instrument of this.instruments) {
      instrument.measures.splice(index)
    }
    return this
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

  setClef() {
    const firstMeasure = this.instruments[0].measures[0]
    if (firstMeasure.clef?.sign === "G") {
      firstMeasure.clef!.changeType("F", 2)
    } else {
      firstMeasure.clef!.changeType("G", -2)
    }
  }
}
