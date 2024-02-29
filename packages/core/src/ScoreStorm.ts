import BaseRenderer from "./BaseRenderer"
import { GraphicalScore } from "./graphical/GraphicalScore"
import { Renderer } from "./interfaces"
import { Score } from "./model/Score"
export { Score, type Renderer, GraphicalScore }

export interface ScoreStormOptions {
  scale: number
}

/**
 * The main entrypoint
 */
export class ScoreStorm {
  private score: Score
  private baseRenderer: BaseRenderer

  constructor(options?: ScoreStormOptions) {
    this.score = Score.createDefaultScore()
    this.baseRenderer = new BaseRenderer(options)
  }

  setScore(score: Score) {
    this.score = score
  }

  getScore() {
    return this.score
  }

  setRenderer(renderer: Renderer) {
    this.baseRenderer.setRenderer(renderer)
  }

  render() {
    this.baseRenderer.render(this.score)
  }
}
