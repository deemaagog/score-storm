import { GraphicalNoteEvent } from "./GraphicalNoteEvent"
import { GraphicalRestEvent } from "./GraphicalRestEvent"

export type GraphicalGlobalBeat = {
  duration: number
  fraction: number
  beats: Array<GraphicalNoteEvent | GraphicalRestEvent>
  offsetLeft: number
  offsetRight: number
}
