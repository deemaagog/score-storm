import React, { PropsWithChildren, useEffect, useState, createContext, useRef } from "react"
import { SplendidGrandPiano } from "smplr"
import { getAudioContext } from "./audio-context"
import { useSettings } from "./SettingsProvider"

type PlayerContextValue = {
  play: (events: PlayEvent[]) => void
  playOne: (event: PlayEvent) => void
  stop: () => void
  isReady: boolean
  isPlaying: boolean
}

export type PlayEvent = {
  pitch: string
  duration: number
  time?: number
  velocity?: number
}

export const PlayerContext = createContext<PlayerContextValue>({
  play: () => {},
  playOne: () => {},
  stop: () => {},
  isReady: false,
  isPlaying: false,
})

// only piano for now
export const PlayerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const { bpm } = useSettings()
  const quarterToBpm = 4 * (60 / bpm)

  const instrument = useRef<SplendidGrandPiano>()

  const play = (events: PlayEvent[]) => {
    getAudioContext().resume()
    setIsPlaying(true)

    events.map((event, i) =>
      instrument.current!.start({
        note: event.pitch,
        duration: event.duration * quarterToBpm,
        time: instrument.current!.context.currentTime + (event.time ?? 0) * quarterToBpm,
        onEnded:
          i === events.length - 1
            ? () => {
                setIsPlaying(false)
              }
            : undefined,
        // onStart: (note) => {console.log("played", note)},
        velocity: event.velocity ?? 100,
      }),
    )
  }

  // play one note, used for pitch input
  const playOne = (event: PlayEvent) => {
    if (isPlaying) {
      return
    }
    getAudioContext().resume()

    instrument.current!.start({
      note: event.pitch,
      duration: event.duration * quarterToBpm,
      time: instrument.current!.context.currentTime + (event.time ?? 0) * quarterToBpm,
      velocity: event.velocity ?? 100,
    })
  }

  const stop = () => {
    instrument.current!.stop()
    setIsPlaying(false)
  }

  useEffect(() => {
    const context = getAudioContext() as unknown as AudioContext
    const piano = new SplendidGrandPiano(context)
    piano.load.then(() => {
      // now the piano is fully loaded
      instrument.current = piano
      setIsReady(true)
    })
  }, [])

  return <PlayerContext.Provider value={{ play, playOne, stop, isReady, isPlaying }}>{children}</PlayerContext.Provider>
}
