import "@mantine/core/styles.css"
import "./App.css"
import { AppShell, useMantineTheme } from "@mantine/core"
import { createContext, useEffect, useRef, useState } from "react"
import ScoreStorm, { EventType, InteractionEvent, Score, GraphicalClef } from "@score-storm/core"
// import Renderer from "@score-storm/svg-renderer"
import Renderer from "@score-storm/canvas-renderer"
import styles from "./App.module.css"
import Aside from "./Aside"

type ScoreStormContextValue = { scoreStorm: ScoreStorm }
export const ScoreStormContext = createContext<ScoreStormContextValue>({} as ScoreStormContextValue)

export default function App() {
  const theme = useMantineTheme()
  const rootElementRef = useRef(null)
  const scoreStorm = useRef<ScoreStorm>()
  const [ssInitialized, setSSInitialized] = useState(false)

  const handleClick = (event: InteractionEvent) => {
    if (event.object instanceof GraphicalClef) {
      scoreStorm.current!.getScore().setClef()
      scoreStorm.current!.render()
    }
  }

  console.log("scoreStorm", scoreStorm.current)

  useEffect(() => {
    if (!rootElementRef.current) {
      return
    }
    scoreStorm.current! = new ScoreStorm({
      scale: 80,
      editor: { enable: true, styles: { hoverColor: theme.colors.blue[6] } },
    })
    scoreStorm.current!.setEventListener(EventType.CLICK, handleClick)
    scoreStorm.current!.setRenderer(new Renderer(rootElementRef.current))

    const score = Score.createQuickScore({ numberOfMeasures: 1, timeSignature: { count: 4, unit: 4 } })
    scoreStorm.current!.setScore(score)
    scoreStorm.current!.render()

    // setSSInitialized(true)

    return () => {
      // destroy on unmount
      scoreStorm.current!.destroy()
    }
  }, [rootElementRef, theme])

  return (
    <AppShell
      aside={{ width: { base: 210, sm: 210, md: 300 }, breakpoint: "xs", collapsed: { desktop: false, mobile: false } }}
      padding="xl"
    >
      <AppShell.Main>
        <div id="ss-container" ref={rootElementRef} />
      </AppShell.Main>
      <AppShell.Aside className={styles.ssEditorAside} p="xl">
        {rootElementRef.current && (
          <ScoreStormContext.Provider value={{ scoreStorm: scoreStorm.current! }}>
            <Aside />
          </ScoreStormContext.Provider>
        )}
      </AppShell.Aside>
    </AppShell>
  )
}
