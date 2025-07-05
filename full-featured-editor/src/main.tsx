import React from "react"
import ReactDOM from "react-dom/client"
import { MantineProvider } from "@mantine/core"
import { theme } from "./theme"
import { ScoreStormProvider } from "./ScoreStormProvider.tsx"
import { App } from "./App.tsx"
import { SelectionProvider } from "./SelectionProvider.tsx"
import { PlayerProvider } from "./PlayerProvider.tsx"
import { SettingsProvider } from "./SettingsProvider.tsx"
import { Notifications } from "@mantine/notifications"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
      <MantineProvider theme={theme}>
        <Notifications autoClose={10000} />
        <ScoreStormProvider>
          <SelectionProvider>
            <PlayerProvider>
              <App />
            </PlayerProvider>
          </SelectionProvider>
        </ScoreStormProvider>
      </MantineProvider>
    </SettingsProvider>
  </React.StrictMode>,
)
