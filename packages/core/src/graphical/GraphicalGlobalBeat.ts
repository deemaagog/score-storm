import { GlobalBeat } from "../model/GlobalBeat"
import { GraphicalNoteEvent } from "./GraphicalNoteEvent"
import { GraphicalRestEvent } from "./GraphicalRestEvent"
import { Point } from "./interfaces"

export class GraphicalGlobalBeat {
  readonly globalBeat: GlobalBeat

  beats: (GraphicalNoteEvent | GraphicalRestEvent)[] = []
  offsetLeft: number = 0
  offsetRight: number = 0
  position?: Point

  constructor(globalBeat: GlobalBeat) {
    this.globalBeat = globalBeat
  }

  setOffsets(offsetLeft: number, offsetRight: number) {
    this.offsetLeft = offsetLeft
    this.offsetRight = offsetRight
  }

  setPosition(position: Point): void {
    this.position = position
  }
}
