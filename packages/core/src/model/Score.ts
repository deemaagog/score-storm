import { getMNXScore, getScoreFromMusicXml } from "mnxconverter"
import { GlobalMeasure } from "./GlobalMeasure"
import { Measure } from "./Measure"

export class Score {
  static createDefaultScore(): Score {
    const score = new Score()

    const globalMeasure = new GlobalMeasure()
    globalMeasure.time = {
      count: 2,
      unit: 4,
    }
    score.globalMeasures.push(globalMeasure)

    const measure = new Measure()

    measure.clef = {
      position: 2,
      sign: "G",
    }

    score.measures.push(measure)

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
      // clef changes will be implemented later

      //   "clef": {
      //     "position": -2,
      //     "sign": "G"
      //  }
      //  "clef": {
      //     "position": 2,
      //     "sign": "F"
      //   }
      if (mnxMeasure.clefs?.length && !mnxMeasure.clefs[0].position) {
        measure.clef = mnxMeasure.clefs[0].clef
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
    this.globalMeasures.push(new GlobalMeasure())
    // assuming only one instrument with one stave for now
    this.measures.push(new Measure())
    return this
  }

  removeMeasure(index: number) {
    this.globalMeasures.splice(index)
    this.measures.splice(index)
    return this
  }
}
