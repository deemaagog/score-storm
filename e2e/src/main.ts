import "./style.css"
import ScoreStorm, { Score, AddMeasureCommand, PageLayout } from "@score-storm/core"
import SvgRenderer from "@score-storm/svg-renderer"
import CanvasRenderer from "@score-storm/canvas-renderer"
import { fromMusicXML } from "@score-storm/musicxml-importer"

const containerEl = document.querySelector<HTMLDivElement>("#ss-container")!
window.svgRenderer = new SvgRenderer(containerEl)
window.canvasRenderer = new CanvasRenderer(containerEl)
window.scoreStorm = new ScoreStorm()
window.getScoreFormMusicXml = function (xml) {
  return fromMusicXML(xml)
}
window.getDefaultScore = function (numberOfMeasures?: number) {
  return numberOfMeasures ? Score.createQuickScore({ numberOfMeasures }) : Score.createQuickScore()
}
window.addMeasure = function () {
  window.scoreStorm.executeCommand(new AddMeasureCommand())
}
window.setPageLayout = function () {
  window.scoreStorm.setLayout(new PageLayout())
}
