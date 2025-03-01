import { EventType } from "../EventManager"
import { GlobalMeasure } from "../model"
import { Beat } from "../model/Beat"
import { Measure } from "../model/Measure"
import { ScoreStorm } from "../ScoreStorm"
import { ICommand } from "./ICommand"

/**
 * A command to add a measure at the end of the score
 */
export class AddMeasureCommand implements ICommand {
  scoreStorm!: ScoreStorm

  inject(scoreStorm: ScoreStorm): void {
    this.scoreStorm = scoreStorm
  }

  execute() {
    const score = this.scoreStorm.getScore()

    const currentTimeSignature = score.getMeasureTimeSignature(score.globalMeasures.length - 1)
    if (!currentTimeSignature) {
      throw new Error("Failed to determine time signature")
    }

    const newMeasureIndex = score.globalMeasures.length

    for (const instrument of score.instruments) {
      // assuming only one stave for now
      const measure = new Measure()
      measure.instrument = instrument
      measure.index = newMeasureIndex
      measure.events = Array.from({ length: currentTimeSignature.count }, () => {
        const beat = new Beat(
          {
            duration: { base: score.globalMeasures[0].time!.unitToDuration() },
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
    globalMeasure.score = score
    score.globalMeasures.push(globalMeasure)
    globalMeasure.createGlobalBeats()

    this.handleNumberOfMeasuresChange()
  }

  undo() {
    const score = this.scoreStorm.getScore()
    const index = score.globalMeasures.length - 1
    score.globalMeasures.splice(index, 1)
    score.instruments.forEach((instrument) => {
      instrument.measures.splice(index, 1)
    })

    this.handleNumberOfMeasuresChange()
  }

  redo() {
    this.execute()
  }

  handleNumberOfMeasuresChange() {
    this.scoreStorm.eventManager.dispatch(EventType.NUMBER_OF_MEASURES_UPDATED, {
      numberOfMeasures: this.scoreStorm.getScore().globalMeasures.length,
    })
  }
}
