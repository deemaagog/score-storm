import { BBox, EventType, HoverProcessedEvent, IRenderer, SelectionProcessedEvent, Settings } from "@score-storm/core"
import { IGraphical, EventManager } from "@score-storm/core"
import { Layer } from "./Layer"

class CanvasRenderer implements IRenderer {
  containerElement: HTMLDivElement
  containerWidth: number

  // *** LAYERS ***
  // main layer meant for rendering music scores
  mainLayer!: Layer
  // layer meant for rendering current hovered object
  hoverLayer!: Layer
  // layer meant for rendering selected object
  selectionLayer!: Layer

  // current layer
  currentLayer!: Layer

  resizeObserver: ResizeObserver
  isInitialized: boolean = false

  settings!: Settings
  eventManager!: EventManager

  boundingRect!: DOMRect

  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement
    this.containerWidth = this.containerElement.clientWidth

    // make this and destroy method part of BrowserRenderer?
    this.resizeObserver = new ResizeObserver((entries) => {
      this.containerWidth = entries[0].contentRect.width
    })
    this.resizeObserver.observe(this.containerElement)

    this.handleHoverProcessed = this.handleHoverProcessed.bind(this)
    this.handleSelectionProcessed = this.handleSelectionProcessed.bind(this)
  }

  handleHoverProcessed({ object }: HoverProcessedEvent) {
    if (object) {
      this.currentLayer = this.hoverLayer
      this.mainLayer.setCursorType("pointer")

      this.setColor(this.settings.editor!.styles.hoverColor)
      object.render(this, this.settings)
    } else {
      this.currentLayer = this.hoverLayer
      this.hoverLayer.clear()
      this.mainLayer.setCursorType("default")
    }

    this.currentLayer = this.mainLayer
  }

  handleSelectionProcessed({ object }: SelectionProcessedEvent) {
    this.currentLayer = this.selectionLayer
    if (object) {
      this.currentLayer.clear()
      this.setColor(this.settings.editor!.styles.selectColor)
      object.render(this, this.settings)
    } else {
      this.currentLayer.clear()
    }

    this.currentLayer = this.mainLayer
  }

  init() {
    const containerPosition = getComputedStyle(this.containerElement).position
    if (containerPosition !== "relative") {
      this.containerElement.style.setProperty("position", "relative")
    }
    // layers initialization
    this.mainLayer = new Layer(this.containerElement)
    this.hoverLayer = new Layer(this.containerElement, true)
    this.selectionLayer = new Layer(this.containerElement, true)

    this.isInitialized = true

    this.mainLayer.canvasElement.addEventListener("mousemove", (event: MouseEvent) => {
      let x = event.clientX - this.boundingRect.left
      let y = event.clientY - this.boundingRect.top

      this.eventManager.dispatch(EventType.HOVER, { x, y })
    })

    this.mainLayer.canvasElement.addEventListener("click", (event: MouseEvent) => {
      let x = event.clientX - this.boundingRect.left
      let y = event.clientY - this.boundingRect.top
      this.eventManager.dispatch(EventType.SELECTION_ENDED, { x, y })
    })

    this.eventManager.on(EventType.HOVER_PROCESSED, this.handleHoverProcessed)
    this.eventManager.on(EventType.SELECTION_PROCESSED, this.handleSelectionProcessed)

    this.currentLayer = this.mainLayer
  }

  destroy() {
    this.containerElement.innerHTML = ""
    this.isInitialized = false
    this.resizeObserver.unobserve(this.containerElement)
  }

  preRender(height: number, fontSize: number) {
    for (const layer of [this.mainLayer, this.hoverLayer, this.selectionLayer]) {
      layer.preRender(this.containerWidth, height, fontSize)
    }

    this.boundingRect = this.mainLayer.canvasElement.getBoundingClientRect()
  }

  clear() {}

  postRender(): void {}

  setColor(color: string) {
    this.currentLayer.context.fillStyle = color
  }

  drawRect(x: number, y: number, width: number, height: number) {
    // this.currentContext.fillRect(x, y, width, height)

    this.currentLayer.context.beginPath()
    // this.currentContext.rect(x, y, width, height)
    this.currentLayer.context.moveTo(x, y)
    this.currentLayer.context.lineTo(x + width, y)
    this.currentLayer.context.lineTo(x + width, y + height)
    this.currentLayer.context.lineTo(x, y + height)
    this.currentLayer.context.lineTo(x, y)
    this.currentLayer.context.fill()
  }

  drawGlyph(glyph: string, x: number, y: number) {
    this.currentLayer.context.fillText(glyph, x, y)
  }

  renderInGroup(_: IGraphical, renderCallback: () => void) {
    renderCallback()
  }
}

export default CanvasRenderer
