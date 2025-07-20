import { EventType } from "../events"
import { GlobalMeasure } from "../model"
import { Beat } from "../model/Beat"
import { Measure } from "../model/Measure"
import { ScoreStorm } from "../ScoreStorm"
import { ICommand } from "./ICommand"

type CloneMeasureCommandParams = {
  index: number
}

/**
 * A command to clone a measure at the right of the original measure
 */
export class CloneMeasureCommand implements ICommand {
  private scoreStorm!: ScoreStorm
  private index: number

  constructor({ index }: CloneMeasureCommandParams) {
    this.index = index
  }

  inject(scoreStorm: ScoreStorm): void {
    this.scoreStorm = scoreStorm
  }

  execute() {
    const score = this.scoreStorm.getScore()
    for (const instrument of score.instruments) {
      const originalMeasure = instrument.measures[this.index]
      // assuming only one stave for now
      const measure = new Measure()
      measure.instrument = instrument
      measure.index = this.index + 1
      measure.events = originalMeasure.events.map((event) => {
        const beat = new Beat(
          {
            duration: { ...event.duration },
            rest: event.rest,
            notes: event.notes?.map((note) => {
              return {
                pitch: { ...note.pitch },
                accidentalDisplay: note.accidentalDisplay && { ...note.accidentalDisplay },
              }
            }),
          },
          measure,
        )
        return beat
      })
      // shift indexes of measures after the new measure
      instrument.measures.forEach((m) => {
        if (m.index > this.index) {
          m.index++
        }
      })
      // insert the new measure
      instrument.measures.splice(this.index + 1, 0, measure)
    }

    const globalMeasure = new GlobalMeasure()
    globalMeasure.index = this.index + 1
    globalMeasure.score = score

    // shift indexes of measures after the new measure
    score.globalMeasures.forEach((gm) => {
      if (gm.index > this.index) {
        gm.index++
      }
    })
    // insert the new measure
    score.globalMeasures.splice(this.index + 1, 0, globalMeasure)
    globalMeasure.createGlobalBeats()

    this.handleNumberOfMeasuresChange()
  }

  undo() {
    const score = this.scoreStorm.getScore()
    score.globalMeasures.splice(this.index + 1, 1)
    score.globalMeasures.forEach((gm) => {
      if (gm.index > this.index) {
        gm.index--
      }
    })

    score.instruments.forEach((instrument) => {
      instrument.measures.splice(this.index + 1, 1)
      instrument.measures.forEach((m) => {
        if (m.index > this.index) {
          m.index--
        }
      })
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
