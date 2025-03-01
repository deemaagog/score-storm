import "./style.css"
import ScoreStorm, { Score } from "@score-storm/core"
import SvgRenderer from "@score-storm/svg-renderer"
import CanvasRenderer from "@score-storm/canvas-renderer"
import { AddMeasureCommand } from "@score-storm/core"

const containerEl = document.querySelector<HTMLDivElement>("#ss-container")!
window.svgRenderer = new SvgRenderer(containerEl)
window.canvasRenderer = new CanvasRenderer(containerEl)
window.scoreStorm = new ScoreStorm()
window.getScoreFormMusicXml = function (xml) {
  return Score.fromMusicXML(xml)
}
window.getDefaultScore = function () {
  return Score.createQuickScore()
}
window.addMeasure = function () {
  window.scoreStorm.executeCommand(new AddMeasureCommand())
}
