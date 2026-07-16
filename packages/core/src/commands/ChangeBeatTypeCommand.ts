import { Beat } from "../model/Beat"
import { ScoreStorm } from "../ScoreStorm"
import { ICommand } from "./ICommand"

type ChangeBeatTypeCommandParams = {
  beat: Beat
}

/**
 * A command to change a beat type (note to rest or rest to note)
 */
export class ChangeBeatTypeCommand implements ICommand {
  private beat: Beat

  constructor({ beat }: ChangeBeatTypeCommandParams) {
    this.beat = beat
  }

  execute(_scoreStorm: ScoreStorm) {
    // if rest, make it note and vice versa
    if (this.beat.rest) {
      this.beat.rest = undefined
      this.beat.notes = [
        {
          pitch: this.beat.measure.getCurrentClef().getMiddleLinePitch(),
        },
      ]
    } else {
      this.beat.rest = {}
      this.beat.notes = undefined
    }
  }

  undo(scoreStorm: ScoreStorm) {
    this.execute(scoreStorm)
  }

  redo(scoreStorm: ScoreStorm) {
    this.execute(scoreStorm)
  }
}
