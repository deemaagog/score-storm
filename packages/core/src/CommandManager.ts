import { ICommand } from "./commands/ICommand"
import { EventType } from "./events"
import { ScoreStorm } from "./ScoreStorm"

export class CommandManager {
  private undoStack: ICommand[] = []
  private redoStack: ICommand[] = []

  constructor(private scoreStorm: ScoreStorm) {}

  public execute(command: ICommand) {
    command.execute(this.scoreStorm)
    this.undoStack.push(command)
    this.redoStack = []
    this.handleUpdate()
  }

  public undo() {
    const command = this.undoStack.pop()
    if (command) {
      command.undo(this.scoreStorm)
      this.redoStack.push(command)
      this.handleUpdate()
    }
  }

  public redo() {
    const command = this.redoStack.pop()
    if (command) {
      command.redo(this.scoreStorm)
      this.undoStack.push(command)
      this.handleUpdate()
    }
  }

  public clear() {
    this.undoStack = []
    this.redoStack = []
    this.handleUpdate()
  }

  private handleUpdate() {
    this.scoreStorm.eventManager.dispatch(EventType.UNDO_REDO_STATE_UPDATED, {
      undo: this.undoStack.length > 0,
      redo: this.redoStack.length > 0,
    })
  }
}
