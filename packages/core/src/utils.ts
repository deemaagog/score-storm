import { altToAcc, note } from "@tonaljs/pitch-note"
import { transpose, simplify, enharmonic } from "@tonaljs/note"
import { Pitch } from "./model/Beat"

/**
 * @param pitch Pitch object to transpose
 * @param interval Interval to transpose the pitch (ex: P5, M3, m7)
 * @returns Transposed pitch
 */

export const transposePitch = (pitch: Pitch, interval: string): Pitch => {
  const alter = pitch.alter ? altToAcc(pitch.alter) : ""
  const pitchNote = note(`${pitch.step}${alter}${pitch.octave}`)
  const transposedPitch = note(enharmonic(simplify(transpose(pitchNote, interval))))

  return {
    step: transposedPitch.letter,
    octave: transposedPitch.oct!,
    ...(transposedPitch.alt ? { alter: transposedPitch.alt } : {}),
  }
}
