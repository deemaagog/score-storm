import { EventType, HoverProcessedEvent, SelectionProcessedEvent } from "@score-storm/core"
import { Layer } from "./Layer"
import CanvasRenderer from "."

export class Page {
  pageElement: HTMLDivElement
  pageIndex: number
  renderer: CanvasRenderer

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

  constructor(renderer: CanvasRenderer, pageIndex: number) {
    this.pageIndex = pageIndex
    this.renderer = renderer
    this.pageElement = document.createElement("div")
    this.pageElement.style.setProperty("position", "relative")
    this.pageElement.classList.add("ss_page")

    // layers initialization
    this.mainLayer = new Layer(this.pageElement)
    this.hoverLayer = new Layer(this.pageElement, true)
    this.selectionLayer = new Layer(this.pageElement, true)

    this.currentLayer = this.mainLayer

    this.mainLayer.canvasElement.addEventListener("mousemove", (event: MouseEvent) => {
      let x = event.offsetX - this.boundingRect.left
      let y = event.offsetY - this.boundingRect.top
      // let x = event.clientX - this.boundingRect.left
      // let y = event.clientY - this.boundingRect.top
      // console.log("dispatch hover", this.renderer.pages, event, this.boundingRect)

      this.renderer.scoreStorm.eventManager.dispatch(EventType.HOVER, { x, y, pageIndex })
    })

    this.mainLayer.canvasElement.addEventListener("click", (event: MouseEvent) => {
      // let x = event.clientX - this.boundingRect.left
      // let y = event.clientY - this.boundingRect.top
      let x = event.offsetX - this.boundingRect.left
      let y = event.offsetY - this.boundingRect.top
      // console.log("dispatch click", this.renderer.pages, event, this.boundingRect)
      this.renderer.scoreStorm.eventManager.dispatch(EventType.SELECTION_ENDED, { x, y, pageIndex })
    })

    this.boundingRect = this.mainLayer.canvasElement.getBoundingClientRect()
  }

  setup(width: number, height: number, fontSize: number) {
    for (const layer of [this.mainLayer, this.hoverLayer, this.selectionLayer]) {
      layer.setup(width, height, fontSize)
    }
  }

  handleHoverProcessed({ object }: HoverProcessedEvent) {
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

  handleSelectionProcessed({ object }: SelectionProcessedEvent) {
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
