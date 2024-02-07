import BaseRenderer from "./BaseRenderer"
import { GraphicalScore } from "./GraphicalScore"
import { Renderer } from "./interfaces"
import { Score } from "./Score"
export { Score, Renderer, GraphicalScore }

export interface ScoreStormOptions {
  scale: number
}

/**
 * The main entrypoint
 */
class ScoreStorm {
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

export default ScoreStorm
