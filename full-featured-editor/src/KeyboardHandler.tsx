import { useContext, useEffect } from "react"
import { SelectionContext } from "./SelectionProvider"
import { GraphicalNoteEvent, transposePitch, toTonalPitch, ChangePitchCommand } from "@score-storm/core"
import { ScoreStormContext } from "./ScoreStormProvider"
import { PlayerContext } from "./PlayerProvider"

export const KeyboardHandler: React.FC = () => {
  const { playOne } = useContext(PlayerContext)
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

      playOne({ pitch: toTonalPitch(newPitch), duration: 0.05 })

      scoreStorm.executeCommand(new ChangePitchCommand({ beat, newPitch }))
      scoreStorm.render()
    }
  }

  return null
}
