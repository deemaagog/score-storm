import { HoverProcessedEvent, InteractionEventType, PageParameters, SelectionProcessedEvent } from "@score-storm/core"
import CanvasRenderer from "."
import { Layer } from "./Layer"

export class Page {
  renderer: CanvasRenderer
  index: number
  pageElement!: HTMLDivElement

  // *** LAYERS ***
  // main layer meant for rendering music scores
  mainLayer!: Layer
  // layer meant for rendering current hovered object
  hoverLayer!: Layer
  // layer meant for rendering selected object
  selectionLayer!: Layer

  // current layer
  currentLayer!: Layer

  boundingRect!: DOMRect

  constructor(renderer: CanvasRenderer, index: number) {
    this.renderer = renderer
    this.index = index
    this.pageElement = document.createElement("div")
    this.pageElement.style.setProperty("position", "relative")
    // this.pageElement.style.setProperty("line-height", "0")
    // this.pageElement.style.setProperty("text-rendering", "optimizeLegibility")
    // this.pageElement.style.setProperty("-webkit-font-smoothing", "antialiased")
    // this.pageElement.style.setProperty("-moz-osx-font-smoothing", "grayscale")
    this.pageElement.classList.add("ss-page")
  }

  setup(parameters: PageParameters) {
    // layers initialization
    this.mainLayer = new Layer(this.pageElement)
    this.hoverLayer = new Layer(this.pageElement, true)
    this.selectionLayer = new Layer(this.pageElement, true)

    this.mainLayer.canvasElement.addEventListener("mousemove", (event: MouseEvent) => {
      let x = event.clientX - this.boundingRect.left
      let y = event.clientY - this.boundingRect.top

      this.renderer.scoreStorm.dispatchInteractionEvent(InteractionEventType.HOVER, { x, y, pageIndex: this.index })
    })

    this.mainLayer.canvasElement.addEventListener("click", (event: MouseEvent) => {
      let x = event.clientX - this.boundingRect.left
      let y = event.clientY - this.boundingRect.top
      this.renderer.scoreStorm.dispatchInteractionEvent(InteractionEventType.SELECTION_ENDED, {
        x,
        y,
        pageIndex: this.index,
      })
    })

    this.boundingRect = this.mainLayer.canvasElement.getBoundingClientRect()

    this.currentLayer = this.mainLayer

    for (const layer of [this.mainLayer, this.hoverLayer, this.selectionLayer]) {
      layer.setup(parameters)
    }
  }

  handleHoverProcessed(object: HoverProcessedEvent["object"]) {
    if (object) {
      this.currentLayer = this.hoverLayer
      this.mainLayer.setCursorType("pointer")

      this.renderer.setColor(this.renderer.scoreStorm.settings.editor!.styles.hoverColor)
      object.render(this.renderer, this.renderer.scoreStorm.settings)
    } else {
      this.currentLayer = this.hoverLayer
      this.hoverLayer.clear()
      this.mainLayer.setCursorType("default")
    }

    this.currentLayer = this.mainLayer
  }

  handleSelectionProcessed(object: SelectionProcessedEvent["object"]) {
    this.currentLayer = this.selectionLayer
    if (object) {
      this.currentLayer.clear()
      this.renderer.setColor(this.renderer.scoreStorm.settings.editor!.styles.selectColor)
      object.render(this.renderer, this.renderer.scoreStorm.settings)
    } else {
      this.currentLayer.clear()
    }

    this.currentLayer = this.mainLayer
  }
}
