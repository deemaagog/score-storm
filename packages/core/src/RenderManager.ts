import { IRenderer } from "./interfaces"
import { ScoreStorm } from "./ScoreStorm"
import { BBox, IGraphical } from "./graphical/interfaces"
import { EditorManager } from "./EditorManager"
import { Score } from "./model/Score"
import { Beat } from "./model/Beat"
import { FlowLayout, ILayout } from "./layouts"
import { GraphicalScore, Page } from "./graphical/GraphicalScore"
import { GraphicalMeasure } from "./graphical/GraphicalMeasure"
import { GraphicalGlobalMeasure } from "./graphical/GraphicalGlobalMeasure"
import { GraphicalGlobalBeat } from "./graphical/GraphicalGlobalBeat"
import { GraphicalNoteEvent } from "./graphical/GraphicalNoteEvent"
import { GraphicalRestEvent } from "./graphical/GraphicalRestEvent"
import { GraphicalInstrument } from "./graphical/GraphicalInstrument"
import { InteractionEventMap } from "./events"

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

  // Owns the graphical tree — rebuilt on every render call via buildGraphical()
  private graphicalScore!: GraphicalScore

  constructor(scoreStorm: ScoreStorm) {
    this.scoreStorm = scoreStorm
    this.editorManager = new EditorManager()
    this.layout = new FlowLayout()
  }

  getGraphicalScore(): GraphicalScore | undefined {
    return this.graphicalScore
  }

  /**
   * Builds the complete graphical tree from the score model.
   * Uses a local beatMap to wire beat graphicals into the global beat tree
   * without requiring any persistent map.
   */
  private buildGraphical(score: Score): GraphicalScore {
    const graphicalScore = new GraphicalScore()

    // local map used only during build to correlate beats with their graphicals
    const beatMap = new Map<Beat, GraphicalNoteEvent | GraphicalRestEvent>()

    for (const instrument of score.instruments) {
      const graphicalInstrument = new GraphicalInstrument()
      for (const measure of instrument.measures) {
        const graphicalMeasure = new GraphicalMeasure(measure)
        for (const beat of measure.events) {
          const graphicalBeat = beat.notes
            ? new GraphicalNoteEvent(beat)
            : new GraphicalRestEvent(beat)
          graphicalMeasure.events.push(graphicalBeat)
          beatMap.set(beat, graphicalBeat)
        }
        graphicalInstrument.measures.push(graphicalMeasure)
      }
      graphicalScore.instruments.push(graphicalInstrument)
    }

    for (const globalMeasure of score.globalMeasures) {
      const graphicalGlobalMeasure = new GraphicalGlobalMeasure(globalMeasure)
      for (const globalBeat of globalMeasure.globalBeats) {
        const graphicalGlobalBeat = new GraphicalGlobalBeat(globalBeat)
        for (const beat of globalBeat.beats) {
          const graphicalBeat = beatMap.get(beat)!
          graphicalGlobalBeat.beats.push(graphicalBeat)
          graphicalGlobalMeasure.globalBeatByBeat.set(graphicalBeat, graphicalGlobalBeat)
        }
        graphicalGlobalMeasure.globalBeats.push(graphicalGlobalBeat)
      }
      graphicalScore.globalMeasures.push(graphicalGlobalMeasure)
    }

    return graphicalScore
  }

  setRenderer(renderer: IRenderer) {
    if (this.renderer) {
      // eslint-disable-next-line no-console
      console.log("destroying...")
      this.renderer.destroy()
    }
    this.renderer = renderer
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

  setInteractionEventListener<K extends keyof InteractionEventMap>(
    eventType: K,
    listener: (event: InteractionEventMap[K]) => void,
  ) {
    this.editorManager.interactionEventManager.on(eventType, listener)
  }

  dispatchInteractionEvent<K extends keyof InteractionEventMap>(eventType: K, event: InteractionEventMap[K]) {
    this.editorManager.interactionEventManager.dispatch(eventType, event)
  }

  removeInteractionEventListener<K extends keyof InteractionEventMap>(
    eventType: K,
    listener: (event: InteractionEventMap[K]) => void,
  ) {
    this.editorManager.interactionEventManager.off(eventType, listener)
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
      this.renderer.init(this.scoreStorm)
    }

    this.graphicalScore = this.buildGraphical(score)

    const pageDimensions = this.scoreStorm.getLayout().getPageDimensions(this.renderer.getContainerWidth())
    const rows = this.graphicalScore.calculateLineBreaks(pageDimensions.width)
    // TODO: handle errors
    this.graphicalScore.calculatePageBreaks(rows, this.scoreStorm.settings, pageDimensions.height)

    // clear
    this.editorManager.clear()
    this.renderer.clear()

    for (let i = 0; i < this.graphicalScore.pages.length; i++) {
      const page = this.graphicalScore.pages[i]
      const isLastPage = i === this.graphicalScore.pages.length - 1
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
    this.x = 0
    this.y = 0

    for (let ri = 0; ri < page.rows.length; ri++) {
      const latestRow = ri === page.rows.length - 1 && isLastPage
      const row = page.rows[ri]

      for (let gmi = 0; gmi < row.globalMeasures.length; gmi++) {
        const latestMeasureInRow = gmi === row.globalMeasures.length - 1
        const graphicalGlobalMeasure = row.globalMeasures[gmi]

        for (let i = 0; i < row.relativeInstrumentsPosition.length; i++) {
          this.y = row.systemYPosition + row.relativeInstrumentsPosition[i]

          const graphicalMeasure = this.graphicalScore.instruments[i].measures[graphicalGlobalMeasure.globalMeasure.index]
          this.renderMeasure(graphicalMeasure, latestRow, latestMeasureInRow, graphicalGlobalMeasure)
        }
        // setting global measure position and height
        graphicalGlobalMeasure.height = row.systemHeight
        graphicalGlobalMeasure.setPosition({ x: this.x, y: row.systemYPosition + row.relativeInstrumentsPosition[0] })

        this.x += graphicalGlobalMeasure.width // TODO: make X position a GraphicalGlobalMeasure property
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

  renderMeasure(
    graphicalMeasure: GraphicalMeasure,
    latestRow: boolean,
    latestMeasureInRow: boolean,
    graphicalGlobalMeasure: GraphicalGlobalMeasure,
  ) {
    // draw staff lines
    graphicalMeasure.renderStaveLines(this.renderer, this.x, this.y, this.scoreStorm.settings, graphicalGlobalMeasure.width)

    this.renderMeasureContent(graphicalMeasure, graphicalGlobalMeasure)

    // draw end barline
    if (latestRow && latestMeasureInRow) {
      this.renderer.drawRect(
        this.x + graphicalGlobalMeasure.width - this.scoreStorm.settings.unit,
        this.y,
        this.scoreStorm.settings.barLineThickness,
        this.scoreStorm.settings.barlineHeight,
      )
      this.renderer.drawRect(
        this.x + graphicalGlobalMeasure.width - this.scoreStorm.settings.barLineThickness * 3.8,
        this.y,
        this.scoreStorm.settings.barLineThickness * 3.8,
        this.scoreStorm.settings.barlineHeight,
      )
    } else {
      this.renderer.drawRect(
        this.x + graphicalGlobalMeasure.width - this.scoreStorm.settings.barLineThickness,
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

  renderMeasureContent(graphicalMeasure: GraphicalMeasure, graphicalGlobalMeasure: GraphicalGlobalMeasure) {
    //  draw measure content
    // temporarily do horizontal positioning here, but ultimately this should be done in GraphicalMeasure
    let measureX = this.x
    if (graphicalMeasure.clef) {
      measureX += this.scoreStorm.settings.unit * this.scoreStorm.settings.clefMargin
      graphicalMeasure.clef.setPosition(measureX, this.y + this.scoreStorm.settings.midStave, this.scoreStorm.settings)
      const bBox = graphicalMeasure.clef.getBBox(this.scoreStorm.settings)
      this.renderInteractiveObject(graphicalMeasure.clef, bBox)
      this.renderBBox(bBox)
      measureX += this.scoreStorm.settings.unit * graphicalGlobalMeasure.clefRelativeWidth
    }

    if (graphicalMeasure.time) {
      measureX += this.scoreStorm.settings.unit * this.scoreStorm.settings.timeSignatureMargin
      graphicalMeasure.time.setPosition(measureX, this.y + this.scoreStorm.settings.midStave)
      const bBox = graphicalMeasure.time.getBBox(this.scoreStorm.settings)
      this.renderInteractiveObject(graphicalMeasure.time, bBox)
      this.renderBBox(bBox)
      measureX += this.scoreStorm.settings.unit * graphicalGlobalMeasure.timeSignatureRelativeWidth
    }

    measureX += this.scoreStorm.settings.unit * this.scoreStorm.settings.contentMargin
    const availableWidth = graphicalGlobalMeasure.width - (measureX - this.x)

    for (const graphicalEvent of graphicalMeasure.events) {
      const graphicalGlobalBeat = graphicalGlobalMeasure.globalBeatByBeat.get(graphicalEvent)!

      if (!graphicalGlobalBeat.position) {
        graphicalGlobalBeat.setPosition({
          x: measureX + availableWidth * graphicalGlobalBeat.globalBeat.fraction,
          y: this.y,
        })
      }

      graphicalEvent.setPosition(
        measureX + availableWidth * graphicalGlobalBeat.globalBeat.fraction,
        this.y + this.scoreStorm.settings.midStave,
        this.scoreStorm.settings,
      )
      const bBox = graphicalEvent.getBBox(this.scoreStorm.settings)
      this.renderInteractiveObject(graphicalEvent, bBox)
      this.renderBBox(bBox)
    }

    // content bbox
    // this.renderer.setColor("#ff8a8a80")
    // this.renderer.drawRect(measureX, this.y, graphicalMeasure.width - (measureX - this.x), this.scoreStorm.settings.barlineHeight)
    // this.renderer.setColor("black")
  }

  renderInteractiveObject(graphicalObject: IGraphical, bBox: BBox) {
    this.editorManager.registerInteractionArea(graphicalObject, bBox, this.currentPageIndex)
    this.renderer.renderInGroup(graphicalObject, () => graphicalObject.render(this.renderer, this.scoreStorm.settings))
  }
}

export default RenderManager
