import RBush from "rbush"
import { BBox, IGraphical } from "./graphical"
import { EventType, InteractionPosition } from "./EventManager"
import RenderManager from "./RenderManager"

type SpatialIndexItem = {
  minX: number
  minY: number
  maxX: number
  maxY: number
  object: object
}

export class EditorManager {
  private renderManager!: RenderManager
  private hoveredObject: any | null = null
  private selectedObject: any | null = null // TODO: improve types, create BaseObject class
  private spatialSearchTreeByPage: Map<number, RBush<SpatialIndexItem>>
  private graphicalByObject: Map<object, IGraphical> = new Map()

  constructor(renderManager: RenderManager) {
    this.renderManager = renderManager

    this.spatialSearchTreeByPage = new Map()

    // bind handlers
    this.handleHover = this.handleHover.bind(this)
    this.handleSelectionEnded = this.handleSelectionEnded.bind(this)

    this.renderManager.scoreStorm.eventManager.on(EventType.HOVER, this.handleHover)
    this.renderManager.scoreStorm.eventManager.on(EventType.SELECTION_ENDED, this.handleSelectionEnded)
  }

  handleHover({ x, y, pageIndex }: InteractionPosition) {
    const spatialSearchTree = this.spatialSearchTreeByPage.get(pageIndex)
    if (!spatialSearchTree) {
      return
    }

    const result = spatialSearchTree.search({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y,
    })

    let shouldUpdate = true

    if (result.length) {
      if (this.hoveredObject) {
        shouldUpdate = false
      }
      this.hoveredObject = result[0].object
    } else {
      if (!this.hoveredObject) {
        shouldUpdate = false
      }
      this.hoveredObject = null
    }

    if (shouldUpdate) {
      this.renderManager.scoreStorm.eventManager.dispatch(EventType.HOVER_PROCESSED, {
        object: this.graphicalByObject.get(this.hoveredObject) || null,
        pageIndex,
      })
    }
  }

  handleSelectionEnded({ x, y, pageIndex }: InteractionPosition) {
    const spatialSearchTree = this.spatialSearchTreeByPage.get(pageIndex)
    if (!spatialSearchTree) {
      return
    }

    const result = spatialSearchTree.search({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y,
    })

    const newSelected = result[0] ? result[0].object : null
    if (newSelected !== this.selectedObject) {
      this.selectedObject = newSelected
      this.renderManager.scoreStorm.eventManager.dispatch(EventType.SELECTION_PROCESSED, {
        object: this.graphicalByObject.get(this.selectedObject) || null,
        pageIndex,
      })
    }
  }

  registerInteractionArea(object: object, graphicalObject: IGraphical, bBox: BBox, pageIndex: number) {
    if (!this.graphicalByObject.get(object)) {
      // TODO: this doesn't work for graphical objects that does not have their counterpart in score model (clef on non first row e.t.c)
      this.graphicalByObject.set(object, graphicalObject)
    }
    let spatialSearchTree: RBush<SpatialIndexItem>
    if (!this.spatialSearchTreeByPage.has(pageIndex)) {
      spatialSearchTree = new RBush()
      this.spatialSearchTreeByPage.set(pageIndex, spatialSearchTree)
    } else {
      spatialSearchTree = this.spatialSearchTreeByPage.get(pageIndex)!
    }

    spatialSearchTree.insert({
      minX: bBox.x,
      minY: bBox.y,
      maxX: bBox.x + bBox.width,
      maxY: bBox.y + bBox.height,
      object,
    })
  }

  clear() {
    this.spatialSearchTreeByPage.clear()
    this.graphicalByObject.clear()
  }

  restoreSelection() {
    // if (this.selectedObject) {
    //   this.renderManager.scoreStorm.eventManager.dispatch(EventType.SELECTION_PROCESSED, {
    //     object: this.graphicalByObject.get(this.selectedObject) || null,
    //   })
    // }
  }
}
