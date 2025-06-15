import { IGraphical } from "../graphical"

export enum InteractionEventType {
  HOVER = "HOVER",
  HOVER_PROCESSED = "HOVER_PROCESSED",
  SELECTION_STARTED = "SELECTION_STARTED",
  SELECTION_ENDED = "SELECTION_ENDED",
  SELECTION_PROCESSED = "SELECTION_PROCESSED",
}

export interface InteractionPosition {
  pageIndex: number
  x: number
  y: number
}

export interface InteractionEvent {
  x: number
  y: number
  object: IGraphical | null
}

export interface HoverProcessedEvent {
  pageIndex: number
  object: IGraphical | null
}

export interface SelectionProcessedEvent extends HoverProcessedEvent {}

export interface InteractionEventMap {
  [InteractionEventType.HOVER]: InteractionPosition
  [InteractionEventType.HOVER_PROCESSED]: HoverProcessedEvent
  [InteractionEventType.SELECTION_STARTED]: InteractionPosition
  [InteractionEventType.SELECTION_ENDED]: InteractionPosition
  [InteractionEventType.SELECTION_PROCESSED]: SelectionProcessedEvent
}
