import ScoreStorm, { IRenderer, IGraphical } from "@score-storm/core"
import { Canvas, createCanvas, SKRSContext2D, GlobalFonts, SvgExportFlag, SvgCanvas } from "@napi-rs/canvas"

type Options = {
  width: number
  svgExportFlag?: SvgExportFlag
}

type CanvasOrSvgCanvas<T extends Options> = T["svgExportFlag"] extends SvgExportFlag ? SvgCanvas : Canvas

class NodeSkiaRenderer<T extends Options> implements IRenderer {
  scoreStorm!: ScoreStorm
  containerWidth: number
  canvas!: CanvasOrSvgCanvas<T>
  context!: SKRSContext2D
  isInitialized: boolean = false
  svgExportFlag?: SvgExportFlag

  constructor(opts: T) {
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

  preRender(height: number, fontSize: number, width: number) {
    if (this.svgExportFlag) {
      this.canvas = createCanvas(width, height, this.svgExportFlag) as CanvasOrSvgCanvas<T>
    } else {
      this.canvas = createCanvas(width, height) as CanvasOrSvgCanvas<T>
    }
    this.context = this.canvas.getContext("2d")

    this.context.font = `${fontSize}px Bravura`
    this.context.textBaseline = "alphabetic" // middle
    this.context.textAlign = "start"

    // create white background
    this.setColor("white")
    this.drawRect(0, 0, width, height)
  }

  clear() {}

  postRender(): void {}

  setColor(color: string) {
    this.context.fillStyle = color
  }

  getColor(): string {
    return this.context.fillStyle as string
  }

  drawRect(x: number, y: number, width: number, height: number) {
    this.context.fillRect(x, y, width, height)
  }

  drawGlyph(glyph: string, x: number, y: number) {
    this.context.fillText(glyph, x, y)
  }

  renderInGroup(_: IGraphical, renderCallback: () => void) {
    renderCallback()
  }
}

export default NodeSkiaRenderer
export { GlobalFonts, SvgExportFlag }
