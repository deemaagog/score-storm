import RBush from "rbush"
import { BBox, IGraphical } from "./graphical"
import { EventManager } from "./EventManager"
import { InteractionEventMap, InteractionEventType, InteractionPosition } from "./events"

type SpatialIndexItem = {
  minX: number
  minY: number
  maxX: number
  maxY: number
  object: object
}

export class EditorManager {
  interactionEventManager: EventManager<InteractionEventMap>
  private hoveredObject: any | null = null
  private selectedObject: any | null = null // TODO: improve types, create BaseObject class
  private spatialSearchTree!: RBush<SpatialIndexItem>
  private graphicalByObject: Map<object, IGraphical> = new Map()

  constructor() {
    this.interactionEventManager = new EventManager<InteractionEventMap>()

    this.spatialSearchTree = new RBush()

    // bind handlers
    this.handleHover = this.handleHover.bind(this)
    this.handleSelectionEnded = this.handleSelectionEnded.bind(this)

    this.interactionEventManager.on(InteractionEventType.HOVER, this.handleHover)
    this.interactionEventManager.on(InteractionEventType.SELECTION_ENDED, this.handleSelectionEnded)
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
      this.interactionEventManager.dispatch(InteractionEventType.HOVER_PROCESSED, {
        object: this.graphicalByObject.get(this.hoveredObject) || null,
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
      this.interactionEventManager.dispatch(InteractionEventType.SELECTION_PROCESSED, {
        object: this.graphicalByObject.get(this.selectedObject) || null,
      })
    }
  }

  registerInteractionArea(object: object, graphicalObject: IGraphical, bBox: BBox) {
    if (!this.graphicalByObject.get(object)) {
      // TODO: this doesn't work for graphical objects that does not have their counterpart in score model (clef on non first row e.t.c)
      this.graphicalByObject.set(object, graphicalObject)
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
    this.graphicalByObject.clear()
    // this.interactionEventManager.clear()
  }

  restoreSelection() {
    if (this.selectedObject) {
      this.interactionEventManager.dispatch(InteractionEventType.SELECTION_PROCESSED, {
        object: this.graphicalByObject.get(this.selectedObject) || null,
      })
    }
  }
}
