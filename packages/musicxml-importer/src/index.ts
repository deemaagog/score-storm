import { getMNXScore, getScoreFromMusicXml } from "mnxconverter"
import { GlobalMeasure, Score, TimeSignature, Beat, Clef, Instrument, Measure } from "@score-storm/core"

export const fromMusicXML = (xml: string): Score => {
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
