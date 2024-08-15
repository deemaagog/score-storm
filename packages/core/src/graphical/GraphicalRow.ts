import { GraphicalGlobalMeasure } from './GraphicalGlobalMeasure';

export type InstrumentPosition = number

export class GraphicalRow {
  graphicalGlobalMeasures!: GraphicalGlobalMeasure[]
  instrumentsPosition!: InstrumentPosition[]
}
