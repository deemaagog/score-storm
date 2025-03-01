import { MantineTheme, useMantineTheme } from "@mantine/core"
import ScoreStorm from "@score-storm/core"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import { UseSSParams, useSS } from "./hooks"
import { InstrumentType, TimeSignature } from "@score-storm/core"
import { useSettings } from "./SettingsProvider"

type ScoreStormContextValue = { scoreStorm: ScoreStorm; numberOfMeasures: number }
export const ScoreStormContext = createContext<ScoreStormContextValue>({} as ScoreStormContextValue)

const getDefaultParams = (theme: MantineTheme, scale: number): UseSSParams => ({
  ssOptions: {
    scale,
    editor: { enable: true, styles: { hoverColor: theme.colors.blue[3], selectColor: theme.colors.blue[6] } },
  },
  quickScoreOptions: {
    numberOfMeasures: 1,
    timeSignature: new TimeSignature(4, 4),
    instruments: [InstrumentType.PIANO, InstrumentType.PIANO],
  },
})

export const ScoreStormProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const theme = useMantineTheme()
  const settings = useSettings()

  const { ss, initialized, numberOfMeasures } = useSS(getDefaultParams(theme, settings.scale))

  if (!initialized) {
    return null
  }

  return (
    <ScoreStormContext.Provider value={{ scoreStorm: ss, numberOfMeasures }}>{children}</ScoreStormContext.Provider>
  )
}
