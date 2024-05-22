import React, { PropsWithChildren, useContext, useEffect, useState, createContext, useRef, useCallback } from "react"
import { ScoreStormContext } from "./ScoreStormProvider"
import { EventType, GraphicalClef, IGraphical, InteractionEvent } from "@score-storm/core"
import { GraphicalNoteEvent } from "@score-storm/core/dist/graphical/GraphicalNoteEvent"
import { GraphicalRestEvent } from "@score-storm/core/dist/graphical/GraphicalRestEvent"
import { GraphicalTimeSignature } from "@score-storm/core/dist/graphical/GraphicalTimeSignature"

export enum SelectionType {
  Note = "Note",
  Rest = "Rest",
  Clef = "Clef",
  TimeSignature = "TimeSignature",
}

type SelectionContextValue = { type: SelectionType | null; getSelectedObject: () => IGraphical | null }
export const SelectionContext = createContext<SelectionContextValue>({ type: null, getSelectedObject: () => null })

export const SelectionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { scoreStorm } = useContext(ScoreStormContext)
  const [selectedType, setSelectedType] = useState<SelectionType | null>(null)
  const selectedObjectRef = useRef<IGraphical | null>(null)

  const handleSelect = (event: InteractionEvent) => {
    console.log("click", event.object)
    if (event.object instanceof GraphicalClef) {
      setSelectedType(SelectionType.Clef)
    } else if (event.object instanceof GraphicalNoteEvent) {
      setSelectedType(SelectionType.Note)
    } else if (event.object instanceof GraphicalRestEvent) {
      setSelectedType(SelectionType.Rest)
    } else if (event.object instanceof GraphicalTimeSignature) {
      setSelectedType(SelectionType.TimeSignature)
    } else {
      setSelectedType(null)
    }
    selectedObjectRef.current = event.object
  }

  const getSelectedObject = useCallback(() => {
    return selectedObjectRef.current
  }, [])

  useEffect(() => {
    scoreStorm.setEventListener(EventType.CLICK, handleSelect)
  }, [])

  return <SelectionContext.Provider value={{ type: selectedType, getSelectedObject }}>{children}</SelectionContext.Provider>
}
