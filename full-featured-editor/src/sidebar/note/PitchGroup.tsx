import { useContext, useEffect } from "react"
import { SelectionContext } from "../../SelectionProvider"
import { GraphicalNoteEvent, transposePitch, toTonalPitch } from "@score-storm/core"
import { ScoreStormContext } from "../../ScoreStormProvider"
import { PlayerContext } from "../../PlayerProvider"

export const PitchGroup: React.FC = () => {
  const { play } = useContext(PlayerContext)
  const { selectedObject } = useContext(SelectionContext)
  const { scoreStorm } = useContext(ScoreStormContext)

  useEffect(() => {
    window.addEventListener("keyup", handleKey)
    return () => {
      window.removeEventListener("keyup", handleKey)
    }
    // TODO: figure out selectedObject should be in the dependency array
  }, [selectedObject])

  const handleKey = (e: KeyboardEvent) => {
    const isNoteEventSelected = selectedObject instanceof GraphicalNoteEvent
    if (!isNoteEventSelected) return
    let direction
    if (e.key === "ArrowUp") {
      direction = "up"
    } else if (e.key === "ArrowDown") {
      direction = "down"
    }
    if (direction) {
      const beat = (selectedObject as GraphicalNoteEvent).noteEvent
      const note = beat.notes![0]
      const newPitch = transposePitch(note.pitch, direction === "up" ? "2m" : "-2m")

      play([{ pitch: toTonalPitch(newPitch), duration: 0.05 }])

      beat.changePitch(newPitch)
      scoreStorm.render()
    }
  }

  return null
}
