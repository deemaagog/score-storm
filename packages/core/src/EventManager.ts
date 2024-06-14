import { IGraphical } from "./graphical/interfaces"

export enum EventType {
  HOVER = "HOVER",
  HOVER_PROCESSED = "HOVER_PROCESSED",
  SELECTION_STARTED = "SELECTION_STARTED",
  SELECTION_ENDED = "SELECTION_ENDED",
  SELECTION_PROCESSED = "SELECTION_PROCESSED",
}

export interface InteractionPosition {
  x: number
  y: number
}

export interface InteractionEvent {
  x: number
  y: number
  object: IGraphical | null
}

export interface HoverProcessedEvent {
  object: IGraphical | null
}

export interface SelectionProcessedEvent extends HoverProcessedEvent {}

interface EventMap {
  [EventType.HOVER]: InteractionPosition
  [EventType.HOVER_PROCESSED]: HoverProcessedEvent
  [EventType.SELECTION_STARTED]: InteractionPosition
  [EventType.SELECTION_ENDED]: InteractionPosition
  [EventType.SELECTION_PROCESSED]: SelectionProcessedEvent
}

export type EventListenerCallback<K extends EventType> = (event: EventMap[K]) => void
type ListenerMap<K extends EventType> = { [P in K]?: EventListenerCallback<K>[] }

export class EventManager {
  private listenerMap: ListenerMap<EventType> = {}

  public on<K extends EventType>(eventType: K, listener: EventListenerCallback<K>) {
    const listenerMap: ListenerMap<K> = this.listenerMap
    let listeners = listenerMap[eventType]
    if (!listeners) {
      listeners = []
      listenerMap[eventType] = listeners
    }
    listeners.push(listener)
  }

  public dispatch<K extends EventType>(eventType: K, event: EventMap[K]) {
    const listenerMap: ListenerMap<K> = this.listenerMap
    let listeners = listenerMap[eventType]
    if (!listeners) {
      listeners = []
    }
    listeners.forEach((l) => l(event))
  }

  public clear() {
    this.listenerMap = {}
  }
}
