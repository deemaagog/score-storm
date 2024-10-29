import { IRenderer, Settings } from "@score-storm/core"
import { IGraphical, EventManager } from "@score-storm/core"
import { Canvas, createCanvas, SKRSContext2D, GlobalFonts } from "@napi-rs/canvas"

class NodeSkiaRenderer implements IRenderer {
  containerWidth: number
  canvas!: Canvas
  context!: SKRSContext2D
  isInitialized: boolean = false
  settings!: Settings
  eventManager!: EventManager

  constructor(width: number) {
    this.containerWidth = width
  }

  init() {
    // set initial canvas height to 0, it will be resized later
    this.canvas = createCanvas(this.containerWidth, 0)
    this.context = this.canvas.getContext("2d")
    this.isInitialized = true
  }

  destroy() {
    this.isInitialized = false
  }

  preRender(height: number, fontSize: number) {
    this.canvas.height = height
    this.context.font = `${fontSize}px Bravura`
    this.context.textBaseline = "alphabetic" // middle
    this.context.textAlign = "start"

    // create white background
    this.setColor("white")
    this.drawRect(0, 0, this.containerWidth, height)
  }

  clear() {}

  postRender(): void {}

  setColor(color: string) {
    this.context.fillStyle = color
  }

  drawRect(x: number, y: number, width: number, height: number) {
    this.context.fillRect(x, y, width, height)
  }

  drawGlyph(glyph: string, x: number, y: number) {
    this.context.fillText(glyph, x, y)
  }

  renderInGroup(_: IGraphical, renderCallback: () => void) {
    renderCallback()
  }
}

export default NodeSkiaRenderer
export { GlobalFonts }
