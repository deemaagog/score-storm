import { Canvas, createCanvas, SKRSContext2D, SvgCanvas, SvgExportFlag } from "@napi-rs/canvas"
import { PageParameters } from "@score-storm/core"

export type SvgFlagOrUndefined = SvgExportFlag | undefined
type CanvasType<TSvgFlag extends SvgFlagOrUndefined = undefined> = TSvgFlag extends SvgExportFlag ? SvgCanvas : Canvas

export class Page<TSvgFlag extends SvgFlagOrUndefined = undefined> {
  context!: SKRSContext2D
  canvas: CanvasType<TSvgFlag>

  constructor(svgExportFlag?: TSvgFlag) {
    if (svgExportFlag) {
      this.canvas = createCanvas(0, 0, svgExportFlag) as CanvasType<TSvgFlag>
    } else {
      this.canvas = createCanvas(0, 0) as CanvasType<TSvgFlag>
    }
  }

  setup(parameters: PageParameters) {
    const { height, fontSize, width } = parameters
    this.canvas.height = height
    this.canvas.width = width
    this.context = this.canvas.getContext("2d")

    this.context.font = `${fontSize}px Bravura`
    this.context.textBaseline = "alphabetic" // middle
    this.context.textAlign = "start"
  }
}
