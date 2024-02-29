import { GlobalMeasure } from "../model/GlobalMeasure"
import { Measure } from "../model/Measure"

export class GraphicalMeasure {
  width!: number
  time?: GlobalMeasure["time"]
  key?: GlobalMeasure["key"]
  clef?: Measure["clef"]
}
