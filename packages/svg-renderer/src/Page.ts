import { InteractionEventType, PageParameters } from "@score-storm/core"
import SvgRenderer from "."

export const NS = "http://www.w3.org/2000/svg"

export class Page {
  svgElement!: SVGElement
  renderer: SvgRenderer
  index: number

  constructor(renderer: SvgRenderer, index: number) {
    this.renderer = renderer
    this.index = index
  }

  setup(parameters: PageParameters) {
    this.svgElement = document.createElementNS(NS, "svg")
    const { height, fontSize, width } = parameters
    this.svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`)
    this.svgElement.setAttribute("width", `${width}`)
    this.svgElement.setAttribute("height", `${height}`)
    this.svgElement.setAttribute("class", "ss-page")

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
        fill: ${this.renderer.scoreStorm.settings.editor!.styles.hoverColor};
        transition: fill 0.1s;
        cursor: pointer;
      }
      .selected {
        fill: ${this.renderer.scoreStorm.settings.editor!.styles.selectColor} !important;
        transition: fill 0.1s;
      }
    `)
    style.appendChild(node)
    this.svgElement.appendChild(style)

    this.svgElement.addEventListener("click", (event: MouseEvent) => {
      let rect = this.svgElement.getBoundingClientRect() // TODO: make it a class member and update on resize
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top

      this.renderer.scoreStorm.dispatchInteractionEvent(InteractionEventType.SELECTION_ENDED, {
        x,
        y,
        pageIndex: this.index,
      })
    })
  }
}
