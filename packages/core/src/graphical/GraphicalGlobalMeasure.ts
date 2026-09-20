import { Settings } from "../Settings"
import { GlobalMeasure } from "../model/GlobalMeasure"
import { TimeSignature } from "../model/TimeSignature"
import { distributeSpringWidths, rhythmicGap, sliceDurationInQuarters, SpacingSlice } from "../spacing"
import { GraphicalGlobalBeat } from "./GraphicalGlobalBeat"
import { GraphicalNoteEvent } from "./GraphicalNoteEvent"
import { GraphicalRestEvent } from "./GraphicalRestEvent"
import { Point } from "./interfaces"

interface ContentSpacingLayout {
  leadingOffset: number
  beatGaps: SpacingSlice[]
  trailingOffset: number
  tailGap: SpacingSlice
  minContentWidth: number
}

export class GraphicalGlobalMeasure {
  readonly globalMeasure: GlobalMeasure

  globalBeats: GraphicalGlobalBeat[] = []
  globalBeatByBeat: Map<GraphicalNoteEvent | GraphicalRestEvent, GraphicalGlobalBeat> = new Map()

  minContentWidth!: number // notes/rests only, measure attributes are not taken into account
  width!: number // actual width calculated at the time of line breaking
  height!: number
  position!: Point

  // horizontal relative positions
  timeSignatureRelativeWidth = 0
  keySignatureRelativeWidth = 0
  clefRelativeWidth = 0

  constructor(globalMeasure: GlobalMeasure) {
    this.globalMeasure = globalMeasure
  }

  setPosition(position: Point): void {
    this.position = position
  }

  calculateMinContentWidth(settings: Settings) {
    this.computeBeatOffsets()
    const layout = this.buildContentSpacingLayout(settings)
    this.minContentWidth = layout?.minContentWidth ?? 0
  }

  justifyContent(settings: Settings) {
    const layout = this.buildContentSpacingLayout(settings)
    if (!layout || this.globalBeats.length === 0) {
      return
    }

    const targetContentWidth = this.getContentWidthInSpaces(settings)
    const springSlices = [...layout.beatGaps, layout.tailGap]
    const gapWidths = distributeSpringWidths(springSlices, targetContentWidth - layout.leadingOffset - layout.trailingOffset)

    let contentX = layout.leadingOffset
    for (let i = 0; i < this.globalBeats.length; i++) {
      this.globalBeats[i].contentXInSpaces = contentX
      if (i < layout.beatGaps.length) {
        contentX += gapWidths[i]
      }
    }
  }

  getContentWidthInSpaces(settings: Settings): number {
    let widthInSpaces = this.width / settings.unit - settings.contentMargin

    if (this.clefRelativeWidth > 0) {
      widthInSpaces -= settings.clefMargin + this.clefRelativeWidth
    }
    if (this.keySignatureRelativeWidth > 0) {
      widthInSpaces -= settings.keySignatureMargin + this.keySignatureRelativeWidth
    }
    if (this.timeSignatureRelativeWidth > 0) {
      widthInSpaces -= settings.timeSignatureMargin + this.timeSignatureRelativeWidth
    }

    return widthInSpaces
  }

  private computeBeatOffsets() {
    for (const graphicalGlobalBeat of this.globalBeats) {
      let offsetLeft = 0
      let offsetRight = 0
      for (const beat of graphicalGlobalBeat.beats) {
        offsetLeft = Math.max(offsetLeft, beat.getBeatOffsetLeft())
        offsetRight = Math.max(offsetRight, beat.getBeatOffsetRight())
      }
      graphicalGlobalBeat.setOffsets(offsetLeft, offsetRight)
    }
  }

  private getSameStaffIncomingRod(
    currentBeat: GraphicalGlobalBeat,
    nextBeat: GraphicalGlobalBeat,
  ): number {
    let incomingRod = 0

    for (const nextEvent of nextBeat.beats) {
      const nextLeft = nextEvent.getBeatOffsetLeft()
      if (nextLeft === 0) {
        continue
      }

      for (const prevEvent of currentBeat.beats) {
        if (prevEvent.noteEvent.measure === nextEvent.noteEvent.measure) {
          incomingRod = Math.max(incomingRod, nextLeft)
          break
        }
      }
    }

    return incomingRod
  }

  private getMeasureLengthInQuarters(timeSignature: TimeSignature): number {
    // e.g. 4/4 → 4 quarters, 6/8 → 3 quarters
    return timeSignature.count * (4 / timeSignature.unit)
  }

  private buildContentSpacingLayout(settings: Settings): ContentSpacingLayout | undefined {
    const timeSignature = this.globalMeasure.getCurrentTimeSignature()
    const measureLength = this.getMeasureLengthInQuarters(timeSignature)
    const beats = this.globalBeats

    if (beats.length === 0) {
      return {
        leadingOffset: 0,
        beatGaps: [],
        trailingOffset: 0,
        tailGap: { minWidth: rhythmicGap(measureLength, settings), springWeight: rhythmicGap(measureLength, settings) },
        minContentWidth: rhythmicGap(measureLength, settings),
      }
    }

    const beatGaps: SpacingSlice[] = []

    for (let i = 0; i < beats.length - 1; i++) {
      const duration = sliceDurationInQuarters(
        beats[i].globalBeat.fraction,
        beats[i + 1].globalBeat.fraction,
        measureLength,
      )
      const rhythmic = rhythmicGap(duration, settings)
      const outgoingRod = beats[i].offsetRight
      const incomingRod = this.getSameStaffIncomingRod(beats[i], beats[i + 1])
      const rodPadding = incomingRod > 0 ? settings.glyphRodPadding : 0
      // Rhythmic gaps are the default column spacing. Same-staff accidentals only
      // widen a gap when they need clearance from the previous column's rod.
      // glyphRodPadding adds air between the previous glyph and the accidental —
      // offsetLeft's trailing 0.5 is accidental-to-notehead space inside the column.
      beatGaps.push({
        minWidth: Math.max(rhythmic, outgoingRod + incomingRod + rodPadding),
        springWeight: rhythmic,
      })
    }

    const lastBeat = beats[beats.length - 1]
    const durationToBarline = sliceDurationInQuarters(lastBeat.globalBeat.fraction, 1, measureLength)
    const tailRhythmic = rhythmicGap(durationToBarline, settings)
    const tailGap: SpacingSlice = {
      minWidth: tailRhythmic,
      springWeight: tailRhythmic,
    }

    const minContentWidth =
      beats[0].offsetLeft +
      beatGaps.reduce((sum, gap) => sum + gap.minWidth, 0) +
      lastBeat.offsetRight +
      tailGap.minWidth

    return {
      leadingOffset: beats[0].offsetLeft,
      beatGaps,
      trailingOffset: lastBeat.offsetRight,
      tailGap,
      minContentWidth,
    }
  }
}
