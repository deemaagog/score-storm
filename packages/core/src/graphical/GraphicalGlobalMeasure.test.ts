import { describe, it, expect, vi } from "vitest"
import { GraphicalGlobalMeasure } from "./GraphicalGlobalMeasure"
import { GlobalMeasure } from "../model/GlobalMeasure"
import { GlobalBeat } from "../model/GlobalBeat"
import { Beat } from "../model/Beat"
import { Settings } from "../Settings"
import { GraphicalGlobalBeat } from "./GraphicalGlobalBeat"

// Mock helper functions
const createMockBeat = (offsetLeft: number = 0, offsetRight: number = 2): Beat => {
  const mockBeat = {
    graphical: {
      getBeatOffsetLeft: vi.fn(() => offsetLeft),
      getBeatOffsetRight: vi.fn(() => offsetRight),
    },
  } as any
  return mockBeat
}

const createMockGlobalBeat = (beats: Beat[], fraction: number, duration: number): GlobalBeat => {
  const mockGlobalBeat = {
    beats,
    graphical: new GraphicalGlobalBeat({} as any),
    fraction,
    duration,
  }

  // Mock the setOffsets method
  mockGlobalBeat.graphical.setOffsets = vi.fn()

  return mockGlobalBeat
}

const createMockGlobalMeasure = (globalBeats: GlobalBeat[]): GlobalMeasure => {
  return {
    globalBeats,
  } as any
}

const createMockSettings = (minimalSpaceBetweenNotes: number = 2): Settings => {
  return {
    minimalSpaceBetweenNotes,
  } as any
}

describe("GraphicalGlobalMeasure.calculateMinContentWidthAndSetRelativeBeatPositions", () => {
  it("should calculate width and positions for single instrument (4 quarter notes)", () => {
    // global beat 1
    const beat1 = createMockBeat(1, 3)
    const globalBeat1 = createMockGlobalBeat([beat1], 0, 0.25)

    // global beat 2
    const beat2 = createMockBeat(0, 2)
    const globalBeat2 = createMockGlobalBeat([beat2], 0.25, 0.25)

    // global beat 3
    const beat3 = createMockBeat(0.5, 3)
    const globalBeat3 = createMockGlobalBeat([beat3], 0.5, 0.25)

    // global beat 4
    const beat4 = createMockBeat(2, 1)
    const globalBeat4 = createMockGlobalBeat([beat4], 0.75, 0.25)

    const globalMeasure = createMockGlobalMeasure([globalBeat1, globalBeat2, globalBeat3, globalBeat4])
    const graphicalGlobalMeasure = new GraphicalGlobalMeasure(globalMeasure)
    const settings = createMockSettings()

    graphicalGlobalMeasure.calculateMinContentWidthAndSetRelativeBeatPositions(settings)

    // Should use max offsets: maxOffsetLeft=1, maxOffsetRight=3
    // expect(globalBeat.graphical.setOffsets).toHaveBeenCalledWith(1, 3)

    // Beat positions:
    expect(beat1.graphical.xRelativePosition).toBe(0)
    expect(beat2.graphical.xRelativePosition).toBe(4)
    expect(beat3.graphical.xRelativePosition).toBe(6)
    expect(beat4.graphical.xRelativePosition).toBe(9.5)

    // Total width: 1 + 3 = 4
    expect(graphicalGlobalMeasure.minContentWidth).toBe(12.5)
  })

  // it("should handle complex scenario with varying offsets across instruments", () => {
  //   // Simulate multiple instruments with different offset requirements
  //   const beat1_instrument1 = createMockBeat(2, 1) // Large left offset
  //   const beat1_instrument2 = createMockBeat(0.5, 3) // Large right offset

  //   const beat2_instrument1 = createMockBeat(1, 1)
  //   const beat2_instrument2 = createMockBeat(1.5, 2)

  //   const globalBeat1 = createMockGlobalBeat([beat1_instrument1, beat1_instrument2])
  //   const globalBeat2 = createMockGlobalBeat([beat2_instrument1, beat2_instrument2])
  //   const globalMeasure = createMockGlobalMeasure([globalBeat1, globalBeat2])
  //   const graphicalGlobalMeasure = new GraphicalGlobalMeasure(globalMeasure)
  //   const settings = createMockSettings(1)

  //   graphicalGlobalMeasure.calculateMinContentWidthAndSetRelativeBeatPositions(settings)

  //   // First global beat should use max(2, 0.5) = 2 for left, max(1, 3) = 3 for right
  //   expect(globalBeat1.graphical.setOffsets).toHaveBeenCalledWith(2, 3)

  //   // Second global beat should use max(1, 1.5) = 1.5 for left, max(1, 2) = 2 for right
  //   expect(globalBeat2.graphical.setOffsets).toHaveBeenCalledWith(1.5, 2)

  //   // Beat positions for first global beat:
  //   // globalBeatX = 0 + 2 = 2
  //   // beat1_instrument1: beatX = 2 - 2 = 0
  //   // beat1_instrument2: beatX = 2 - 0.5 = 1.5
  //   expect(beat1_instrument1.graphical.xRelativePosition).toBe(0)
  //   expect(beat1_instrument2.graphical.xRelativePosition).toBe(1.5)

  //   // Beat positions for second global beat:
  //   // cumulativeX after first beat = 2 + 3 + 1 = 6
  //   // globalBeatX = 6 + 1.5 = 7.5
  //   // beat2_instrument1: beatX = 7.5 - 1 = 6.5
  //   // beat2_instrument2: beatX = 7.5 - 1.5 = 6
  //   expect(beat2_instrument1.graphical.xRelativePosition).toBe(6.5)
  //   expect(beat2_instrument2.graphical.xRelativePosition).toBe(6)

  //   // Total width: (2 + 3) + 1 + (1.5 + 2) = 9.5
  //   expect(graphicalGlobalMeasure.minContentWidth).toBe(9.5)
  // })
})
