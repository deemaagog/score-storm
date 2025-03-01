import { GraphicalNoteEvent } from "../graphical"
import { AccidentalDisplay, Beat, Pitch } from "../model/Beat"
import { ICommand } from "./ICommand"

type ChangePitchCommandParams = {
  beat: Beat
  newPitch: Pitch
}

/**
 * A command to change a pitch of a note
 */
export class ChangePitchCommand implements ICommand {
  private beat: Beat
  private newPitch: Pitch
  private originalPitch!: Pitch
  private originalAccidentalDisplay?: AccidentalDisplay

  constructor({ beat, newPitch }: ChangePitchCommandParams) {
    this.beat = beat
    this.newPitch = newPitch
  }

  execute() {
    const note = this.beat.notes![0]
    this.originalPitch = note.pitch
    this.originalAccidentalDisplay = note.accidentalDisplay
    // TODO: check equality
    note.pitch = this.newPitch
    note.accidentalDisplay = {
      show: !!this.newPitch.alter,
    }

    // this will be reworked in https://github.com/deemaagog/score-storm/issues/64
    this.beat.graphical = new GraphicalNoteEvent(this.beat)
  }

  undo() {
    const note = this.beat.notes![0]
    note.pitch = this.originalPitch
    note.accidentalDisplay = this.originalAccidentalDisplay

    // this will be reworked in https://github.com/deemaagog/score-storm/issues/64
    this.beat.graphical = new GraphicalNoteEvent(this.beat)
  }

  redo() {
    this.execute()
  }
}
