import ScoreStorm, { IRenderer, IGraphical } from "@score-storm/core"
import { GlobalFonts, SvgExportFlag } from "@napi-rs/canvas"
import { Page } from "./Page"

type Options = {
  width: number
  svgExportFlag?: SvgExportFlag
}

class NodeSkiaRenderer<T extends Options> implements IRenderer {
  scoreStorm!: ScoreStorm
  containerWidth: number
  pages: Page[] = []
  // context!: SKRSContext2D
  isInitialized: boolean = false
  svgExportFlag?: SvgExportFlag
  currentPage: Page | null = null

  constructor(opts: T) {
    this.containerWidth = opts.width
    this.svgExportFlag = opts.svgExportFlag
  }

  init() {
    this.isInitialized = true
  }

  destroy() {
    this.isInitialized = false
  }

  createPage(height: number, fontSize: number) {
    const page = new Page(this.containerWidth, height, this.svgExportFlag)
    page.setup(fontSize)
    this.pages.push(page)
    this.currentPage = page

    // create white background
    this.setColor("white")
    this.drawRect(0, 0, this.containerWidth, height)
  }

  clear() {}

  postRender(): void {}

  setColor(color: string) {
    this.currentPage!.context.fillStyle = color
  }

  getColor(): string {
    return this.currentPage!.context.fillStyle as string
  }

  drawRect(x: number, y: number, width: number, height: number) {
    this.currentPage!.context.fillRect(x, y, width, height)
  }

  drawGlyph(glyph: string, x: number, y: number) {
    this.currentPage!.context.fillText(glyph, x, y)
  }

  renderInGroup(_: IGraphical, renderCallback: () => void) {
    renderCallback()
  }
}

export default NodeSkiaRenderer
export { GlobalFonts, SvgExportFlag }
