import { Beat } from "./Beat"

export class GlobalBeat  {
  readonly uid = crypto.randomUUID()
  duration: number
  fraction: number
  beats: Beat[]

  constructor(duration: number, fraction: number, beats: Beat[]) {
    this.duration = duration
    this.fraction = fraction
    this.beats = beats
  }
}
