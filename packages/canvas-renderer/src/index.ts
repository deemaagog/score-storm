import { Renderer, RenderParams, Score } from "@score-storm/core"

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

class CanvasRenderer implements Renderer {
  element: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.element = canvas
  }

  render(score: Score, params: RenderParams) {
    // https://opentype.js.org/glyph-inspector.html

    // notes on glyph positioning
    // UPM = 1/4 stave space, i.e 48px font size = 12px between stave lines
    // use  baseline = middle everywhere, default position is middle of 5 lines stave,
    // unless other specified (g clef + 1 stave space, barline default vertical position is bottom of 5 lines stave)
    // staveline thickness: 64px font size equals to 2px thickness. Staveline Y position should be adjusted: y - thickness/2

    const context = this.element.getContext("2d")!
    context.font = `${params.fontSize}px Bravura`

    context.fillStyle = params.mainColor

    let x = params.padding
    const y = params.padding

    const measureWidth = (this.element.width - params.padding * 2) / 2 // temp, just for demo

    for (const bar of score.bars) {
      // draw barline
      context.fillRect(x, y, params.barLineThickness, params.barlineHeight)

      // draw stafflines
      context.fillStyle = "#666666"
      // context.fillStyle = "red"
      const half = Math.floor(params.numberOfStaffLines / 2)
      for (let index = -half; index <= half; index++) {
        context.fillRect(
          x,
          y + params.midStave + params.unit * index - params.staffLineThickness / 2,
          measureWidth,
          params.staffLineThickness,
        )
      }

      context.fillStyle = "black"
      context.fillText(getText("U+E4E3"), x + measureWidth / 2, y + params.midStave) //whole rest

      if (bar.timesig) {
        const [top, bottom] = bar.timesig
        context.fillText(getText(getTimeSignatureSymbol(top)), x + params.unit, y + params.midStave - params.unit) //
        context.fillText(getText(getTimeSignatureSymbol(bottom)), x + params.unit, y + params.midStave + params.unit) //
      }

      x += measureWidth
      // draw end barline
      if (bar.idx === score.bars.length - 1) {
        context.fillRect(x - params.unit, y, params.barLineThickness, params.barlineHeight)
        context.fillRect(x - params.barLineThickness * 3.8, y, params.barLineThickness * 3.8, params.barlineHeight)
      } else {
        context.fillRect(x, y, params.barLineThickness, params.barlineHeight)
      }
    }
  }

  test() {
    const context = this.element.getContext("2d")!
    context.font = `64px Bravura`
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

export default CanvasRenderer

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
