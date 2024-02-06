import { Renderer } from "@score-storm/core"

const NS = "http://www.w3.org/2000/svg"

class SvgRenderer implements Renderer {
  containerElement: HTMLDivElement
  containerWidth: number
  svgElement: SVGElement
  currentColor: string

  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement
    this.containerWidth = this.containerElement.clientWidth
    this.svgElement = document.createElementNS(NS, "svg")
    this.containerElement.appendChild(this.svgElement)

    this.currentColor = "black"

    this.setupResizeObserver()
  }

  setupResizeObserver() {
    new ResizeObserver((entries) => {
      this.containerWidth = entries[0].contentRect.width
    }).observe(this.containerElement) // todo: unobserve?
  }

  prepare(height: number, fontSize: number) {
    this.svgElement.setAttribute("viewBox", `0 0 ${this.containerWidth} ${height}`)
    this.svgElement.setAttribute("width", `${this.containerWidth}`)
    this.svgElement.setAttribute("height", `${height}`)

    // https://developer.mozilla.org/en-US/docs/Web/API/SVGStyleElement
    // TODO: override styles instead of recreating
    const style = document.createElementNS(NS, "style")
    const node = document.createTextNode(`.glyph { 
      font-size: ${fontSize}px;
      font-family: Bravura;
      dominant-baseline: alphabetic;
      text-anchor: start;
    }`)
    style.appendChild(node)
    this.svgElement.appendChild(style)
  }

  clear() {
    this.svgElement.innerHTML = ""
  }

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
    this.svgElement.appendChild(text)
  }
}

export default SvgRenderer
