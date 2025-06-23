import ScoreStorm, { InteractionEventType, IRenderer, SelectionProcessedEvent, PageParameters } from "@score-storm/core"
import { IGraphical } from "@score-storm/core"
import { NS, Page } from "./Page"

class SvgRenderer implements IRenderer {
  scoreStorm!: ScoreStorm
  containerElement: HTMLDivElement

  currentColor: string
  isInitialized: boolean = false
  openedGroup: SVGGElement | null = null
  elementByObject: Map<IGraphical, SVGElement> = new Map()

  pages: Page[] = []
  currentPage: Page | null = null

  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement
    this.currentColor = "black"

    this.handleSelectionProcessed = this.handleSelectionProcessed.bind(this)
  }

  getContainerWidth() {
    return this.containerElement.clientWidth
  }

  init() {
    this.isInitialized = true

    // TODO: unsubscribe
    this.scoreStorm.setInteractionEventListener(InteractionEventType.SELECTION_PROCESSED, this.handleSelectionProcessed)
  }

  handleSelectionProcessed({ object }: SelectionProcessedEvent) {
    const selectedElements = document.querySelectorAll(".selected")
    for (let element of selectedElements) {
      element.classList.remove("selected")
    }
    if (object) {
      const element = this.elementByObject.get(object)
      if (element) {
        element.classList.add("selected")
      }
    }
  }

  destroy() {
    for (const page of this.pages) {
      this.containerElement.removeChild(page.svgElement)
    }
    this.scoreStorm.removeInteractionEventListener(
      InteractionEventType.SELECTION_PROCESSED,
      this.handleSelectionProcessed,
    )
    this.isInitialized = false
  }

  createPage(parameters: PageParameters) {
    const page = new Page(this, this.pages.length)
    page.setup(parameters)
    this.containerElement.appendChild(page.svgElement)
    this.pages.push(page)
    this.currentPage = page
  }

  clear() {
    for (const page of this.pages) {
      this.containerElement.removeChild(page.svgElement)
    }
    this.currentPage = null
    this.pages = []
    this.elementByObject.clear()
  }

  postRender(): void {}

  setColor(color: string) {
    this.currentColor = color
  }

  getColor(): string {
    return this.currentColor
  }

  drawRect(x: number, y: number, width: number, height: number) {
    const rec = document.createElementNS(NS, "rect")
    rec.setAttribute("x", `${x}`)
    rec.setAttribute("y", `${y}`)
    rec.setAttribute("width", `${width}`)
    rec.setAttribute("height", `${height}`)
    rec.setAttribute("fill", this.currentColor)
    this.currentPage!.svgElement.appendChild(rec)
  }

  drawGlyph(glyph: string, x: number, y: number) {
    const text = document.createElementNS(NS, "text")
    text.setAttributeNS(null, "x", `${x}`)
    text.setAttributeNS(null, "y", `${y}`)
    text.setAttributeNS(null, "class", "glyph")
    text.textContent = glyph
    const parent = this.openedGroup || this.currentPage!.svgElement
    parent.appendChild(text)
  }

  renderInGroup(graphicalObject: IGraphical, renderCallback: () => void): void {
    const group = document.createElementNS(NS, "g")
    // group.setAttributeNS(null, "id", graphicalObject.id)
    group.setAttributeNS(null, "class", "clickable")
    this.currentPage!.svgElement.appendChild(group)
    this.openedGroup = group
    renderCallback()
    this.openedGroup = null
    this.elementByObject.set(graphicalObject, group)
  }
}

export default SvgRenderer
