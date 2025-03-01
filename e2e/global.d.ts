import ScoreStorm, { Score } from "@score-storm/core"
import SvgRenderer from "@score-storm/svg-renderer"
import CanvasRenderer from "@score-storm/canvas-renderer"

declare global {
  interface Window {
    scoreStorm: ScoreStorm
    svgRenderer: SvgRenderer
    canvasRenderer: CanvasRenderer
    getScoreFormMusicXml: (xml: string) => Score
    addMeasure: () => void
    getDefaultScore: () => void
  }
}
