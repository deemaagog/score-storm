import ScoreStorm, {
  BBox,
  HoverProcessedEvent,
  IRenderer,
  SelectionProcessedEvent,
  IGraphical,
  InteractionEventType,
} from "@score-storm/core"
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

  isInitialized: boolean = false

  scoreStorm!: ScoreStorm

  boundingRect!: DOMRect

  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement
    this.containerWidth = this.containerElement.clientWidth

    this.handleHoverProcessed = this.handleHoverProcessed.bind(this)
    this.handleSelectionProcessed = this.handleSelectionProcessed.bind(this)
  }

  handleHoverProcessed({ object }: HoverProcessedEvent) {
    if (object) {
      this.currentLayer = this.hoverLayer
      this.mainLayer.setCursorType("pointer")

      this.setColor(this.scoreStorm.settings.editor!.styles.hoverColor)
      object.render(this, this.scoreStorm.settings)
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
      this.setColor(this.scoreStorm.settings.editor!.styles.selectColor)
      object.render(this, this.scoreStorm.settings)
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

      this.scoreStorm.dispatchInteractionEvent(InteractionEventType.HOVER, { x, y })
    })

    this.mainLayer.canvasElement.addEventListener("click", (event: MouseEvent) => {
      let x = event.clientX - this.boundingRect.left
      let y = event.clientY - this.boundingRect.top
      this.scoreStorm.dispatchInteractionEvent(InteractionEventType.SELECTION_ENDED, { x, y })
    })

    this.scoreStorm.setInteractionEventListener(InteractionEventType.HOVER_PROCESSED, this.handleHoverProcessed)
    this.scoreStorm.setInteractionEventListener(InteractionEventType.SELECTION_PROCESSED, this.handleSelectionProcessed)

    this.currentLayer = this.mainLayer
  }

  destroy() {
    for (const layer of [this.mainLayer, this.hoverLayer, this.selectionLayer]) {
      this.containerElement.removeChild(layer.canvasElement)
    }

    this.isInitialized = false
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

  getColor(): string {
    return this.currentLayer.context.fillStyle as string
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
