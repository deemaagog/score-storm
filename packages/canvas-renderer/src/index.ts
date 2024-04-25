import { BBox, EventType, IRenderer, Settings } from "@score-storm/core"
import { IGraphical, EventManager } from "@score-storm/core"
import RBush from "rbush"

type SpatialIndexItem = {
  minX: number
  minY: number
  maxX: number
  maxY: number
  object: IGraphical
}

class CanvasRenderer implements IRenderer {
  containerElement: HTMLDivElement
  containerWidth: number

  // main canvas and it's contenxt
  canvasElement!: HTMLCanvasElement
  context!: CanvasRenderingContext2D

  // interaction canvas and it's contenxt
  interactionsCanvasElement!: HTMLCanvasElement
  interactionsContext!: CanvasRenderingContext2D
  detectedObject: IGraphical | null = null

  // current context
  currentContext!: CanvasRenderingContext2D

  resizeObserver: ResizeObserver
  isInitialized: boolean = false

  settings!: Settings
  eventManager!: EventManager

  private spatialSearchTree!: RBush<SpatialIndexItem>

  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement
    this.containerWidth = this.containerElement.clientWidth

    // make this and destroy method part of BrowserRenderer?
    this.resizeObserver = new ResizeObserver((entries) => {
      this.containerWidth = entries[0].contentRect.width
    })
    this.resizeObserver.observe(this.containerElement)

    this.spatialSearchTree = new RBush()
  }

  init() {
    const containerPosition = getComputedStyle(this.containerElement).position
    if (containerPosition !== "relative") {
      this.containerElement.style.setProperty("position", "relative")
    }
    // the main canvas for rendering music scores
    this.canvasElement = document.createElement("canvas")
    this.context = this.canvasElement.getContext("2d")!
    this.containerElement.appendChild(this.canvasElement)

    // a separate canvas for interactions
    this.interactionsCanvasElement = document.createElement("canvas")
    this.interactionsContext = this.interactionsCanvasElement.getContext("2d")!
    this.containerElement.appendChild(this.interactionsCanvasElement)
    this.interactionsCanvasElement.style.setProperty("position", "absolute")
    this.interactionsCanvasElement.style.setProperty("left", "0")
    this.interactionsCanvasElement.style.setProperty("top", "0")
    this.interactionsCanvasElement.style.setProperty("pointer-events", "none")

    this.isInitialized = true

    this.canvasElement.addEventListener("mousemove", (event: MouseEvent) => {
      let rect = this.canvasElement.getBoundingClientRect() // TODO: make it a class member and update on resize
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top

      const result = this.spatialSearchTree.search({
        minX: x,
        minY: y,
        maxX: x,
        maxY: y,
      })
      if (result.length) {
        if (this.detectedObject) {
          return
        }
        this.currentContext = this.interactionsContext
        this.canvasElement.style.cursor = "pointer"

        this.setColor(this.settings.editor!.styles.hoverColor)
        this.detectedObject = result[0].object
        this.detectedObject.render(this, this.settings)
      } else {
        if (!this.detectedObject) {
          return
        }
        this.currentContext = this.interactionsContext
        this.interactionsContext.clearRect(
          0,
          0,
          this.interactionsCanvasElement.width,
          this.interactionsCanvasElement.height,
        )
        this.canvasElement.style.cursor = "default"
        this.detectedObject = null
      }

      this.currentContext = this.context
    })

    this.canvasElement.addEventListener("click", (event: MouseEvent) => {
      let rect = this.canvasElement.getBoundingClientRect() // TODO: make it a class member and update on resize
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top
      if (this.detectedObject) {
        this.eventManager.dispatch(EventType.CLICK, { x, y, object: this.detectedObject })
      }
    })

    this.currentContext = this.context
  }

  destroy() {
    this.containerElement.innerHTML = ""
    this.isInitialized = false
    this.resizeObserver.unobserve(this.containerElement)
  }

  preRender(height: number, fontSize: number) {
    const scale = window.devicePixelRatio // Change to 1 on retina screens to see blurry canvas.

    this.canvasElement.style.width = this.containerWidth + "px"
    this.canvasElement.style.height = height + "px"
    // Set actual size in memory (scaled to account for extra pixel density).
    this.canvasElement.width = this.containerWidth * scale
    this.canvasElement.height = height * scale
    // Normalize coordinate system to use css pixels.
    this.context.scale(scale, scale)

    this.context.font = `${fontSize}px Bravura`
    this.context.textBaseline = "alphabetic" // middle
    this.context.textAlign = "start"

    // interaction canvas
    this.interactionsCanvasElement.style.width = this.containerWidth + "px"
    this.interactionsCanvasElement.style.height = height + "px"
    this.interactionsCanvasElement.width = this.containerWidth * scale
    this.interactionsCanvasElement.height = height * scale
    this.interactionsContext.scale(scale, scale)
    this.interactionsContext.font = `${fontSize}px Bravura`
    this.interactionsContext.textBaseline = "alphabetic" // middle
    this.interactionsContext.textAlign = "start"
  }

  clear() {
    this.spatialSearchTree.clear()
  }

  postRender(): void {}

  setColor(color: string) {
    this.currentContext.fillStyle = color
  }

  drawRect(x: number, y: number, width: number, height: number) {
    // this.currentContext.fillRect(x, y, width, height)

    this.currentContext.beginPath()
    // this.currentContext.rect(x, y, width, height)
    this.currentContext.moveTo(x, y)
    this.currentContext.lineTo(x + width, y)
    this.currentContext.lineTo(x + width, y + height)
    this.currentContext.lineTo(x, y + height)
    this.currentContext.lineTo(x, y)
    this.currentContext.fill()
  }

  drawGlyph(glyph: string, x: number, y: number) {
    // console.log(JSON.stringify(glyph), x, y)
    this.currentContext.fillText(glyph, x, y)
  }

  registerInteractionArea(graphicalObject: IGraphical, bBox: BBox, renderCallback: () => void): void {
    this.spatialSearchTree.insert({
      minX: bBox.x,
      minY: bBox.y,
      maxX: bBox.x + bBox.width,
      maxY: bBox.y + bBox.height,
      object: graphicalObject,
    })
    renderCallback()
  }
}

export default CanvasRenderer
