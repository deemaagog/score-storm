// import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { MantineProvider } from "@mantine/core"
import { theme } from "./theme"
import { ScoreStormProvider } from "./ScoreStormProvider.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <MantineProvider theme={theme}>
    <ScoreStormProvider>
      <App />
    </ScoreStormProvider>
  </MantineProvider>,
  // </React.StrictMode>,
)
