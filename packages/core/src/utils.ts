import { altToAcc, note } from "@tonaljs/pitch-note"
import { transpose, simplify, enharmonic } from "@tonaljs/note"
import { Pitch } from "./model/Beat"

/**
 * @param pitch Pitch object to transpose
 * @param interval Interval to transpose the pitch (ex: P5, M3, m7)
 * @returns Transposed pitch
 */
export const transposePitch = (pitch: Pitch, interval: string): Pitch => {
  const tonalPitch = toTonalPitch(pitch)
  const pitchNote = note(tonalPitch)
  const transposedPitch = note(enharmonic(simplify(transpose(pitchNote, interval))))

  return {
    step: transposedPitch.letter,
    octave: transposedPitch.oct!,
    ...(transposedPitch.alt ? { alter: transposedPitch.alt } : {}),
  }
}

/**
 * @param pitch Pitch object
 * @returns A pitch in tonal.js format (ex: C4, D#3, Fb2)
 */
export const toTonalPitch = (pitch: Pitch): string => {
  const alter = pitch.alter ? altToAcc(pitch.alter) : ""
  return `${pitch.step}${alter}${pitch.octave}`
}

/**
 * Converts a SMuFL Unicode symbol string (e.g. "U+E050") to the corresponding character.
 * @param unicodeSymbol Unicode symbol in "U+XXXX" format
 * @returns The character represented by the Unicode code point
 */
export const getTextFromUnicode = (unicodeSymbol: string): string => {
  const codeString = parseInt(unicodeSymbol.replace("U+", ""), 16)
  return String.fromCharCode(codeString)
}
