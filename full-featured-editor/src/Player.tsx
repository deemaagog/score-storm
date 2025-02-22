import { useContext } from "react"
import { ScoreStormContext } from "./ScoreStormProvider"
import { GlobalMeasure, toTonalPitch } from "@score-storm/core"
import { PlayerContext, PlayEvent } from "./PlayerProvider"
import { IconPlayerPlayFilled, IconPlayerStopFilled } from "@tabler/icons-react"

export const Player: React.FC = () => {
  const { play, stop, isPlaying, isReady } = useContext(PlayerContext)
  const { scoreStorm } = useContext(ScoreStormContext)

  const handlePlay = () => {
    const score = scoreStorm.getScore()
    const playEvents = getPlayEvents(score.globalMeasures)
    play(playEvents)
  }

  const handleStop = () => {
    stop()
  }

  if (!isReady) {
    return null
  }

  if (isPlaying) {
    return (
      <IconPlayerStopFilled
        color="white"
        style={{ zIndex: 1000 }}
        role="button"
        cursor={"pointer"}
        onClick={handleStop}
      />
    )
  }

  return (
    <IconPlayerPlayFilled
      color="white"
      style={{ zIndex: 1000 }}
      role="button"
      cursor={"pointer"}
      onClick={handlePlay}
    />
  )

  /* <Slider w={"100%"} flex={1} size={"xs"} mr={8} step={0.01} /> */
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
