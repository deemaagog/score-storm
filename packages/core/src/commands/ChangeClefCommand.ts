import { Clef } from "../model/Clef"
import { Measure } from "../model/Measure"
import { ScoreStorm } from "../ScoreStorm"
import { ICommand } from "./ICommand"

type ChangeClefCommandParams = {
  measure: Measure
}

/**
 * A command to toggle the clef of a given measure (G ↔ F).
 * If the measure has no explicit clef, a new one is created (clef change mid-score).
 */
export class ChangeClefCommand implements ICommand {
  private measure: Measure
  private previousClef: Clef | undefined

  constructor({ measure }: ChangeClefCommandParams) {
    this.measure = measure
  }

  execute(_scoreStorm: ScoreStorm) {
    this.previousClef = this.measure.clef

    // TODO: pass currentSign via constructor (from GraphicalClef.sign) to avoid
    // relying on getCurrentClef() which is currently hardcoded to measures[0]
    const currentSign = this.measure.clef?.sign ?? this.measure.getCurrentClef().sign
    const newSign = currentSign === "G" ? "F" : "G"
    const newPosition = newSign === "G" ? -2 : 2

    if (this.measure.clef) {
      this.measure.clef.changeType(newSign, newPosition)
    } else {
      this.measure.clef = new Clef(newSign, newPosition)
    }
  }

  undo(_scoreStorm: ScoreStorm) {
    this.measure.clef = this.previousClef
  }

  redo(scoreStorm: ScoreStorm) {
    this.execute(scoreStorm)
  }
}
