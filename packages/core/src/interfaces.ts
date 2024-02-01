import { RenderParams } from "."
import { GraphicalScore } from "./GraphicalScore"

export interface Renderer {
  render(score: GraphicalScore, params: RenderParams): void
  containerWidth: number
}
