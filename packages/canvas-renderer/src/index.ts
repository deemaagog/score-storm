import { BBox, EventType, IRenderer, Settings } from "@score-storm/core"
import { IGraphical, EventManager } from "@score-storm/core"
import RBush from "rbush"
import { Layer } from "./Layer"

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

  // *** LAYERS ***
  // main layer meant for rendering music scores
  mainLayer!: Layer
  // layer meant for rendering current hovered object
  hoverLayer!: Layer
  // layer meant for rendering selected object
  selectionLayer!: Layer

  hoveredObject: IGraphical | null = null
  selectedObject: IGraphical | null = null

  // current layer
  currentLayer!: Layer

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
    // layers initialization
    this.mainLayer = new Layer(this.containerElement)
    this.hoverLayer = new Layer(this.containerElement, true)
    this.selectionLayer = new Layer(this.containerElement, true)

    this.isInitialized = true

    this.mainLayer.canvasElement.addEventListener("mousemove", (event: MouseEvent) => {
      let rect = this.mainLayer.canvasElement.getBoundingClientRect() // TODO: make it a class member and update on resize
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top

      const result = this.spatialSearchTree.search({
        minX: x,
        minY: y,
        maxX: x,
        maxY: y,
      })
      if (result.length) {
        if (this.hoveredObject) {
          return
        }
        this.currentLayer = this.hoverLayer
        this.mainLayer.setCursorType("pointer")

        this.setColor(this.settings.editor!.styles.hoverColor)
        this.hoveredObject = result[0].object
        this.hoveredObject.render(this, this.settings)
      } else {
        if (!this.hoveredObject) {
          return
        }
        this.currentLayer = this.hoverLayer
        this.hoverLayer.clear()
        this.mainLayer.setCursorType("default")
        this.hoveredObject = null
      }

      this.currentLayer = this.mainLayer
    })

    this.mainLayer.canvasElement.addEventListener("click", (event: MouseEvent) => {
      let rect = this.mainLayer.canvasElement.getBoundingClientRect() // TODO: make it a class member and update on resize
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top
      this.selectedObject = this.hoveredObject

      this.currentLayer = this.selectionLayer
      if (this.selectedObject) {
        this.currentLayer.clear()
        this.setColor(this.settings.editor!.styles.selectColor)
        this.selectedObject.render(this, this.settings)
      } else {
        this.currentLayer.clear()
      }
      this.currentLayer = this.mainLayer

      this.eventManager.dispatch(EventType.CLICK, { x, y, object: this.hoveredObject })
    })

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
  }

  clear() {
    this.spatialSearchTree.clear()
  }

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
