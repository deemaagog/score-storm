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

  preRender(height: number, fontSize: number) {
    this.canvasElement.style.width = this.containerWidth + "px"
    this.canvasElement.style.height = height + "px"
    // Set actual size in memory (scaled to account for extra pixel density).
    const scale = window.devicePixelRatio // Change to 1 on retina screens to see blurry canvas.
    this.canvasElement.width = this.containerWidth * scale
    this.canvasElement.height = height * scale
    // Normalize coordinate system to use css pixels.
    this.context.scale(scale, scale)

    this.context.font = `${fontSize}px Bravura`
    this.context.textBaseline = "alphabetic" // middle
    this.context.textAlign = "start"
  }

  clear() {
    // noop for now
  }

  postRender(): void {}

  setColor(color: string) {
    this.context.fillStyle = color
  }

  drawRect(x: number, y: number, width: number, height: number) {
    // this.context.fillRect(x, y, width, height)

    this.context.beginPath()
    // this.context.rect(x, y, width, height)
    this.context.moveTo(x, y)
    this.context.lineTo(x + width, y)
    this.context.lineTo(x + width, y + height)
    this.context.lineTo(x, y + height)
    this.context.lineTo(x, y)
    this.context.fill()
  }

  drawGlyph(glyph: string, x: number, y: number) {
    this.context.fillText(glyph, x, y)
  }
}

export default CanvasRenderer
