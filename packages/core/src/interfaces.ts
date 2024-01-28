import { RenderParams, Score } from "."

export interface Renderer {
  render(score: Score, params: RenderParams): void
}
