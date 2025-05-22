export enum EventType {
  UNDO_REDO_STATE_UPDATED = "UNDO_REDO_STATE_UPDATED",
  NUMBER_OF_MEASURES_UPDATED = "NUMBER_OF_MEASURES_UPDATED",
}

export interface UndoRedoStateUpdatedEvent {
  undo: boolean
  redo: boolean
}

export interface NumberOfMeasuresUpdatedEvent {
  numberOfMeasures: number
}

export interface EventMap {
  [EventType.UNDO_REDO_STATE_UPDATED]: UndoRedoStateUpdatedEvent
  [EventType.NUMBER_OF_MEASURES_UPDATED]: NumberOfMeasuresUpdatedEvent
}
