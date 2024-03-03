export class BaseGraphical {
  getTextFromUnicode(unicodeSymbol: string) {
    const codeString = parseInt(unicodeSymbol.replace("U+", ""), 16)
    return String.fromCharCode(codeString)
  }
}
