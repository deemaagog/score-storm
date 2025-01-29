import { useContext, useEffect } from "react"
import { ScoreStormContext } from "./ScoreStormProvider"
import { GlobalMeasure, toTonalPitch } from "@score-storm/core"
import { PlayerContext, PlayEvent } from "./PlayerProvider"

export const Player: React.FC = () => {
  const { play, stop, isPlaying, isReady } = useContext(PlayerContext)
  const { scoreStorm } = useContext(ScoreStormContext)

  useEffect(() => {
    window.addEventListener("keyup", handleKey)
    return () => {
      window.removeEventListener("keyup", handleKey)
    }
  }, [isPlaying, isReady])

  const handleKey = (e: KeyboardEvent) => {
    if (!isReady) {
      console.log("player not ready")
      return
    }
    if (e.code === "Space") {
      if (isPlaying) {
        stop()
      } else {
        const score = scoreStorm.getScore()
        const playEvents = getPlayEvents(score.globalMeasures)
        play(playEvents)
      }
    }
  }

  return null
}

function getPlayEvents(globalMeasures: GlobalMeasure[]): PlayEvent[] {
  const playEvents = []
  let time = 0
  for (const globalMeasure of globalMeasures) {
    for (const globalBeat of globalMeasure.globalBeats) {
      for (const beat of globalBeat.beats) {
        if (beat.notes) {
          for (const note of beat.notes) {
            playEvents.push({ pitch: toTonalPitch(note.pitch), duration: globalBeat.duration, time })
          }
        } else {
          // for rests add a play event with velocity 1 for now. TODO: figure out a better way
          playEvents.push({ pitch: "C10", duration: globalBeat.duration, time, velocity: 1 })
        }
      }
      time += globalBeat.duration
    }
  }
  return playEvents
}
