import { TimeSignature } from "./TimeSignature"
interface KeySignature {
  fifths: number
}

export class GlobalMeasure {
  key?: KeySignature
  time?: TimeSignature
}
