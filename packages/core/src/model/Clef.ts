export class Clef {
  position!: number
  sign!: string

  constructor(sign: string, position: number) {
    this.sign = sign
    this.position = position
  }

  changeType(sign: string, position: number) {
    this.sign = sign
    this.position = position
  }
}
