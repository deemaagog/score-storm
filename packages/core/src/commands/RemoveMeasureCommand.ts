import { EventType } from "../EventManager"
import { GlobalMeasure, Score } from "../model"
import { Measure } from "../model/Measure"
import { ScoreStorm } from "../ScoreStorm"
import { ICommand } from "./ICommand"

type RemoveMeasureCommandParams = {
  index: number
}

/**
 * A command to remove a measure from the score at a given index
 */
export class RemoveMeasureCommand implements ICommand {
  scoreStorm!: ScoreStorm
  private index: number
  private globalMeasure!: GlobalMeasure
  private measuresByInstrument!: Measure[]

  constructor({ index }: RemoveMeasureCommandParams) {
    this.index = index
  }

  inject(scoreStorm: ScoreStorm): void {
    this.scoreStorm = scoreStorm
  }

  execute() {
    const score = this.scoreStorm.getScore()
    this.globalMeasure = score.globalMeasures[this.index]
    this.measuresByInstrument = score.instruments.map((instrument) => instrument.measures[this.index])

    score.globalMeasures.splice(this.index, 1)
    score.globalMeasures.forEach((globalMeasure) => {
      if (globalMeasure.index > this.index) {
        globalMeasure.index--
      }
    })

    score.instruments.forEach((instrument) => {
      instrument.measures.splice(this.index, 1)
      instrument.measures.forEach((measure) => {
        if (measure.index > this.index) {
          measure.index--
        }
      })
    })

    this.handleNumberOfMeasuresChange()
  }

  undo() {
    const score = this.scoreStorm.getScore()
    score.globalMeasures.splice(this.index, 0, this.globalMeasure)
    score.instruments.forEach((instrument, i) => {
      instrument.measures.splice(this.index, 0, this.measuresByInstrument[i])
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
