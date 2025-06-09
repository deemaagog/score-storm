import { GraphicalScore, Row } from "./GraphicalScore"
import { Settings } from "../Settings"

const mockSettings = {
  barlineHeight: 5,
  unit: 1,
  spaceBetweenStaveRows: 10,
  spaceBetweenInstrumentsRows: 5,
} as Settings

const generateMockScore = (
  numberOfMeasures: number,
  numberOfInstruments: number,
  topOverflow: number = 0,
  bottomOverflow: number = 0,
) => {
  return {
    globalMeasures: Array.from({ length: numberOfMeasures }, (_, i) => ({ index: i })),
    instruments: Array.from({ length: numberOfInstruments }, (_, i) => ({
      measures: Array.from({ length: numberOfMeasures }, (_, j) => ({
        graphical: {
          getTopStaveOverflow: jest.fn(() => topOverflow),
          getBottomStaveOverflow: jest.fn(() => bottomOverflow),
        },
      })),
    })),
  }
}
const mockScoreToRows = (mockScore: any) => {
  const rows = []
  for (let i = 0; i < mockScore.globalMeasures.length; i += 2) {
    rows.push({ globalMeasures: mockScore.globalMeasures.slice(i, i + 2) })
  }
  return rows
}

describe("GraphicalScore.calculatePageBreaks", () => {
  describe("Infinite page height (aka Flow Layout)", () => {
    it(`should calculate instruments position and system height for
     2 measures, 
     one instrument, 
     no top overflow, 
     no bottom overflow`, () => {
      const mockScore = generateMockScore(2, 1)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, Infinity)
      expect(gs.pages.length).toBe(1)
      expect(gs.pages[0].rows.length).toBe(1)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0])

      expect(gs.pages[0].height).toEqual(5)
    })

    it(`should calculate instruments position and system height for
    2 measures,
    one instrument,
    top overflow = 2,
    bottom overflow = 1`, () => {
      const mockScore = generateMockScore(2, 1, 2, 1)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, Infinity)
      expect(gs.pages.length).toBe(1)
      expect(gs.pages[0].rows.length).toBe(1)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(2)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].height).toEqual(8)
    })

    it(`should calculate instruments position and system height for
     5 measures,
     one instrument,
     no top overflow,
     no bottom overflow`, () => {
      const mockScore = generateMockScore(5, 1)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, Infinity)
      expect(gs.pages.length).toBe(1)
      expect(gs.pages[0].rows.length).toBe(3)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].rows[1].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[1].systemYPosition).toEqual(15)
      expect(gs.pages[0].rows[1].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].rows[2].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[2].systemYPosition).toEqual(30)
      expect(gs.pages[0].rows[2].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].height).toEqual(35)
    })

    it(`should calculate instruments position and system height for
    5 measures,
    one instrument,
    top overflow = 2,
    bottom overflow = 1`, () => {
      const mockScore = generateMockScore(5, 1, 2, 1)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, Infinity)
      expect(gs.pages.length).toBe(1)
      expect(gs.pages[0].rows.length).toBe(3)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(2)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].rows[1].systemYPosition).toEqual(17)
      expect(gs.pages[0].rows[1].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[1].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].rows[2].systemYPosition).toEqual(32)
      expect(gs.pages[0].rows[2].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[2].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].height).toEqual(38)
    })

    it(`should calculate instruments position and system height for
    1 measure,
    2 instruments,
    no top overflow,
    no bottom overflow`, () => {
      const mockScore = generateMockScore(1, 2)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, Infinity)
      expect(gs.pages).toBeDefined()
      expect(gs.pages.length).toBe(1)
      expect(gs.pages[0].rows.length).toBe(1)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].height).toEqual(15)
    })

    it(`should calculate instruments position and system height for
    5 measures,
    2 instruments,
    no top overflow,
    no bottom overflow`, () => {
      const mockScore = generateMockScore(5, 2)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, Infinity)
      expect(gs.pages).toBeDefined()
      expect(gs.pages.length).toBe(1)
      expect(gs.pages[0].rows.length).toBe(3)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].rows[1].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[1].systemYPosition).toEqual(25)
      expect(gs.pages[0].rows[1].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].rows[2].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[2].systemYPosition).toEqual(50)
      expect(gs.pages[0].rows[2].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].height).toEqual(65)
    })

    it(`should calculate instruments position and system height for
    5 measures,
    2 instruments,
    top overflow = 2,
    bottom overflow = 1`, () => {
      const mockScore = generateMockScore(5, 2, 2, 1)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, Infinity)
      expect(gs.pages).toBeDefined()
      expect(gs.pages.length).toBe(1)
      expect(gs.pages[0].rows.length).toBe(3)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(2)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].rows[1].systemYPosition).toEqual(27)
      expect(gs.pages[0].rows[1].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[1].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].rows[2].systemYPosition).toEqual(52)
      expect(gs.pages[0].rows[2].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[2].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].height).toEqual(68)
    })
  })

  describe("Fixed Page Height (aka Paged Layout)", () => {
    it(`should calculate instruments position and system height for
     2 measures, 
     one instrument, 
     no top overflow, 
     no bottom overflow`, () => {
      const mockScore = generateMockScore(2, 1)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, 25)
      expect(gs.pages.length).toBe(1)
      expect(gs.pages[0].rows.length).toBe(1)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].height).toEqual(25)
    })

    it(`should calculate instruments position and system height for
    2 measures,
    one instrument,
    top overflow = 2,
    bottom overflow = 1`, () => {
      const mockScore = generateMockScore(2, 1, 2, 1)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, 25)
      expect(gs.pages.length).toBe(1)
      expect(gs.pages[0].rows.length).toBe(1)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(2)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].height).toEqual(25)
    })

    it(`should calculate instruments position and system height for
     5 measures,
     one instrument,
     no top overflow,
     no bottom overflow`, () => {
      const mockScore = generateMockScore(5, 1)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, 25)
      expect(gs.pages.length).toBe(2)

      expect(gs.pages[0].rows.length).toBe(2)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].rows[1].systemYPosition).toEqual(15)
      expect(gs.pages[0].rows[1].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[1].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].height).toEqual(25)

      expect(gs.pages[1].rows.length).toBe(1)
      expect(gs.pages[1].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[1].rows[0].systemHeight).toEqual(5)
      expect(gs.pages[1].rows[0].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].height).toEqual(25)
    })

    it(`should calculate instruments position and system height for
    5 measures,
    one instrument,
    top overflow = 2,
    bottom overflow = 1`, () => {
      const mockScore = generateMockScore(5, 1, 2, 1)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, 25)
      expect(gs.pages.length).toBe(2)

      expect(gs.pages[0].rows.length).toBe(2)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(2)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].rows[1].systemHeight).toEqual(5)
      expect(gs.pages[0].rows[1].systemYPosition).toEqual(17)
      expect(gs.pages[0].rows[1].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].height).toEqual(25)

      expect(gs.pages[1].rows.length).toBe(1)
      expect(gs.pages[1].rows[0].systemHeight).toEqual(5)
      expect(gs.pages[1].rows[0].systemYPosition).toEqual(2)
      expect(gs.pages[1].rows[0].relativeInstrumentsPosition).toEqual([0])
      expect(gs.pages[0].height).toEqual(25)
    })

    it(`should calculate instruments position and system height for
    1 measure,
    2 instruments,
    no top overflow,
    no bottom overflow`, () => {
      const mockScore = generateMockScore(1, 2)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, 25)
      expect(gs.pages).toBeDefined()
      expect(gs.pages.length).toBe(1)
      expect(gs.pages[0].rows.length).toBe(1)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].height).toEqual(25)
    })

    it(`should calculate instruments position and system height for
    5 measures,
    2 instruments,
    no top overflow,
    no bottom overflow`, () => {
      const mockScore = generateMockScore(5, 2)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, 40)
      expect(gs.pages).toBeDefined()
      expect(gs.pages.length).toBe(2)

      expect(gs.pages[0].rows.length).toBe(2)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].rows[1].systemYPosition).toEqual(25)
      expect(gs.pages[0].rows[1].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[1].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].height).toEqual(40)

      expect(gs.pages[1].rows.length).toBe(1)
      expect(gs.pages[1].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[1].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[1].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[1].height).toEqual(40)
    })

    it(`should calculate instruments position and system height for
    5 measures,
    2 instruments,
    top overflow = 2,
    bottom overflow = 1`, () => {
      const mockScore = generateMockScore(5, 2, 2, 1)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, 40)
      expect(gs.pages).toBeDefined()
      expect(gs.pages.length).toBe(3)

      expect(gs.pages[0].rows.length).toBe(1)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(2)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].height).toEqual(40)

      expect(gs.pages[1].rows.length).toBe(1)
      expect(gs.pages[1].rows[0].systemYPosition).toEqual(2)
      expect(gs.pages[1].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[1].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[1].height).toEqual(40)

      expect(gs.pages[2].rows.length).toBe(1)
      expect(gs.pages[2].rows[0].systemYPosition).toEqual(2)
      expect(gs.pages[2].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[2].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[2].height).toEqual(40)
    })

    it(`should calculate instruments position and system height for
        10 measures,
        2 instruments,
        top overflow = 0,
        bottom overflow = 0`, () => {
      const mockScore = generateMockScore(10, 2, 0, 0)
      const rows = mockScoreToRows(mockScore)
      const gs = new GraphicalScore(mockScore as any)

      gs.calculatePageBreaks(rows, mockSettings, 40)
      expect(gs.pages).toBeDefined()
      expect(gs.pages.length).toBe(3)

      expect(gs.pages[0].rows.length).toBe(2)
      expect(gs.pages[0].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[0].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].rows[1].systemYPosition).toEqual(25)
      expect(gs.pages[0].rows[1].systemHeight).toEqual(15)
      expect(gs.pages[0].rows[1].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[0].height).toEqual(40)

      expect(gs.pages[1].rows.length).toBe(2)
      expect(gs.pages[1].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[1].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[1].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[1].rows[1].systemYPosition).toEqual(25)
      expect(gs.pages[1].rows[1].systemHeight).toEqual(15)
      expect(gs.pages[1].rows[1].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[1].height).toEqual(40)

      expect(gs.pages[2].rows.length).toBe(1)
      expect(gs.pages[2].rows[0].systemYPosition).toEqual(0)
      expect(gs.pages[2].rows[0].systemHeight).toEqual(15)
      expect(gs.pages[2].rows[0].relativeInstrumentsPosition).toEqual([0, 10])
      expect(gs.pages[2].height).toEqual(40)
    })
  })
})
