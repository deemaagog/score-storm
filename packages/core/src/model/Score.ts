import { getMNXScore, getScoreFromMusicXml } from "mnxconverter"
import { GlobalMeasure } from "./GlobalMeasure"
import { TimeSignature } from "./TimeSignature"
import { Measure } from "./Measure"
import { Beat, Note, Pitch } from "./Beat"
import { Clef } from "./Clef"
import { Instrument, InstrumentNames, InstrumentType } from "./Instrument"

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

    score.globalMeasures = Array.from({ length: mergedOptions.numberOfMeasures! }, (_, i) => {
      const globalMeasure = new GlobalMeasure()
      if (i === 0) {
        globalMeasure.time = mergedOptions.timeSignature
      }
      return globalMeasure
    })

    for (let i = 0; i < mergedOptions.instruments.length; i++) {
      const instrument = new Instrument(InstrumentNames[mergedOptions.instruments[i]])
      for (let m = 0; m < mergedOptions.numberOfMeasures!; m++) {
        const measure = new Measure()

        if (m === 0) {
          measure.clef = new Clef("G", -2)
        }

        measure.events = Array.from({ length: mergedOptions.timeSignature!.count }, () => {
          const beat = new Beat({
            duration: { base: mergedOptions.timeSignature.unitToDuration() },
            rest: {},
          })
          beat.measure = measure
          return beat
        })

        measure.instrument = instrument

        instrument.measures.push(measure)
        instrument.index = i
      }
      score.instruments.push(instrument)
    }

    return score
  }

  static fromMusicXML(xml: string): Score {
    const mnxScore = getMNXScore(getScoreFromMusicXml(xml))

    console.log("mnxScore", mnxScore)
    const score = new Score()

    for (const mnxGlobalMeasure of mnxScore.global.measures) {
      const globalMeasure = new GlobalMeasure()
      globalMeasure.key = mnxGlobalMeasure.key
      if (mnxGlobalMeasure.time) {
        globalMeasure.time = new TimeSignature(mnxGlobalMeasure.time.count, mnxGlobalMeasure.time.unit)
      }

      score.globalMeasures.push(globalMeasure)
    }

    for (let i = 0; i < mnxScore.parts.length; i++) {
      const part = mnxScore.parts[i]
      const instrument = new Instrument({ name: part.name || "", shortName: part["short-name"] || "" })
      for (const mnxMeasure of part.measures!) {
        const measure = new Measure()
        measure.events = []
        // TODO: clef changes

        if (mnxMeasure.clefs?.length && !mnxMeasure.clefs[0].position) {
          const { sign, position } = mnxMeasure.clefs[0].clef
          measure.clef = new Clef(sign, position)
        }

        const firstVoice = mnxMeasure.sequences[0]

        for (const event of firstVoice.content) {
          if (event.type === "event") {
            const beat = new Beat(event)
            beat.measure = measure
            measure.events.push(beat)
          } else {
            throw new Error(`Event type ${event.type} is not supported`)
          }
        }
        measure.instrument = instrument
        instrument.measures.push(measure)
        instrument.index = i
      }
      score.instruments.push(instrument)
    }

    return score
  }

  globalMeasures: GlobalMeasure[] = []

  // TODO: staves/measures
  instruments: Instrument[] = []

  constructor() {}

  addMeasure() {
    const currentTimeSignature = this.getMeasureTimeSignature(this.globalMeasures.length - 1)
    if (!currentTimeSignature) {
      throw new Error("Failed to determine time signature")
    }
    this.globalMeasures.push(new GlobalMeasure())
    for (const instrument of this.instruments) {
      // assuming only one stave for now
      const measure = new Measure()
      measure.events = Array.from({ length: currentTimeSignature.count }, () => {
        const beat = new Beat({
          duration: { base: this.globalMeasures[0].time!.unitToDuration() },
          rest: {},
        })
        beat.measure = measure
        return beat
      })
      measure.instrument = instrument
      instrument.measures.push(measure)
    }
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

  // if rest, make it note and vice versa
  switchNoteType(noteEvent: Beat) {
    if (noteEvent.rest) {
      noteEvent.rest = undefined
      noteEvent.notes = [
        {
          pitch: noteEvent.getCurrentClef().getMiddleLinePitch(),
        },
      ]
    } else {
      noteEvent.rest = {}
      noteEvent.notes = undefined
    }
  }

  changeNoteAccidental(note: Note, newAlter?: number) {
    // taking into account key signature is out of scope for now
    const { alter, ...rest } = note.pitch
    const alterChanged = alter !== newAlter
    if (!alterChanged) {
      newAlter = undefined
    }
    note.accidentalDisplay = {
      show: typeof newAlter === "number",
    }
    note.pitch = { ...rest, ...(newAlter !== 0 && { alter: newAlter }) }
  }

  changeNotePitch(note: Note, newPitch: Pitch) {
    // TODO: check equality
    note.pitch = newPitch
    note.accidentalDisplay = {
      show: !!newPitch.alter,
    }
  }
}
