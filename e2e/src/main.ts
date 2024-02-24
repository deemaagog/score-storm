import "./style.css"
import ScoreStorm, { Score } from "@score-storm/core"
import SvgRenderer from "@score-storm/svg-renderer"
import CanvasRenderer from "@score-storm/canvas-renderer"

const containerEl = document.querySelector<HTMLDivElement>("#ss-container")!
window.svgRenderer = new SvgRenderer(containerEl)
window.canvasRenderer = new CanvasRenderer(containerEl)
window.scoreStorm = new ScoreStorm()
window.getScoreFormMusicXml = function (xml) {
  return Score.fromMusicXML(xml)
}
