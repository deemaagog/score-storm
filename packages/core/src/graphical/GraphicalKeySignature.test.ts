import { GraphicalKeySignature } from "./GraphicalKeySignature"
import { KeySignature } from "../model/KeySignature"
import { Measure } from "../model/Measure"
import { Clef } from "../model/Clef"

const gClef = new Clef("G", -2)
const fClef = new Clef("F", 2)
const measure = new Measure()

describe("GraphicalKeySignature", () => {
  it("has no width or accidentals for C major", () => {
    const graphical = new GraphicalKeySignature(new KeySignature(0), measure, gClef)
    expect(graphical.width).toBe(0)
    expect(graphical.accidentals).toHaveLength(0)
  })

  it("places two sharps on a G clef (F# top line, C# third space)", () => {
    const graphical = new GraphicalKeySignature(new KeySignature(2), measure, gClef)
    expect(graphical.accidentals).toHaveLength(2)
    expect(graphical.accidentals[0].verticalShift).toBe(-2)
    expect(graphical.accidentals[1].verticalShift).toBe(-0.5)
    expect(graphical.width).toBeGreaterThan(0)
  })

  it("places two flats on a G clef (Bb middle line, Eb fourth space)", () => {
    const graphical = new GraphicalKeySignature(new KeySignature(-2), measure, gClef)
    expect(graphical.accidentals).toHaveLength(2)
    expect(graphical.accidentals[0].verticalShift).toBe(0)
    expect(graphical.accidentals[1].verticalShift).toBe(-1.5)
  })

  it("places the first sharp on an F clef (F# fourth line)", () => {
    const graphical = new GraphicalKeySignature(new KeySignature(1), measure, fClef)
    expect(graphical.accidentals).toHaveLength(1)
    expect(graphical.accidentals[0].verticalShift).toBe(-1)
  })
})

describe("KeySignature", () => {
  it("rejects fifths outside -7..7", () => {
    expect(() => new KeySignature(8)).toThrow()
    expect(() => new KeySignature(-8)).toThrow()
    expect(() => new KeySignature(1.5)).toThrow()
  })
})
