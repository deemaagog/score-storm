export class BaseGraphical {
  id: string

  constructor() {
    this.id = "" + Math.random()
  }

  getTextFromUnicode(unicodeSymbol: string) {
    const codeString = parseInt(unicodeSymbol.replace("U+", ""), 16)
    return String.fromCharCode(codeString)
  }
}
