import RBush from "rbush"
import { BBox, IGraphical } from "./graphical"
import { EventManager, EventType, InteractionPosition } from "./EventManager"

type SpatialIndexItem = {
  minX: number
  minY: number
  maxX: number
  maxY: number
  object: object
}

export class BaseEditor {
  private eventManager!: EventManager
  private hoveredObject: any | null = null
  private selectedObject: any | null = null // TODO: improve tpyes, create BaeObject class
  private spatialSearchTree!: RBush<SpatialIndexItem>
  private grahicalByObject: Map<object, IGraphical> = new Map()

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager

    this.spatialSearchTree = new RBush()

    // bind handlers
    this.handleHover = this.handleHover.bind(this)
    this.handleSelectionEnded = this.handleSelectionEnded.bind(this)

    this.eventManager.on(EventType.HOVER, this.handleHover)
    this.eventManager.on(EventType.SELECTION_ENDED, this.handleSelectionEnded)
  }

  handleHover({ x, y }: InteractionPosition) {
    const result = this.spatialSearchTree.search({
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
      this.eventManager.dispatch(EventType.HOVER_PROCESSED, {
        object: this.grahicalByObject.get(this.hoveredObject) || null,
      })
    }
  }

  handleSelectionEnded({ x, y }: InteractionPosition) {
    const result = this.spatialSearchTree.search({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y,
    })

    const newSelected = result[0] ? result[0].object : null
    if (newSelected !== this.selectedObject) {
      this.selectedObject = newSelected
      this.eventManager.dispatch(EventType.SELECTION_PROCESSED, {
        object: this.grahicalByObject.get(this.selectedObject) || null,
      })
    }
  }

  registerInteractionArea(object: object, grahicalObject: IGraphical, bBox: BBox) {
    if (!this.grahicalByObject.get(object)) {
      // TODO: this doesnt work for graphical objects that does not have their counterpart in score model (clef on non first row e.t.c)
      this.grahicalByObject.set(object, grahicalObject)
    }

    this.spatialSearchTree.insert({
      minX: bBox.x,
      minY: bBox.y,
      maxX: bBox.x + bBox.width,
      maxY: bBox.y + bBox.height,
      object,
    })
  }

  clear() {
    this.spatialSearchTree.clear()
    this.grahicalByObject.clear()
  }

  restoreSelection() {
    if (this.selectedObject) {
      this.eventManager.dispatch(EventType.SELECTION_PROCESSED, {
        object: this.grahicalByObject.get(this.selectedObject) || null,
      })
    }
  }
}
