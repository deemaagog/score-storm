import { getMNXScore, getScoreFromMusicXml } from "mnxconverter"
import { GlobalMeasure, TimeSignature } from "./GlobalMeasure"
import { Measure, Note, NoteEvent } from "./Measure"
import { Clef } from "./Clef"

export type QuickScoreOptions = {
  numberOfMeasures?: number
  timeSignature?: TimeSignature
}

export class Score {
  static createQuickScore(options?: QuickScoreOptions): Score {
    const defaultOptions = {
      numberOfMeasures: 1,
      timeSignature: {
        count: 2,
        unit: 4,
      },
    }
    options = { ...defaultOptions, ...options }

    const score = new Score()

    for (let i = 0; i < options.numberOfMeasures!; i++) {
      const globalMeasure = new GlobalMeasure()
      const measure = new Measure()

      if (i === 0) {
        globalMeasure.time = options.timeSignature
        measure.clef = new Clef("G", -2)
      }

      measure.events = Array.from({ length: options.timeSignature!.count }, () => ({
        duration: { base: "quarter" },
        rest: {},
      }))

      score.globalMeasures.push(globalMeasure)
      score.measures.push(measure)
    }

    return score
  }

  static fromMusicXML(xml: string): Score {
    const mnxScore = getMNXScore(getScoreFromMusicXml(xml))
    const score = new Score()

    for (const mnxGlobalMeasure of mnxScore.global.measures) {
      const globalMeasure = new GlobalMeasure()
      globalMeasure.key = mnxGlobalMeasure.key
      globalMeasure.time = mnxGlobalMeasure.time

      score.globalMeasures.push(globalMeasure)
    }

    for (const mnxMeasure of mnxScore.parts[0].measures!) {
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
          if (!["whole", "half", "quarter"].includes(event.duration!.base)) {
            throw new Error(`Note duration ${event.duration!.base} is not supported`)
          }
          if (event.notes && event.notes.length > 1) {
            throw new Error(`Chords are not supported`)
          }
          measure.events.push(event)
        } else {
          throw new Error(`Event type ${event.type} is not supported`)
        }
      }

      score.measures.push(measure)
    }

    return score
  }

  globalMeasures: GlobalMeasure[] = []

  // TODO: istruments/staves/measures
  measures: Measure[] = []

  constructor() {}

  addMeasure() {
    const currentTimeSignature = this.getMeasureTimeSignature(this.globalMeasures.length - 1)
    if (!currentTimeSignature) {
      throw new Error("Failed to determine time sinature")
    }
    this.globalMeasures.push(new GlobalMeasure())
    // assuming only one instrument with one stave for now
    const measure = new Measure()
    measure.events = Array.from({ length: currentTimeSignature.count }, () => ({
      duration: { base: "quarter" },
      rest: {},
    }))
    this.measures.push(measure)
    return this
  }

  removeMeasure(index: number) {
    if (this.globalMeasures.length === 1) {
      throw new Error("Failed to remove measure. There should be at least one measure in music score")
    }
    this.globalMeasures.splice(index)
    this.measures.splice(index)
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
    const firstMeasure = this.measures[0]
    if (firstMeasure.clef?.sign === "G") {
      firstMeasure.clef!.changeType("F", 2)
    } else {
      firstMeasure.clef!.changeType("G", -2)
    }
  }

  // if rest, make it note and vice versa
  swithNoteType(noteEvent: NoteEvent) {
    if (noteEvent.rest) {
      noteEvent.rest = undefined
      noteEvent.notes = [
        {
          pitch: {
            octave: 4,
            step: "B",
          },
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
}
