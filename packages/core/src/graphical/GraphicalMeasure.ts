import { GlobalMeasure } from "../model/GlobalMeasure"
import { Measure } from "../model/Measure"
import { GraphicalTimeSignature } from "./GraphicalTimeSignature"

export class GraphicalMeasure {
  width!: number
  time?: GraphicalTimeSignature
  key?: GlobalMeasure["key"]
  clef?: Measure["clef"]
}
