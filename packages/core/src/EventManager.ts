import { IGraphical } from "./graphical/interfaces"

export enum EventType {
  HOVER = "hover",
  CLICK = "click",
}

export interface InteractionEvent {
  x: number
  y: number
  object: IGraphical | null
}

interface EventMap {
  [EventType.HOVER]: InteractionEvent
  [EventType.CLICK]: InteractionEvent
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
