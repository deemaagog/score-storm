import { AccidentalDisplay, Beat, Pitch } from "../model/Beat"
import { ScoreStorm } from "../ScoreStorm"
import { ICommand } from "./ICommand"

type ChangeAccidentalCommandParams = {
  beat: Beat
  accidental?: number
}

/**
 * A command to change an accidental of a note
 */
export class ChangeAccidentalCommand implements ICommand {
  private beat: Beat
  private newAlter?: number
  private originalPitch!: Pitch
  private originalAccidentalDisplay?: AccidentalDisplay

  constructor({ beat, accidental }: ChangeAccidentalCommandParams) {
    this.beat = beat
    this.newAlter = accidental
  }

  execute(_scoreStorm: ScoreStorm) {
    // taking into account key signature is out of scope for now
    const note = this.beat.notes![0]
    this.originalPitch = note.pitch
    this.originalAccidentalDisplay = note.accidentalDisplay

    const { alter, ...rest } = note.pitch
    const alterChanged = alter !== this.newAlter
    if (!alterChanged) {
      this.newAlter = undefined
    }
    note.accidentalDisplay = {
      show: typeof this.newAlter === "number",
    }
    note.pitch = { ...rest, ...(this.newAlter !== 0 && { alter: this.newAlter }) }
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
