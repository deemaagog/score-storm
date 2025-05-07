import ScoreStorm, {
  EventType,
  HoverProcessedEvent,
  IRenderer,
  SelectionProcessedEvent,
  IGraphical,
} from "@score-storm/core"
import { Page } from "./Page"

class CanvasRenderer implements IRenderer {
  containerElement: HTMLDivElement
  containerWidth: number

  isInitialized: boolean = false

  scoreStorm!: ScoreStorm

  pages: Page[] = []
  currentPage: Page | null = null

  testDee: Page[] = []

  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement
    this.containerWidth = this.containerElement.clientWidth

    this.handleHoverProcessed = this.handleHoverProcessed.bind(this)
    this.handleSelectionProcessed = this.handleSelectionProcessed.bind(this)
  }

  handleHoverProcessed(event: HoverProcessedEvent) {
    // console.log("event", this, event)
    // console.log("eventManager", this.scoreStorm.eventManager)
    this.currentPage = this.pages[event.pageIndex]
    this.pages[event.pageIndex].handleHoverProcessed(event)
  }

  handleSelectionProcessed(event: SelectionProcessedEvent) {
    console.log("handleSelectionProcessed", this)
    this.currentPage = this.pages[event.pageIndex]
    this.pages[event.pageIndex].handleSelectionProcessed(event)
  }

  init() {
    // const containerPosition = getComputedStyle(this.containerElement).position
    // if (containerPosition !== "relative") {
    //   this.containerElement.style.setProperty("position", "relative")
    // }
    this.scoreStorm.eventManager.on(EventType.HOVER_PROCESSED, this.handleHoverProcessed)
    this.scoreStorm.eventManager.on(EventType.SELECTION_PROCESSED, this.handleSelectionProcessed)
    this.isInitialized = true
  }

  destroy() {
    this.clear()
    this.isInitialized = false
  }

  createPage(height: number, fontSize: number, pageIndex: number) {
    const page = new Page(this, pageIndex)
    this.containerElement.appendChild(page.pageElement)

    page.setup(this.containerWidth, height, fontSize)

    this.currentPage = page
    this.pages.push(page)
    console.log("page created", this.pages)
  }

  clear() {
    console.log("clearing...", this.pages)
    for (const page of this.pages) {
      this.containerElement.removeChild(page.pageElement)
    }
    this.currentPage = null
    this.pages = []
  }

  postRender(): void {}

  setColor(color: string) {
    this.currentPage!.currentLayer.context.fillStyle = color
  }

  getColor(): string {
    return this.currentPage!.currentLayer.context.fillStyle as string
  }

  drawRect(x: number, y: number, width: number, height: number) {
    // this.currentContext.fillRect(x, y, width, height)

    this.currentPage!.currentLayer.context.beginPath()
    // this.currentContext.rect(x, y, width, height)
    this.currentPage!.currentLayer.context.moveTo(x, y)
    this.currentPage!.currentLayer.context.lineTo(x + width, y)
    this.currentPage!.currentLayer.context.lineTo(x + width, y + height)
    this.currentPage!.currentLayer.context.lineTo(x, y + height)
    this.currentPage!.currentLayer.context.lineTo(x, y)
    this.currentPage!.currentLayer.context.fill()
  }

  drawGlyph(glyph: string, x: number, y: number) {
    this.currentPage!.currentLayer.context.fillText(glyph, x, y)
  }

  renderInGroup(_: IGraphical, renderCallback: () => void) {
    renderCallback()
  }
}

export default CanvasRenderer
