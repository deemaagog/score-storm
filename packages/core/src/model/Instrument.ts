import { Measure } from "./Measure"

export enum InstrumentType {
  PIANO,
}

export const InstrumentNames: Record<InstrumentType, { name: string; shortName: string }> = {
  [InstrumentType.PIANO]: { name: "Piano", shortName: "Pno" },
}

export type InstrumentParams = { name: string; shortName: string }

export class Instrument {
  // TODO: staves/measures
  measures: Measure[] = []
  name: string
  shortName: string

  constructor({ name, shortName }: InstrumentParams) {
    this.name = name
    this.shortName = shortName
  }
}
