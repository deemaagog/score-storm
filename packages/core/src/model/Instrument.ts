import { Measure } from "./Measure"

export enum InstrumentType {
  PIANO,
}

export type InstrumentParams = { name: string; shortName: string }

export const InstrumentNames: Record<InstrumentType, InstrumentParams> = {
  [InstrumentType.PIANO]: { name: "Piano", shortName: "Pno" },
}

export class Instrument {
  // TODO: staves/measures

  // Instrument's position in Score. Starts from 0.
  index!: number

  measures: Measure[] = []
  name: string
  shortName: string

  constructor({ name, shortName }: InstrumentParams) {
    this.name = name
    this.shortName = shortName
  }
}
