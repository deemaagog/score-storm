import "@mantine/core/styles.css"
import "./App.css"
import { Button, AppShell, Stack, useMantineTheme } from "@mantine/core"
import { useEffect, useRef, useState } from "react"
import ScoreStorm, { EventType, InteractionEvent, Score, GraphicalClef } from "@score-storm/core"
// import Renderer from "@score-storm/svg-renderer"
import Renderer from "@score-storm/canvas-renderer"

export default function App() {
  const theme = useMantineTheme()
  const rootElementRef = useRef(null)
  const scoreStorm = useRef<ScoreStorm>()
  const [removeMeasureDisabled, setRemoveMeasureDisabled] = useState(true)

  const handleClick = (event: InteractionEvent) => {
    if (event.object instanceof GraphicalClef) {
      scoreStorm.current!.getScore().setClef()
      scoreStorm.current!.render()
    }
  }

  useEffect(() => {
    if (!rootElementRef.current) {
      return
    }
    scoreStorm.current! = new ScoreStorm({
      scale: 100,
      editor: { enable: true, styles: { hoverColor: theme.colors.blue[6] } },
    })
    scoreStorm.current!.setEventListener(EventType.CLICK, handleClick)
    scoreStorm.current!.setRenderer(new Renderer(rootElementRef.current))

    const score = Score.createQuickScore({ numberOfMeasures: 1, timeSignature: { count: 4, unit: 4 } })
    scoreStorm.current!.setScore(score)
    scoreStorm.current!.render()

    return () => {
      // destroy on unmount
      scoreStorm.current!.destroy()
    }
  }, [rootElementRef, theme])

  const updateRemoveMeasureDisabled = () => {
    const score = scoreStorm.current!.getScore()
    const numberOfMeasures = score.globalMeasures.length
    setRemoveMeasureDisabled(numberOfMeasures === 1)
  }

  const handleAddMeasureClick = () => {
    scoreStorm.current!.getScore().addMeasure()
    scoreStorm.current!.render()
    updateRemoveMeasureDisabled()
  }

  const handleRemoveMeasureClick = () => {
    const score = scoreStorm.current!.getScore()
    const numberOfMeasures = score.globalMeasures.length
    score.removeMeasure(numberOfMeasures - 1)
    scoreStorm.current!.render()
    updateRemoveMeasureDisabled()
  }

  return (
    <AppShell aside={{ width: 300, breakpoint: "md", collapsed: { desktop: false, mobile: true } }} padding="xl">
      <AppShell.Main>
        <div id="ss-container" ref={rootElementRef} />
      </AppShell.Main>
      <AppShell.Aside p="xl">
        <Stack bg="var(--mantine-color-body)" align="stretch" justify="center" gap="md">
          <Button onClick={handleAddMeasureClick}>+ Add measure</Button>
          <Button disabled={removeMeasureDisabled} onClick={handleRemoveMeasureClick}>
            - Remove measure
          </Button>
        </Stack>
      </AppShell.Aside>
    </AppShell>
  )
}
