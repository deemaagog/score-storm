import React, { PropsWithChildren, createContext, useContext, useState } from "react"

type SettingsContextValue = {
  background: string
  scale: number
  bpm: number
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

const defaultBackground = `
radial-gradient(circle at 50% 50%,rgb(18,100,163) 20%,transparent 80%),
conic-gradient(from 45deg at 50% 50%,rgb(9,58,115) 0%,rgb(18,100,163) 25%,rgb(9,58,115) 50%,rgb(18,100,163) 75%,rgb(9,58,115) 100%)`

const defaultScale = 70

const defaultBpm = 100

export const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [settings] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const background = urlParams.get("background") ?? defaultBackground

    const scaleFromUrl = urlParams.get("scale")
    const scale = scaleFromUrl ? parseInt(scaleFromUrl) : defaultScale

    const bpmFromUrl = urlParams.get("bpm")
    const bpm = bpmFromUrl ? parseInt(bpmFromUrl) : defaultBpm

    return { background, scale, bpm }
  })
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}

export const useSettings = () => {
  const settingsContext = useContext(SettingsContext)
  if (!settingsContext) throw new Error("No SettingsContext.Provider found when calling useSettings.")
  return settingsContext
}
