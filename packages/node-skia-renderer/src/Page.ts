import { Canvas, createCanvas, SKRSContext2D, SvgCanvas, SvgExportFlag } from "@napi-rs/canvas"

type CanvasOrSvgCanvas = SvgCanvas | Canvas

export class Page {
  context!: SKRSContext2D
  canvas: CanvasOrSvgCanvas

  constructor(width: number, height: number, svgExportFlag?: SvgExportFlag) {
    if (svgExportFlag) {
      this.canvas = createCanvas(width, height, svgExportFlag) as CanvasOrSvgCanvas
    } else {
      this.canvas = createCanvas(width, height) as CanvasOrSvgCanvas
    }
  }

  setup(fontSize: number) {
    // TODO: upgrade @napi-rs/canvas to be able to set dimensions after creation
    this.context = this.canvas.getContext("2d")

    this.context.font = `${fontSize}px Bravura`
    this.context.textBaseline = "alphabetic" // middle
    this.context.textAlign = "start"
  }
}
