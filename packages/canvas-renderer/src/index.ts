import { Renderer } from "@score-storm/core"

class CanvasRenderer implements Renderer {
  containerElement: HTMLDivElement
  containerWidth: number
  canvasElement!: HTMLCanvasElement
  context!: CanvasRenderingContext2D
  resizeObserver: ResizeObserver
  isInitialized: boolean = false

  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement
    this.containerWidth = this.containerElement.clientWidth
    

    // make this and destroy method part of BrowserRenderer?
    this.resizeObserver = new ResizeObserver((entries) => {
      this.containerWidth = entries[0].contentRect.width
    })
    this.resizeObserver.observe(this.containerElement)
  }

  init() {
    this.canvasElement = document.createElement("canvas")
    this.context = this.canvasElement.getContext("2d")!
    this.containerElement.appendChild(this.canvasElement)
    this.isInitialized = true
  }


  destroy() {
    this.containerElement.innerHTML = ""
    this.isInitialized = false
    this.resizeObserver.unobserve(this.containerElement)
  }

  prepare(height: number, fontSize: number) {
    this.canvasElement.width = this.containerWidth
    this.canvasElement.height = height
    this.context.font = `${fontSize}px Bravura`
    this.context.textBaseline = "alphabetic" // middle
    this.context.textAlign = "start"
  }

  clear() {
    // noop for now
  }

  setColor(color: string) {
    this.context.fillStyle = color
  }

  drawRect(x: number, y: number, width: number, height: number) {
    this.context.fillRect(x, y, width, height)
  }

  drawGlyph(glyph: string, x: number, y: number) {
    this.context.fillText(glyph, x, y)
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
