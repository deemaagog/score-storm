import RBush from "rbush"
import { BBox, IGraphical } from "./graphical"
import { EventManager } from "./EventManager"
import { InteractionEventMap, InteractionEventType, InteractionPosition } from "./events"

type SpatialIndexItem = {
  minX: number
  minY: number
  maxX: number
  maxY: number
  graphicalId: string
}

export class EditorManager {
  interactionEventManager: EventManager<InteractionEventMap>
  private hoveredId: string | null = null
  // selectedId holds the stable ID of the selected graphical object so that selection
  // survives re-renders. The ID is deterministic (derived from the model object's uid),
  // so the same graphical element gets the same ID after each render.
  //
  // When multiple graphical objects should be highlighted together (e.g. all time
  // signatures for a selected GlobalMeasure), dispatch can be extended to look up all
  // graphicals whose IDs share a common prefix (e.g. "gts-<globalMeasure.uid>-*").
  private selectedId: string | null = null
  private spatialSearchTreeByPage: Map<number, RBush<SpatialIndexItem>>
  private graphicalById: Map<string, IGraphical> = new Map()
  private pageIndexById: Map<string, number> = new Map()

  constructor() {
    this.interactionEventManager = new EventManager<InteractionEventMap>()

    this.spatialSearchTreeByPage = new Map()

    // bind handlers
    this.handleHover = this.handleHover.bind(this)
    this.handleSelectionEnded = this.handleSelectionEnded.bind(this)

    this.interactionEventManager.on(InteractionEventType.HOVER, this.handleHover)
    this.interactionEventManager.on(InteractionEventType.SELECTION_ENDED, this.handleSelectionEnded)
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
      if (this.hoveredId !== null) {
        shouldUpdate = false
      }
      this.hoveredId = result[0].graphicalId
    } else {
      if (this.hoveredId === null) {
        shouldUpdate = false
      }
      this.hoveredId = null
    }

    if (shouldUpdate) {
      this.interactionEventManager.dispatch(InteractionEventType.HOVER_PROCESSED, {
        pageIndex,
        object: this.graphicalById.get(this.hoveredId ?? "") || null,
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

    const newSelectedId = result[0] ? result[0].graphicalId : null
    if (newSelectedId !== this.selectedId) {
      this.selectedId = newSelectedId
      this.interactionEventManager.dispatch(InteractionEventType.SELECTION_PROCESSED, {
        pageIndex,
        object: this.graphicalById.get(this.selectedId ?? "") || null,
      })
    }
  }

  registerInteractionArea(graphicalObject: IGraphical, bBox: BBox, pageIndex: number) {
    const id = graphicalObject.id
    this.pageIndexById.set(id, pageIndex)
    this.graphicalById.set(id, graphicalObject)

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
      graphicalId: id,
    })
  }

  clear() {
    this.spatialSearchTreeByPage.clear()
    this.graphicalById.clear()
    this.pageIndexById.clear()
    // this.interactionEventManager.clear()
  }

  restoreSelection() {
    if (this.selectedId) {
      const pageIndex = this.pageIndexById.get(this.selectedId)
      const graphical = this.graphicalById.get(this.selectedId)
      if (pageIndex !== undefined && graphical) {
        this.interactionEventManager.dispatch(InteractionEventType.SELECTION_PROCESSED, {
          pageIndex,
          object: graphical,
        })
      }
    }
  }
}
