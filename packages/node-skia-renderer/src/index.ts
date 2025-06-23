import ScoreStorm, { IRenderer, IGraphical, PageParameters } from "@score-storm/core"
import { GlobalFonts, SvgExportFlag } from "@napi-rs/canvas"
import { Page, SvgFlagOrUndefined } from "./Page"

type NodeSkiaRendererOptions<TSvgFlag extends SvgFlagOrUndefined = undefined> = {
  width: number
  svgExportFlag?: TSvgFlag
}

export class NodeSkiaRenderer<TSvgFlag extends SvgFlagOrUndefined = undefined> implements IRenderer {
  scoreStorm!: ScoreStorm
  containerWidth: number
  isInitialized: boolean = false
  svgExportFlag?: TSvgFlag
  pages: Page<TSvgFlag>[] = []
  currentPage: Page<TSvgFlag> | null = null

  constructor(opts: NodeSkiaRendererOptions<TSvgFlag>) {
    this.containerWidth = opts.width
    this.svgExportFlag = opts.svgExportFlag
  }

  getContainerWidth() {
    return this.containerWidth
  }

  init() {
    this.isInitialized = true
  }

  destroy() {
    this.isInitialized = false
  }

  createPage(parameters: PageParameters) {
    const page = new Page<TSvgFlag>(this.svgExportFlag)
    page.setup(parameters)
    this.pages.push(page)
    this.currentPage = page

    // // create white background
    this.setColor("white")
    this.drawRect(0, 0, parameters.width, parameters.height)
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
