import { AccidentalDisplay, Beat, Pitch } from "../model/Beat"
import { ScoreStorm } from "../ScoreStorm"
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

  execute(_scoreStorm: ScoreStorm) {
    const note = this.beat.notes![0]
    this.originalPitch = note.pitch
    this.originalAccidentalDisplay = note.accidentalDisplay
    // TODO: check equality
    note.pitch = this.newPitch
    note.accidentalDisplay = {
      show: !!this.newPitch.alter,
    }
  }

  undo(_scoreStorm: ScoreStorm) {
    const note = this.beat.notes![0]
    note.pitch = this.originalPitch
    note.accidentalDisplay = this.originalAccidentalDisplay
  }

  redo(scoreStorm: ScoreStorm) {
    this.execute(scoreStorm)
  }
}
