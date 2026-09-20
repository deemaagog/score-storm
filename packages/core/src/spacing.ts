import { Settings } from "./Settings"

export function rhythmicGap(durationInQuarters: number, settings: Settings): number {
  if (durationInQuarters <= 0) {
    return settings.minGap
  }

  return Math.max(
    settings.minGap,
    settings.quarterIdealGap * durationInQuarters ** settings.durationExponent,
  )
}

export function sliceDurationInQuarters(
  fractionStart: number,
  fractionEnd: number,
  measureLengthInQuarters: number,
): number {
  return (fractionEnd - fractionStart) * measureLengthInQuarters
}

export interface SpacingSlice {
  minWidth: number
  springWeight: number
}

export function distributeSpringWidths(slices: SpacingSlice[], targetWidth: number): number[] {
  const minTotal = slices.reduce((sum, slice) => sum + slice.minWidth, 0)
  const extra = targetWidth - minTotal

  if (extra <= 0) {
    return slices.map((slice) => slice.minWidth)
  }

  const totalWeight = slices.reduce((sum, slice) => sum + slice.springWeight, 0)
  if (totalWeight === 0) {
    return slices.map((slice) => slice.minWidth)
  }

  return slices.map((slice) => slice.minWidth + extra * (slice.springWeight / totalWeight))
}
