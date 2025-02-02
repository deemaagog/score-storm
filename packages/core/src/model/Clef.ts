import { GraphicalClef } from "../graphical"
import { Pitch } from "./Beat"

export class Clef {
  position: number
  sign: string

  graphical: GraphicalClef

  constructor(sign: string, position: number) {
    this.sign = sign
    this.position = position
    this.graphical = new GraphicalClef(this)
  }

  changeType(sign: string, position: number) {
    this.sign = sign
    this.position = position
    this.graphical = new GraphicalClef(this)
  }

  // TODO: this method should probably be moved to GraphicalClef since it's related to rendering
  getMiddleLinePitch(): Pitch {
    switch (this.sign) {
      case "G":
        return { step: "B", octave: 4 }
      case "F":
        return { step: "D", octave: 3 }
      default:
        throw new Error(`Invalid clef sign ${this.sign}`)
    }
  }
}
