import { ScoreStorm } from "../ScoreStorm"

export interface ICommand {
  inject?(scoreStorm: ScoreStorm): void
  execute(): void
  undo(): void
  redo(): void
}
