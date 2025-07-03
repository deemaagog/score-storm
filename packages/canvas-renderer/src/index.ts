import ScoreStorm, {
  HoverProcessedEvent,
  IRenderer,
  SelectionProcessedEvent,
  IGraphical,
  InteractionEventType,
  PageParameters,
} from "@score-storm/core"
import { Page } from "./Page"

class CanvasRenderer implements IRenderer {
  containerElement: HTMLDivElement

  isInitialized: boolean = false

  scoreStorm!: ScoreStorm

  boundingRect!: DOMRect

  pages: Page[] = []
  currentPage: Page | null = null

  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement

    this.handleHoverProcessed = this.handleHoverProcessed.bind(this)
    this.handleSelectionProcessed = this.handleSelectionProcessed.bind(this)
  }

  getContainerWidth() {
    return this.containerElement.clientWidth
  }

  handleHoverProcessed({ object, pageIndex }: HoverProcessedEvent) {
    this.currentPage = this.pages[pageIndex]
    this.currentPage.handleHoverProcessed(object)
    // clear hover for other pages
    for (const page of this.pages) {
      if (page !== this.currentPage) {
        page.clearHover()
      }
    }
  }

  handleSelectionProcessed({ object, pageIndex }: SelectionProcessedEvent) {
    this.currentPage = this.pages[pageIndex]
    this.currentPage.handleSelectionProcessed(object)
    // clear selection for other pages
    for (const page of this.pages) {
      if (page !== this.currentPage) {
        page.clearSelection()
      }
    }
  }

  init() {
    this.isInitialized = true

    this.scoreStorm.setInteractionEventListener(InteractionEventType.HOVER_PROCESSED, this.handleHoverProcessed)
    this.scoreStorm.setInteractionEventListener(InteractionEventType.SELECTION_PROCESSED, this.handleSelectionProcessed)
  }

  destroy() {
    this.clear()
    this.scoreStorm.removeInteractionEventListener(
      InteractionEventType.SELECTION_PROCESSED,
      this.handleSelectionProcessed,
    )
    this.scoreStorm.removeInteractionEventListener(InteractionEventType.HOVER_PROCESSED, this.handleHoverProcessed)

    this.isInitialized = false
  }

  createPage(parameters: PageParameters) {
    const page = new Page(this, this.pages.length)
    this.containerElement.appendChild(page.pageElement)
    page.setup(parameters)
    this.pages.push(page)
    this.currentPage = page
  }

  clear() {
    for (const page of this.pages) {
      this.containerElement.removeChild(page.pageElement)
    }
    this.currentPage = null
    this.pages = []
  }

  postRender(): void {}

  getCurrentLayer() {
    return this.currentPage!.currentLayer
  }

  setColor(color: string) {
    this.getCurrentLayer().context.fillStyle = color
  }

  getColor(): string {
    return this.getCurrentLayer().context.fillStyle as string
  }

  drawRect(x: number, y: number, width: number, height: number) {
    const currentLayer = this.getCurrentLayer()

    currentLayer.context.beginPath()
    currentLayer.context.moveTo(x, y)
    currentLayer.context.lineTo(x + width, y)
    currentLayer.context.lineTo(x + width, y + height)
    currentLayer.context.lineTo(x, y + height)
    currentLayer.context.lineTo(x, y)
    currentLayer.context.fill()
    // this.currentContext.fillRect(x, y, width, height)
    // this.currentContext.rect(x, y, width, height)
  }

  drawGlyph(glyph: string, x: number, y: number) {
    this.getCurrentLayer().context.fillText(glyph, x, y)
  }

  renderInGroup(_: IGraphical, renderCallback: () => void) {
    renderCallback()
  }
}

export default CanvasRenderer
