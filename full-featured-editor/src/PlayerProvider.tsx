import React, { PropsWithChildren, useEffect, useState, createContext, useRef } from "react"
import { SplendidGrandPiano } from "smplr"
import { getAudioContext } from "./audio-context"

type PlayerContextValue = {
  play: (events: PlayEvent[]) => void
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
  stop: () => {},
  isReady: false,
  isPlaying: false,
})

const BPM = 100 // hardcoded for now
const quarterToBmp = 4 * (60 / BPM)

// only piano for now
export const PlayerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const instrument = useRef<SplendidGrandPiano>()

  const play = (events: PlayEvent[]) => {
    getAudioContext().resume()
    setIsPlaying(true)

    events.map((event, i) =>
      instrument.current!.start({
        note: event.pitch,
        duration: event.duration * quarterToBmp,
        time: instrument.current!.context.currentTime + (event.time ?? 0) * quarterToBmp,
        onEnded:
          i === events.length - 1
            ? () => {
                setIsPlaying(false)
              }
            : undefined,
        velocity: event.velocity ?? 100,
      }),
    )
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

  return <PlayerContext.Provider value={{ play, stop, isReady, isPlaying }}>{children}</PlayerContext.Provider>
}
