import { IRenderer } from "./interfaces"
import { ScoreStorm } from "./ScoreStorm"
import { BBox, IGraphical } from "./graphical/interfaces"
import { EditorManager } from "./EditorManager"
import { Measure } from "./model/Measure"
import { GlobalMeasure } from "./model"
import { FlowLayout, ILayout } from "./layouts"
import { Page } from "./graphical/GraphicalScore"

/**
 * Main class responsible for rendering music score.
 */
class RenderManager {
  scoreStorm: ScoreStorm
  private renderer!: IRenderer
  private editorManager: EditorManager
  private layout!: ILayout
  private x: number = 0
  private y: number = 0
  private currentPageIndex: number = 0

  constructor(scoreStorm: ScoreStorm) {
    this.scoreStorm = scoreStorm
    this.editorManager = new EditorManager()
    this.layout = new FlowLayout()
  }

  setRenderer(renderer: IRenderer) {
    if (this.renderer) {
      // eslint-disable-next-line no-console
      console.log("destroying...")
      this.renderer.destroy()
      // this.eventManager.clear()
    }
    this.renderer = renderer

    // inject scoreStorm into renderer. TODO: Investigate if this is the best way to do this
    this.renderer.scoreStorm = this.scoreStorm
  }

  getRenderer() {
    return this.renderer
  }

  destroy() {
    if (this.renderer) {
      this.renderer.destroy()
    }
  }

  setLayout(layout: ILayout) {
    this.layout = layout
  }

  getLayout(): ILayout {
    return this.layout
  }

  setInteractionEventListener(...args: Parameters<typeof this.editorManager.interactionEventManager.on>) {
    this.editorManager.interactionEventManager.on(...args)
  }

  dispatchInteractionEvent(...args: Parameters<typeof this.editorManager.interactionEventManager.dispatch>) {
    this.editorManager.interactionEventManager.dispatch(...args)
  }

  render() {
    // eslint-disable-next-line no-console
    console.log("rendering...")

    const score = this.scoreStorm.getScore()

    if (!score) {
      throw new Error("Score is not set!")
    }

    if (!this.renderer) {
      throw new Error("Renderer is not set!")
    }

    if (!this.layout) {
      throw new Error("Layout is not set!")
    }

    if (!this.renderer.isInitialized) {
      // eslint-disable-next-line no-console
      console.log("initializing...")
      this.renderer.init()
    }

    const pageDimensions = this.scoreStorm.getLayout().getPageDimensions(this.renderer.getContainerWidth())
    const rows = score.graphical.calculateLineBreaks(pageDimensions.width)
    // TODO: handle errors
    score.graphical.calculatePageBreaks(rows, this.scoreStorm.settings, pageDimensions.height)

    // clear
    this.editorManager.clear()
    this.renderer.clear()

    for (let i = 0; i < score.graphical.pages.length; i++) {
      const page = score.graphical.pages[i]
      const isLastPage = i === score.graphical.pages.length - 1
      this.x = 0
      this.y = 0
      this.currentPageIndex = i
      // set sizes and other stuff
      this.renderer.createPage({
        height: page.height,
        fontSize: this.scoreStorm.settings.fontSize,
        width: pageDimensions.width,
      })
      // loop through measures and draw
      this.renderPage(page, isLastPage)
    }

    // do some stuff when score is rendered
    this.renderer.postRender()
    this.editorManager.restoreSelection()
  }

  renderPage(page: Page, isLastPage: boolean) {
    const score = this.scoreStorm.getScore()
    this.x = 0
    this.y = 0

    for (let ri = 0; ri < page.rows.length; ri++) {
      const latestRow = ri === page.rows.length - 1 && isLastPage
      const row = page.rows[ri]

      for (let gmi = 0; gmi < row.globalMeasures.length; gmi++) {
        const latestMeasureInRow = gmi === row.globalMeasures.length - 1
        const globalMeasure = row.globalMeasures[gmi]

        for (let i = 0; i < row.relativeInstrumentsPosition.length; i++) {
          this.y = row.systemYPosition + row.relativeInstrumentsPosition[i]

          const measure = score.instruments[i].measures[globalMeasure.index]
          this.renderMeasure(measure, latestRow, latestMeasureInRow, globalMeasure)
        }
        // setting global measure position and height
        globalMeasure.graphical.height = row.systemHeight
        globalMeasure.graphical.setPosition({ x: this.x, y: row.systemYPosition + row.relativeInstrumentsPosition[0] })

        this.x += globalMeasure.graphical.width // TODO: make X position a GraphicalGlobalMeasure property
      }
      this.x = 0

      // draw start bar line
      if (row.relativeInstrumentsPosition.length > 1) {
        this.renderer.drawRect(
          this.x,
          row.systemYPosition + row.relativeInstrumentsPosition[0],
          this.scoreStorm.settings.barLineThickness,
          row.systemYPosition +
            row.relativeInstrumentsPosition[row.relativeInstrumentsPosition.length - 1] +
            this.scoreStorm.settings.barlineHeight -
            (row.systemYPosition + row.relativeInstrumentsPosition[0]),
        )
      }
    }
  }

  renderMeasure(measure: Measure, latestRow: boolean, latestMeasureInRow: boolean, globalMeasure: GlobalMeasure) {
    // draw staff lines

    measure.graphical.renderStaveLines(this.renderer, this.x, this.y, this.scoreStorm.settings)

    this.renderMeasureContent(measure, globalMeasure)

    // draw end barline
    if (latestRow && latestMeasureInRow) {
      this.renderer.drawRect(
        this.x + globalMeasure.graphical.width - this.scoreStorm.settings.unit,
        this.y,
        this.scoreStorm.settings.barLineThickness,
        this.scoreStorm.settings.barlineHeight,
      )
      this.renderer.drawRect(
        this.x + globalMeasure.graphical.width - this.scoreStorm.settings.barLineThickness * 3.8,
        this.y,
        this.scoreStorm.settings.barLineThickness * 3.8,
        this.scoreStorm.settings.barlineHeight,
      )
    } else {
      this.renderer.drawRect(
        this.x + globalMeasure.graphical.width - this.scoreStorm.settings.barLineThickness,
        this.y,
        this.scoreStorm.settings.barLineThickness,
        this.scoreStorm.settings.barlineHeight,
      )
    }
  }

  renderBBox(bBox: BBox) {
    if (this.scoreStorm.settings.debug?.bBoxes) {
      this.renderer.setColor("#ff8a8a80")
      this.renderer.drawRect(bBox.x, bBox.y, bBox.width, bBox.height)
      this.renderer.setColor("black")
    }
  }

  renderMeasureContent(measure: Measure, globalMeasure: GlobalMeasure) {
    //  draw measure content
    // temporarily do horizontal positioning here, but ultimately this should be done in GraphicalMeasure
    let measureX = this.x
    if (measure.graphical.clef) {
      measureX += this.scoreStorm.settings.unit * this.scoreStorm.settings.clefMargin
      measure.graphical.clef.setPosition(measureX, this.y + this.scoreStorm.settings.midStave, this.scoreStorm.settings)
      const bBox = measure.graphical.clef.getBBox(this.scoreStorm.settings)
      this.renderInteractiveObject(measure.graphical.clef.clef, measure.graphical.clef, bBox)
      this.renderBBox(bBox)
      measureX += this.scoreStorm.settings.unit * globalMeasure.graphical.clefRelativeWidth
    }

    if (measure.graphical.time) {
      measureX += this.scoreStorm.settings.unit * this.scoreStorm.settings.timeSignatureMargin
      measure.graphical.time.setPosition(measureX, this.y + this.scoreStorm.settings.midStave)
      const bBox = measure.graphical.time.getBBox(this.scoreStorm.settings)
      this.renderInteractiveObject(measure.graphical.time.time, measure.graphical.time, bBox)
      this.renderBBox(bBox)
      measureX += this.scoreStorm.settings.unit * globalMeasure.graphical.timeSignatureRelativeWidth
    }

    measureX += this.scoreStorm.settings.unit * this.scoreStorm.settings.contentMargin
    const availableWidth = globalMeasure.graphical.width - (measureX - this.x)
    for (let i = 0; i < measure.events.length; i++) {
      const event = measure.events[i]
      const globalBeat = globalMeasure.globalBeatByNote.get(event)!

      if (!globalBeat.graphical.position) {
        globalBeat.graphical.setPosition({
          x: measureX + availableWidth * globalBeat.fraction,
          y: this.y,
        })
      }

      event.graphical.setPosition(
        measureX + availableWidth * globalBeat.fraction,
        this.y + this.scoreStorm.settings.midStave,
        this.scoreStorm.settings,
      )
      const bBox = event.graphical.getBBox(this.scoreStorm.settings)
      this.renderInteractiveObject(event, event.graphical, bBox)
      this.renderBBox(bBox)
    }

    // content bbox
    // this.renderer.setColor("#ff8a8a80")
    // this.renderer.drawRect(measureX, this.y, graphicalMeasure.width - (measureX - this.x), this.scoreStorm.settings.barlineHeight)
    // this.renderer.setColor("black")
  }

  renderInteractiveObject(object: object, graphicalObject: IGraphical, bBox: BBox) {
    this.editorManager.registerInteractionArea(object, graphicalObject, bBox)
    this.renderer.renderInGroup(graphicalObject, () => graphicalObject.render(this.renderer, this.scoreStorm.settings))
  }
}

export default RenderManager
