import { MantineTheme, useMantineTheme } from "@mantine/core"
import ScoreStorm from "@score-storm/core"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import { UseSSParams, useSS } from "./hooks"
import { InstrumentType, TimeSignature } from '@score-storm/core'

type ScoreStormContextValue = { scoreStorm: ScoreStorm }
export const ScoreStormContext = createContext<ScoreStormContextValue>({} as ScoreStormContextValue)

const getDefaultParams = (theme: MantineTheme): UseSSParams => ({
  ssOptions: {
    scale: 80,
    editor: { enable: true, styles: { hoverColor: theme.colors.blue[3], selectColor: theme.colors.blue[6] } },
  },
  quickScoreOptions: { numberOfMeasures: 1, timeSignature: new TimeSignature(4,4), instruments: [InstrumentType.PIANO, InstrumentType.PIANO] },
})

export const ScoreStormProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const theme = useMantineTheme()

  const { ss, initialized } = useSS(getDefaultParams(theme))

  if (!initialized) {
    return null
  }

  return <ScoreStormContext.Provider value={{ scoreStorm: ss }}>{children}</ScoreStormContext.Provider>
}
