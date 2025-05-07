export class Layer {
  canvasElement!: HTMLCanvasElement
  context!: CanvasRenderingContext2D
  constructor(containerElement: HTMLDivElement, isInteractionsLayer = false) {
    this.canvasElement = document.createElement("canvas")
    this.context = this.canvasElement.getContext("2d")!
    containerElement.appendChild(this.canvasElement)

    if (isInteractionsLayer) {
      this.canvasElement.style.setProperty("position", "absolute")
      this.canvasElement.style.setProperty("left", "0")
      this.canvasElement.style.setProperty("top", "0")
      this.canvasElement.style.setProperty("pointer-events", "none")
    }
  }

  setup(containerWidth: number, height: number, fontSize: number) {
    const scale = window.devicePixelRatio // Change to 1 on retina screens to see blurry canvas.

    this.canvasElement.style.width = containerWidth + "px"
    this.canvasElement.style.height = height + "px"
    // Set actual size in memory (scaled to account for extra pixel density).
    this.canvasElement.width = containerWidth * scale
    this.canvasElement.height = height * scale
    // Normalize coordinate system to use css pixels.
    this.context.scale(scale, scale)

    this.context.font = `${fontSize}px Bravura`
    this.context.textBaseline = "alphabetic" // middle
    this.context.textAlign = "start"
  }

  clear() {
    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
  }

  setCursorType(type: string) {
    this.canvasElement.style.cursor = type
  }
}
