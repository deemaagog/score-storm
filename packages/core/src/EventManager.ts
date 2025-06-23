export type EventListenerCallback<K extends keyof M, M> = (event: M[K]) => void

type ListenerMap<K extends keyof M, M> = { [P in K]?: EventListenerCallback<P, M>[] }

export class EventManager<M> {
  private listenerMap: ListenerMap<keyof M, M> = {}

  public on<K extends keyof M>(eventType: K, listener: EventListenerCallback<K, M>) {
    const listenerMap: ListenerMap<keyof M, M> = this.listenerMap
    let listeners = listenerMap[eventType]
    if (!listeners) {
      listeners = []
      listenerMap[eventType] = listeners
    }
    listeners.push(listener)
  }

  public dispatch<K extends keyof M>(eventType: K, event: M[K]) {
    const listenerMap: ListenerMap<keyof M, M> = this.listenerMap
    let listeners = listenerMap[eventType]
    if (!listeners) {
      listeners = []
    }
    listeners.forEach((l) => l(event))
  }

  public off<K extends keyof M>(eventType: K, listener: EventListenerCallback<K, M>) {
    const listenerMap: ListenerMap<keyof M, M> = this.listenerMap
    let listeners = listenerMap[eventType]
    if (!listeners) {
      return
    }
    if (!listeners) {
      return
    }
    const index = listeners.indexOf(listener)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }

  public clear() {
    this.listenerMap = {}
  }
}
