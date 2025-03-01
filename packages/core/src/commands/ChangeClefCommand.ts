import { ScoreStorm } from "../ScoreStorm"
import { ICommand } from "./ICommand"

/**
 * A command to change a clef. Currently only supports changing the clef of the first stave of the first instrument.
 */
export class ChangeClefCommand implements ICommand {
  scoreStorm!: ScoreStorm

  inject(scoreStorm: ScoreStorm): void {
    this.scoreStorm = scoreStorm
  }

  execute() {
    const firstMeasure = this.scoreStorm.getScore().instruments[0].measures[0]
    if (firstMeasure.clef?.sign === "G") {
      firstMeasure.clef!.changeType("F", 2)
    } else {
      firstMeasure.clef!.changeType("G", -2)
    }
  }

  undo() {
    this.execute()
  }

  redo() {
    this.execute()
  }
}
