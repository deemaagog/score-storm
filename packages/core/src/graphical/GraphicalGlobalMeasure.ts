import { GlobalMeasure } from "../model/GlobalMeasure"
import { Settings } from "../Settings"
import { Point } from "./interfaces"

export class GraphicalGlobalMeasure {
  globalMeasure!: GlobalMeasure

  minContentWidth!: number // notes/rests only, measure attributes are not taken into account
  width!: number // actual width calculated at the time of line breaking
  height!: number
  position!: Point

  // horizontal relative positions
  timeSignatureRelativeWidth = 0
  clefRelativeWidth = 0

  constructor(globalMeasure: GlobalMeasure) {
    this.globalMeasure = globalMeasure
  }

  setPosition(position: Point): void {
    this.position = position
  }

  calculateMinContentWidthAndSetRelativeBeatPositions(settings: Settings) {
    let cumulativeX = 0

    // Process each global beat to calculate spacing
    for (let gb = 0; gb < this.globalMeasure.globalBeats.length; gb++) {
      const globalBeat = this.globalMeasure.globalBeats[gb]
      const graphicalGlobalBeat = globalBeat.graphical

      // Find maximum left and right offsets across all instruments for this global beat
      let maxOffsetLeft = 0
      let maxOffsetRight = 0

      for (let b = 0; b < globalBeat.beats.length; b++) {
        const beat = globalBeat.beats[b]
        const graphicalBeat = beat.graphical
        const beatOffsetLeft = graphicalBeat.getBeatOffsetLeft()
        const beatOffsetRight = graphicalBeat.getBeatOffsetRight()

        maxOffsetLeft = Math.max(maxOffsetLeft, beatOffsetLeft)
        maxOffsetRight = Math.max(maxOffsetRight, beatOffsetRight)
      }

      // Store the calculated offsets for this global beat
      // graphicalGlobalBeat.setOffsets(maxOffsetLeft, maxOffsetRight)

      // Calculate the x position for this global beat (left edge of the notehead area)
      const globalBeatX = cumulativeX + maxOffsetLeft

      // Set positions for all beats in this global beat
      for (let b = 0; b < globalBeat.beats.length; b++) {
        const beat = globalBeat.beats[b]
        const graphicalBeat = beat.graphical

        // Each beat's x position is the global beat position minus its own left offset
        // This ensures noteheads align vertically while accommodating different left offsets
        const beatX = globalBeatX - graphicalBeat.getBeatOffsetLeft()
        beat.graphical.xRelativePosition = beatX
      }

      // Update cumulative position for next global beat
      cumulativeX += maxOffsetLeft + maxOffsetRight

      // Add minimal spacing between beats (except for the last beat)
      // if (gb < this.globalMeasure.globalBeats.length - 1) {
      //   cumulativeX += settings.minimalSpaceBetweenNotes
      // }
    }

    this.minContentWidth = cumulativeX
  }
}
