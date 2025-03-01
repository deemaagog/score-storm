import { GraphicalNoteEvent, GraphicalRestEvent } from "../graphical"
import { Beat } from "../model/Beat"
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

  execute() {
    // if rest, make it note and vice versa
    if (this.beat.rest) {
      this.beat.rest = undefined
      this.beat.notes = [
        {
          pitch: this.beat.measure.getCurrentClef().getMiddleLinePitch(),
        },
      ]
      // this will be reworked in https://github.com/deemaagog/score-storm/issues/64
      this.beat.graphical = new GraphicalNoteEvent(this.beat)
    } else {
      this.beat.rest = {}
      this.beat.notes = undefined
      // this will be reworked in https://github.com/deemaagog/score-storm/issues/64
      this.beat.graphical = new GraphicalRestEvent(this.beat)
    }
  }

  undo() {
    this.execute()
  }

  redo() {
    this.execute()
  }
}
