import { Score, getScoreFromMusicXml } from "mnxconverter"

function getText(unicodeSymbol: string) {
  const codeString = parseInt(unicodeSymbol.replace("U+", ""), 16)
  return String.fromCharCode(codeString)
}

function getTimeSignatureSymbol(n: number) {
  const map = {
    0: "U+E080",
    1: "U+E081",
    2: "U+E082",
    3: "U+E083",
    4: "U+E084",
    5: "U+E085",
    6: "U+E086",
    7: "U+E087",
    8: "U+E088",
    9: "U+E089",
  }

  // @ts-expect-error temp
  return map[n] || map[0]
}

class ScoreRenderer {
  element: HTMLCanvasElement
  // @ts-expect-error temp
  score: Score

  scale = 100
  fontSize = 64 // 64 equals 100% scale
  unit = this.fontSize / 4
  padding = 40
  numberOfStaffLines = 5
  staffLineThickness = this.unit / 8
  clefPadding = this.unit
  barLineThickness = this.staffLineThickness * 1.2
  mainColor = "black"
  staveLineColor = "red"
  barlineHeight = this.unit * 4 + this.staffLineThickness
  midStave = this.barlineHeight / 2

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas
  }

  fromMusicXML(xml: string) {
    this.score = getScoreFromMusicXml(xml)
    return this
  }

  render() {
    // https://opentype.js.org/glyph-inspector.html

    // notes on glyph positioning
    // UPM = 1/4 stave space, i.e 48px font size = 12px between stave lines
    // use  baseline = middle everywhere, default position is middle of 5 lines stave,
    // unless other specified (g clef + 1 stave space, barline default vertical position is bottom of 5 lines stave)
    // staveline thickness: 64px font size equals to 2px thickness. Staveline Y position should be adjusted: y - thickness/2

    const context = this.element.getContext("2d")!
    context.font = `${this.fontSize}px Bravura`

    context.fillStyle = this.mainColor

    let x = this.padding
    const y = this.padding

    const measureWidth = (this.element.width - this.padding * 2) / 2 // temp, just for demo

    for (const bar of this.score.bars) {
      // draw barline
      context.fillRect(x, y, this.barLineThickness, this.barlineHeight)

      // draw stafflines
      context.fillStyle = "#666666"
      // context.fillStyle = "red"
      const half = Math.floor(this.numberOfStaffLines / 2)
      for (let index = -half; index <= half; index++) {
        context.fillRect(
          x,
          y + this.midStave + this.unit * index - this.staffLineThickness / 2,
          measureWidth,
          this.staffLineThickness,
        )
      }

      context.fillStyle = "black"
      context.fillText(getText("U+E4E3"), x + measureWidth / 2, y + this.midStave) //whole rest

      if (bar.timesig) {
        const [top, bottom] = bar.timesig
        context.fillText(getText(getTimeSignatureSymbol(top)), x + this.unit, y + this.midStave - this.unit) //
        context.fillText(getText(getTimeSignatureSymbol(bottom)), x + this.unit, y + this.midStave + this.unit) //
      }

      x += measureWidth
      // draw end barline
      if (bar.idx === this.score.bars.length - 1) {
        context.fillRect(x - this.unit, y, this.barLineThickness, this.barlineHeight)
        context.fillRect(x - this.barLineThickness * 3.8, y, this.barLineThickness * 3.8, this.barlineHeight)
      } else {
        context.fillRect(x, y, this.barLineThickness, this.barlineHeight)
      }
    }
  }

  test() {
    const context = this.element.getContext("2d")!
    context.font = `${this.fontSize}px Bravura`
    // test baseline
    context.fillStyle = "red"
    const testY = 300
    context.fillRect(0, testY - 1, 600, 2)
    context.fillRect(0, testY + 32 - 1, 600, 2)
    context.fillRect(0, testY + 16 - 1, 600, 2)
    context.fillRect(0, testY - 16 - 1, 600, 2)
    context.fillRect(0, testY - 32 - 1, 600, 2)

    context.fillStyle = "black"

    // const symbol1 = "\uE050"
    const symbol1 = "\uE084"
    // const symbol1 = "\uE262"
    // const symbol2 = "\uE0A2"
    // const symbol2 = "\uE014"

    context.textBaseline = "middle"
    context.fillText(symbol1, 150, 300 + 16) //time sig
    context.fillText(symbol1, 150, 300 - 16) //time sig

    // context.fillText(symbol2, 175, 300) //U+E050
    context.fillText("\uE050", 50, 300 + 16) //U+E050
    context.fillText("\uE0A2", 200, 300) //U+E050
    context.fillText("\uE0A2", 300, 300 - 16) //U+E050
    context.fillText("\uE0A2", 400, 300 - 8) //U+E050

    // accidental
    context.fillText("\uE260", 270, 300 - 16) //U+E050
    context.fillText("\uE262", 370, 300 - 8) //U+E050

    // rest
    context.fillText("\uE4E3", 470, 300) //U+E050

    // context.fillText("\uE030", 0, 300 - 34) //
    context.fillRect(0, 300 - 32 - 1, 2.4, 64 + 2)
    // context.fillText("\uE032", 585, 300 - 34) //
    context.fillRect(585, 300 - 32 - 1, 2.4, 64 + 2)
    context.fillRect(591.5, 300 - 32 - 1, 8.5, 64 + 2)

    return this
  }
}

export default ScoreRenderer

// retina fix
// const size = 400;
// // canvas.style.width = size + "px";
// // canvas.style.height = size + "px";

// // Set actual size in memory (scaled to account for extra pixel density).
// const scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
// this.element.width = size * scale;
// this.element.height = size * scale;

// context.fillStyle = "blue"
// context.fillText("Hey", 200, 200, 50)
// context.fillRect(100, 100, 100, 100)

// context.beginPath()
// context.arc(50, 50, 50, 0, 2 * Math.PI)
// context.fill()

// Normalize coordinate system to use css pixels.
// context.scale(scale, scale);
