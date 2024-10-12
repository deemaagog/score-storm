import { Beat } from "./Beat"
import { Clef } from "./Clef"

export class Measure {
  clef?: Clef
  events!: Beat[]
}
