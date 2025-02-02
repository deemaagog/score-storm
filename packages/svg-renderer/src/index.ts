import ScoreStorm, { EventType, IRenderer, SelectionProcessedEvent } from "@score-storm/core"
import { IGraphical } from "@score-storm/core"

const NS = "http://www.w3.org/2000/svg"

class SvgRenderer implements IRenderer {
  scoreStorm!: ScoreStorm
  containerElement: HTMLDivElement
  containerWidth: number
  svgElement!: SVGElement
  currentColor: string
  resizeObserver: ResizeObserver
  isInitialized: boolean = false
  openedGroup: SVGGElement | null = null
  elementByObject: Map<IGraphical, SVGElement> = new Map()

  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement
    this.containerWidth = this.containerElement.clientWidth
    this.currentColor = "black"

    // make this and destroy method part of BrowserRenderer?
    this.resizeObserver = new ResizeObserver((entries) => {
      this.containerWidth = entries[0].contentRect.width
    })
    this.resizeObserver.observe(this.containerElement)

    this.handleSelectionProcessed = this.handleSelectionProcessed.bind(this)
  }

  init() {
    this.svgElement = document.createElementNS(NS, "svg")
    this.containerElement.appendChild(this.svgElement)
    this.isInitialized = true

    this.svgElement.addEventListener("click", (event: MouseEvent) => {
      let rect = this.svgElement.getBoundingClientRect() // TODO: make it a class member and update on resize
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top

      this.scoreStorm.eventManager.dispatch(EventType.SELECTION_ENDED, { x, y })
    })

    this.scoreStorm.eventManager.on(EventType.SELECTION_PROCESSED, this.handleSelectionProcessed)
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
    this.containerElement.innerHTML = ""
    this.isInitialized = false
    this.resizeObserver.unobserve(this.containerElement)
  }

  preRender(height: number, fontSize: number) {
    this.svgElement.setAttribute("viewBox", `0 0 ${this.containerWidth} ${height}`)
    this.svgElement.setAttribute("width", `${this.containerWidth}`)
    this.svgElement.setAttribute("height", `${height}`)

    // https://developer.mozilla.org/en-US/docs/Web/API/SVGStyleElement
    // TODO: override styles instead of recreating
    const style = document.createElementNS(NS, "style")
    const node = document.createTextNode(`
      .glyph { 
        font-size: ${fontSize}px;
        font-family: Bravura;
        dominant-baseline: alphabetic;
        text-anchor: start;
        user-select: none;
      }
      .clickable:hover {
        fill: ${this.scoreStorm.settings.editor!.styles.hoverColor};
        transition: fill 0.1s;
        cursor: pointer;
      }
      .selected {
        fill: ${this.scoreStorm.settings.editor!.styles.selectColor} !important;
        transition: fill 0.1s;
      }
    `)
    style.appendChild(node)
    this.svgElement.appendChild(style)
  }

  clear() {
    this.svgElement.innerHTML = ""
    this.elementByObject.clear()
  }

  postRender(): void {}

  setColor(color: string) {
    this.currentColor = color
  }

  drawRect(x: number, y: number, width: number, height: number) {
    const rec = document.createElementNS(NS, "rect")
    rec.setAttribute("x", `${x}`)
    rec.setAttribute("y", `${y}`)
    rec.setAttribute("width", `${width}`)
    rec.setAttribute("height", `${height}`)
    rec.setAttribute("fill", this.currentColor)
    this.svgElement.appendChild(rec)
  }

  drawGlyph(glyph: string, x: number, y: number) {
    const text = document.createElementNS(NS, "text")
    text.setAttributeNS(null, "x", `${x}`)
    text.setAttributeNS(null, "y", `${y}`)
    text.setAttributeNS(null, "class", "glyph")
    text.textContent = glyph
    const parent = this.openedGroup || this.svgElement
    parent.appendChild(text)
  }

  renderInGroup(graphicalObject: IGraphical, renderCallback: () => void): void {
    const group = document.createElementNS(NS, "g")
    // group.setAttributeNS(null, "id", graphicalObject.id)
    group.setAttributeNS(null, "class", "clickable")
    this.svgElement.appendChild(group)
    this.openedGroup = group
    renderCallback()
    this.openedGroup = null
    this.elementByObject.set(graphicalObject, group)
  }
}

export default SvgRenderer
