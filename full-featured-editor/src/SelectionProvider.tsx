import React, { PropsWithChildren, useContext, useEffect, useState, createContext } from "react"
import { ScoreStormContext } from "./ScoreStormProvider"
import { IGraphical, InteractionEvent, InteractionEventType } from "@score-storm/core"

type SelectionContextValue = {
  selectedObject: IGraphical | null
}
export const SelectionContext = createContext<SelectionContextValue>({
  selectedObject: null,
})

export const SelectionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { scoreStorm } = useContext(ScoreStormContext)
  const [selectedObject, setSelectedObject] = useState<IGraphical | null>(null)

  const handleSelect = (event: InteractionEvent) => {
    setSelectedObject(event.object)
  }

  useEffect(() => {
    scoreStorm.setInteractionEventListener(InteractionEventType.SELECTION_PROCESSED, handleSelect)
  }, [])

  return <SelectionContext.Provider value={{ selectedObject: selectedObject }}>{children}</SelectionContext.Provider>
}
