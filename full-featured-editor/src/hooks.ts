import ScoreStorm, { Score, ScoreStormSettings, QuickScoreOptions, EventType, FlowLayout } from "@score-storm/core"
import { useEffect, useRef, useState } from "react"

export type UseSSParams = {
  ssOptions: ScoreStormSettings
  quickScoreOptions: QuickScoreOptions
}

type UseSSReturn = {
  initialized: boolean
  ss: ScoreStorm
  numberOfMeasures: number
}

export const useSS = (params: UseSSParams): UseSSReturn => {
  const scoreStorm = useRef<ScoreStorm>()
  const [initialized, setInitialized] = useState(false)
  const [numberOfMeasures, setNumberOfMeasures] = useState(0)

  useEffect(() => {
    scoreStorm.current = new ScoreStorm(params.ssOptions)

    scoreStorm.current.eventManager.on(EventType.NUMBER_OF_MEASURES_UPDATED, ({ numberOfMeasures }) => {
      setNumberOfMeasures(numberOfMeasures)
    })

    const score = Score.createQuickScore(params.quickScoreOptions)
    scoreStorm.current.setScore(score)
    scoreStorm.current.setLayout(new FlowLayout())

    setInitialized(true)

    return () => {
      // destroy on unmount
      scoreStorm.current!.destroy()
    }
  }, [])

  return { initialized, ss: scoreStorm.current!, numberOfMeasures }
}
