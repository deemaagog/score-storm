import Fraction from 'fraction.js';
import { GlobalMeasure } from "../model/GlobalMeasure"
import { GraphicalMeasure } from "./GraphicalMeasure"

export class FractionablePlayEvent {
  fraction!: Fraction
}

export class GraphicalGlobalMeasure {
  minContentWidth!: number // notes/rests only, measure attributes are not taken into account
  width!: number // actual width calculated at the time line breaking
  graphicalMeasures: GraphicalMeasure[] = []
  globalMeasure!: GlobalMeasure

  constructor(globalMeasure: GlobalMeasure) {
    this.globalMeasure = globalMeasure
  }

  calculateMinContentWidth() {
    this.minContentWidth = 0 // TODO: justify notes and calculate width
  }
}
