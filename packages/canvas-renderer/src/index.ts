import { Renderer, RenderParams, GraphicalScore } from "@score-storm/core"

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
  containerElement: HTMLDivElement
  containerWidth: number
  canvasElement: HTMLCanvasElement

  constructor(containerElement: HTMLDivElement) {
    console.log("containerElement", containerElement.clientWidth, containerElement.offsetWidth)
    this.containerElement = containerElement
    this.containerWidth = this.containerElement.clientWidth
    this.canvasElement = document.createElement("canvas")
    this.containerElement.appendChild(this.canvasElement)
    
    this.setupResizeObserver()
  }
  
  setupResizeObserver() {
    new ResizeObserver((entries) => {
      this.containerWidth = entries[0].contentRect.width
      console.log("this.containerWidth", this.containerWidth)
    }).observe(this.containerElement) // todo: unobserve?
  }
  
  render(graphicalScore: GraphicalScore, params: RenderParams) {
    this.canvasElement.width = this.containerWidth
    this.canvasElement.height = graphicalScore.height // temp for demo
    // https://opentype.js.org/glyph-inspector.html

    // notes on glyph positioning
    // UPM = 1/4 stave space, i.e 48px font size = 12px between stave lines
    // use  baseline = middle everywhere, default position is middle of 5 lines stave,
    // unless other specified (g clef + 1 stave space, barline default vertical position is bottom of 5 lines stave)
    // staveline thickness: 64px font size equals to 2px thickness. Staveline Y position should be adjusted: y - thickness/2

    const context = this.canvasElement.getContext("2d")!
    // context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height) // temp
    context.font = `${params.fontSize}px Bravura`

    

    let x = 0
    let y = 0

    for (let ri = 0; ri < graphicalScore.rows.length; ri++) {
      const latestRow = ri === graphicalScore.rows.length - 1
      const row = graphicalScore.rows[ri]

      for (let mi = 0; mi < row.measures.length; mi++) {
        const latestMeasureInRow = mi === row.measures.length - 1
        const graphicalMeasure = row.measures[mi]

        // draw stafflines
        context.fillStyle = "#666666"
        const half = Math.floor(params.numberOfStaffLines / 2)
        for (let index = -half; index <= half; index++) {
          context.fillRect(
            x,
            y + params.midStave + params.unit * index - params.staffLineThickness / 2,
            graphicalMeasure.width,
            params.staffLineThickness,
          )
        }

        context.fillStyle = params.mainColor
        // draw barline
        context.fillRect(x, y, params.barLineThickness, params.barlineHeight)

        context.textBaseline = "alphabetic" // middle
        context.textAlign = "start"
        context.fillText(getText("U+E4E3"), x + graphicalMeasure.width / 2, y + params.midStave) //whole rest

        if (graphicalMeasure.globalMeasure.time) {
          const { count, unit } = graphicalMeasure.globalMeasure.time
          context.fillText(getText(getTimeSignatureSymbol(count)), x + params.unit, y + params.midStave - params.unit) //
          context.fillText(getText(getTimeSignatureSymbol(unit)), x + params.unit, y + params.midStave + params.unit) //
        }

        x += graphicalMeasure.width
        // draw end barline
        if (latestMeasureInRow) {
          if (latestRow) {
            context.fillRect(x - params.unit, y, params.barLineThickness, params.barlineHeight)
            context.fillRect(x - params.barLineThickness * 3.8, y, params.barLineThickness * 3.8, params.barlineHeight)
          } else {
            context.fillRect(x - params.barLineThickness, y, params.barLineThickness, params.barlineHeight)
          }
        }
      }
      x = 0
      y += row.height
    }
  }

  test() {
    const context = this.canvasElement.getContext("2d")!
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
