import ScoreStorm, {
  Score,
  ScoreStormSettings,
  QuickScoreOptions,
} from "@score-storm/core"
import { useEffect, useRef, useState } from "react"

export type UseSSParams = {
  ssOptions: ScoreStormSettings
  quickScoreOptions: QuickScoreOptions
}

type UseSSReturn = {
  initialized: boolean
  ss: ScoreStorm
}

export const useSS = (params: UseSSParams): UseSSReturn => {
  const scoreStorm = useRef<ScoreStorm>()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    scoreStorm.current = new ScoreStorm(params.ssOptions)

    const score = Score.createQuickScore(params.quickScoreOptions)
    scoreStorm.current.setScore(score)

    setInitialized(true)

    return () => {
      // destroy on unmount
      scoreStorm.current!.destroy()
    }
  }, [])

  return { initialized, ss: scoreStorm.current! }
}
