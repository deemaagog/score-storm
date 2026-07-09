import { ScoreStorm } from "../ScoreStorm"

export interface ICommand {
  execute(scoreStorm: ScoreStorm): void
  undo(scoreStorm: ScoreStorm): void
  redo(scoreStorm: ScoreStorm): void
}
