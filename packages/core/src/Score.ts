import { getMNXScore, getScoreFromMusicXml } from "mnxconverter"

export class GlobalMeasure {
  key?: {
    // todo: use mnx types
    fifths: number
  }
  time?: {
    count: number
    unit: number
  }
}

export class Score {
  static createDefaultScore() {
    return new Score([
      {
        time: {
          count: 2,
          unit: 4,
        },
      },
    ])
  }

  static fromMusicXML(xml: string) {
    const mnxScore = getMNXScore(getScoreFromMusicXml(xml))
    return new Score(mnxScore.global.measures)
  }

  globalMeasures: GlobalMeasure[]

  constructor(globalMeasures: ReturnType<typeof getMNXScore>["global"]["measures"]) {
    // todo: use mnx types
    this.globalMeasures = globalMeasures
  }

  addMeasure() {
    this.globalMeasures.push({})
    return this
  }

  removeMeasure(index: number) {
    this.globalMeasures.splice(index)
    return this
  }
}
