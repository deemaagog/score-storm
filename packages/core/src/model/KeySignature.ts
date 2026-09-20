export class KeySignature {
  readonly uid = crypto.randomUUID()
  fifths: number

  /**
   * @param fifths Circle-of-fifths index: positive for sharps, negative for flats, 0 for C major / A minor
   * @example new KeySignature(2) // D major / B minor (F#, C#)
   */
  constructor(fifths: number) {
    if (!Number.isInteger(fifths) || fifths < -7 || fifths > 7) {
      throw new Error(`Key signature fifths must be an integer between -7 and 7, got ${fifths}`)
    }
    this.fifths = fifths
  }
}
