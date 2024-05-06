import ScoreStorm, {
  EventType,
  GraphicalClef,
  InteractionEvent,
  Score,
  ScoreStormSettings,
  QuickScoreOptions,
} from "@score-storm/core"
import { useEffect, useRef, useState } from "react"

type UseSSParams = {
  ssOptions: ScoreStormSettings
  quickScoreOptions: QuickScoreOptions
  //   rootElementRef: React.MutableRefObject<HTMLDivElement | null>
}

type UseSSReturn = {
  initialized: boolean
  ss: ScoreStorm
}

export const useSS = (params: UseSSParams): UseSSReturn => {
  const scoreStorm = useRef<ScoreStorm>()
  const [initialized, setInitialized] = useState(false)

  const handleClick = (event: InteractionEvent) => {
    if (event.object instanceof GraphicalClef) {
      scoreStorm.current!.getScore().setClef()
      scoreStorm.current!.render()
    }
  }

  useEffect(() => {
    // console.log("mount", params.rootElementRef.current)

    scoreStorm.current = new ScoreStorm(params.ssOptions)
    scoreStorm.current.setEventListener(EventType.CLICK, handleClick)

    const score = Score.createQuickScore(params.quickScoreOptions)
    scoreStorm.current.setScore(score)
    // scoreStorm.current.setRenderer(new Renderer(params.rootElementRef.current!))
    // scoreStorm.current.render()

    setInitialized(true)

    return () => {
      // destroy on unmount
      scoreStorm.current!.destroy()
    }
  }, [params])

  return { initialized, ss: scoreStorm.current! }
}
