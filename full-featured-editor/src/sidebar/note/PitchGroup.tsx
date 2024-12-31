import { useContext, useEffect } from "react"
import { SelectionContext } from "../../SelectionProvider"
import { GraphicalNoteEvent, transposePitch } from "@score-storm/core"
import { ScoreStormContext } from "../../ScoreStormProvider"

export const PitchGroup: React.FC = () => {
  const { selectedObject } = useContext(SelectionContext)
  const { scoreStorm } = useContext(ScoreStormContext)

  useEffect(() => {
    window.addEventListener('keyup', handleKey)
    return () => {
      window.removeEventListener('keyup', handleKey)
    }
    // TODO: figure out selectedObject should be in the dependency array
  },[selectedObject])

  const handleKey = (e: KeyboardEvent) => {
    const isNoteEventSelected = selectedObject instanceof GraphicalNoteEvent
    if (!isNoteEventSelected) return
    let direction;
    if (e.key === 'ArrowUp') {
      direction = 'up'
    } else if (e.key === 'ArrowDown') {
      direction = 'down'
    }
    if (direction) {
      const note = (selectedObject as GraphicalNoteEvent).noteEvent?.notes![0]
      const newPitch = transposePitch(note.pitch, direction === 'up' ? '2m' : "-2m")

      scoreStorm.getScore().changeNotePitch(note, newPitch)
      scoreStorm.render()
    }
  }

  return null
}
