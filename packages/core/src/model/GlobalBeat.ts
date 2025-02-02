import { GraphicalGlobalBeat } from '../graphical/GraphicalGlobalBeat'
import { Beat } from "./Beat"

export class GlobalBeat  {
  duration: number
  fraction: number
  beats: Beat[]

  graphical: GraphicalGlobalBeat

  constructor(duration: number, fraction: number, beats: Beat[]) {
    this.duration = duration
    this.fraction = fraction
    this.beats = beats

    this.graphical = new GraphicalGlobalBeat(this)
  }
}
