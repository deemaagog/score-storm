import { Score } from "./model/Score"
import { IRenderer } from "./interfaces"
import { ScoreStormSettings } from "./ScoreStorm"
import { GraphicalScore } from "./graphical/GraphicalScore"
import { GraphicalMeasure } from "./graphical/GraphicalMeasure"
import { BBox, IGraphical } from "./graphical/interfaces"
import { EventManager } from "./EventManager"
import { BaseEditor } from "./BaseEditor"

export type Settings = {
  fontSize: number
  unit: number
  numberOfStaffLines: number
  staffLineThickness: number
  clefMargin: number
  timeSignatureMargin: number
  contentMargin: number // distanse between barline (or clef, or time signaure and first note)
  barLineThickness: number
  barlineHeight: number
  midStave: number
  mainColor: string
  staveLineColor: string
} & Pick<ScoreStormSettings, "debug" | "editor">

const SCALE_TO_FONT_RATIO = 64 / 100
const NUMBER_OF_STAFF_LINES = 5 // hardcode for now

/**
 * Main class responsible for rendering music score.
 */
class BaseRenderer {
  private settings!: Settings
  private eventManager!: EventManager
  private renderer!: IRenderer
  private graphicalScore!: GraphicalScore
  private x: number = 0
  private y: number = 0
  private baseEditor: BaseEditor

  constructor(eventManager: EventManager, options?: ScoreStormSettings) {
    this.baseEditor = new BaseEditor(eventManager)

    this.eventManager = eventManager
    this.setSettings(options)
  }

  setSettings(options?: ScoreStormSettings) {
    const { scale = 100, editor, ...rest } = options || {}
    const fontSize = scale * SCALE_TO_FONT_RATIO
    const unit = fontSize / 4
    const staffLineThickness = unit / 8
    const barlineHeight = unit * 4 + staffLineThickness

    this.settings = {
      fontSize,
      unit,
      numberOfStaffLines: NUMBER_OF_STAFF_LINES,
      staffLineThickness,
      clefMargin: 1,
      timeSignatureMargin: 1,
      contentMargin: 2,
      barLineThickness: staffLineThickness * 1.2,
      mainColor: "black",
      staveLineColor: "#666666",
      barlineHeight,
      midStave: barlineHeight / 2,
      // default editor settings
      editor: {
        enable: false,
        styles: {
          hoverColor: "royalblue",
          selectColor: "green",
        },
        ...editor,
      },
      ...rest,
    }
  }

  setRenderer(renderer: IRenderer) {
    if (this.renderer) {
      // eslint-disable-next-line no-console
      console.log("destroying...")
      this.renderer.destroy()
      // this.eventManager.clear()
    }
    this.renderer = renderer

    // TODO: make settings singleton or use dependency injection
    this.renderer.settings = this.settings
    this.renderer.eventManager = this.eventManager
  }

  destroy() {
    if (this.renderer) {
      this.renderer.destroy()
    }
  }

  render(score: Score) {
    // eslint-disable-next-line no-console
    console.log("rendering...")
    if (!this.renderer) {
      throw new Error("Renderer is not set!")
    }

    if (!this.renderer.isInitialized) {
      // eslint-disable-next-line no-console
      console.log("initializing...")
      this.renderer.init()
    }

    this.graphicalScore = new GraphicalScore(score, this.renderer.containerWidth, this.settings)

    // clear
    this.baseEditor.clear()
    this.renderer.clear()
    // set sizes and other stuff
    this.renderer.preRender(this.graphicalScore.height, this.settings.fontSize)
    // loop through measures and draw
    this.renderScore()
    // do some stuff when socre is rendered
    this.renderer.postRender()
    this.baseEditor.restoreSelection()
  }

  renderScore() {
    this.x = 0
    this.y = 0

    for (let ri = 0; ri < this.graphicalScore.rows.length; ri++) {
      const latestRow = ri === this.graphicalScore.rows.length - 1
      const row = this.graphicalScore.rows[ri]
      this.y = row.yPosition

      for (let mi = 0; mi < row.measures.length; mi++) {
        const latestMeasureInRow = mi === row.measures.length - 1
        const graphicalMeasure = row.measures[mi]
        this.renderMeasure(graphicalMeasure, latestRow, latestMeasureInRow)
      }
      this.x = 0
    }
  }

  renderMeasure(graphicalMeasure: GraphicalMeasure, latestRow: boolean, latestMeasureInRow: boolean) {
    // draw staff lines

    this.renderStaveLines(graphicalMeasure)

    // draw start bar line
    this.renderer.setColor(this.settings.mainColor)
    this.renderer.drawRect(this.x, this.y, this.settings.barLineThickness, this.settings.barlineHeight)

    this.renderMeasureContent(graphicalMeasure)

    this.x += graphicalMeasure.width
    // draw end barline
    if (latestMeasureInRow) {
      if (latestRow) {
        this.renderer.drawRect(
          this.x - this.settings.unit,
          this.y,
          this.settings.barLineThickness,
          this.settings.barlineHeight,
        )
        this.renderer.drawRect(
          this.x - this.settings.barLineThickness * 3.8,
          this.y,
          this.settings.barLineThickness * 3.8,
          this.settings.barlineHeight,
        )
      } else {
        this.renderer.drawRect(
          this.x - this.settings.barLineThickness,
          this.y,
          this.settings.barLineThickness,
          this.settings.barlineHeight,
        )
      }
    }
  }

  renderStaveLines(graphicalMeasure: GraphicalMeasure) {
    this.renderer.setColor(this.settings.staveLineColor)
    const half = Math.floor(this.settings.numberOfStaffLines / 2)
    for (let index = -half; index <= half; index++) {
      this.renderer.drawRect(
        this.x,
        this.y + this.settings.midStave + this.settings.unit * index - this.settings.staffLineThickness / 2,
        graphicalMeasure.width,
        this.settings.staffLineThickness,
      )
    }
  }

  renderBBox(bBox: BBox) {
    if (this.settings.debug?.bBoxes) {
      this.renderer.setColor("#ff8a8a80")
      this.renderer.drawRect(bBox.x, bBox.y, bBox.width, bBox.height)
      this.renderer.setColor("black")
    }
  }

  renderMeasureContent(graphicalMeasure: GraphicalMeasure) {
    //  draw measure content
    // temporarily do horizontal positioning here, but ultimately this should be done in GraphicalMeasure
    let measureX = this.x
    if (graphicalMeasure.clef) {
      measureX += this.settings.unit * this.settings.clefMargin
      graphicalMeasure.clef.setCoordinates(measureX, this.y + this.settings.midStave, this.settings)
      const bBox = graphicalMeasure.clef.getBBox(this.settings)
      this.renderInteractiveObject(graphicalMeasure.clef.clef, graphicalMeasure.clef, bBox)
      this.renderBBox(bBox)
      measureX += this.settings.unit * graphicalMeasure.clef.width
    }

    if (graphicalMeasure.time) {
      measureX += this.settings.unit * this.settings.timeSignatureMargin
      graphicalMeasure.time.setCoordinates(measureX, this.y + this.settings.midStave)
      const bBox = graphicalMeasure.time.getBBox(this.settings)
      this.renderInteractiveObject(graphicalMeasure.time.time, graphicalMeasure.time, bBox)
      this.renderBBox(bBox)
      measureX += this.settings.unit * graphicalMeasure.time.width
    }

    measureX += this.settings.unit * this.settings.contentMargin
    const availableWidth = graphicalMeasure.width - (measureX - this.x)
    for (let i = 0; i < graphicalMeasure.events.length; i++) {
      const event = graphicalMeasure.events[i]
      event.setCoordinates(
        measureX + (availableWidth * i) / graphicalMeasure.events.length,
        this.y + this.settings.midStave,
        this.settings,
      )
      const bBox = event.getBBox(this.settings)
      this.renderInteractiveObject(event.noteEvent, event, bBox)
      this.renderBBox(bBox)
    }

    // content bbox
    // this.renderer.setColor("#ff8a8a80")
    // this.renderer.drawRect(measureX, this.y, graphicalMeasure.width - (measureX - this.x), this.settings.barlineHeight)
    // this.renderer.setColor("black")
  }

  renderInteractiveObject(object: object, grahicalObject: IGraphical, bBox: BBox) {
    this.baseEditor.registerInteractionArea(object, grahicalObject, bBox)
    this.renderer.renderInGroup(grahicalObject, () => grahicalObject.render(this.renderer, this.settings))
  }
}

export default BaseRenderer
