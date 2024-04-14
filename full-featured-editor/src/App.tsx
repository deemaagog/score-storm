import "@mantine/core/styles.css"
import "./App.css"
import { Button, AppShell, Stack, useMantineTheme } from "@mantine/core"
import { useEffect, useRef, useState } from "react"
import ScoreStorm, { Score } from "@score-storm/core"
import SvgRenderer from "@score-storm/svg-renderer"

export default function App() {
  const theme = useMantineTheme()
  const rootElementRef = useRef(null)
  const scoreStorm = useRef(
    new ScoreStorm({ scale: 100, editor: { enable: true, styles: { hoverColor: theme.colors.blue[6] } } }),
  )
  const [removeMeasureDisabled, setRemoveMeasureDisabled] = useState(true)

  useEffect(() => {
    if (!rootElementRef.current) {
      return
    }

    scoreStorm.current.setRenderer(new SvgRenderer(rootElementRef.current))

    const score = Score.createQuickScore({ numberOfMeasures: 1, timeSignature: { count: 4, unit: 4 } })
    scoreStorm.current.setScore(score)
    scoreStorm.current.render()
  }, [rootElementRef])

  const updateRemoveMeasureDisabled = () => {
    const score = scoreStorm.current.getScore()
    const numberOfMeasures = score.globalMeasures.length
    setRemoveMeasureDisabled(numberOfMeasures === 1)
  }

  const handleAddMeasureClick = () => {
    scoreStorm.current.getScore().addMeasure()
    scoreStorm.current.render()
    updateRemoveMeasureDisabled()
  }

  const handleRemoveMeasureClick = () => {
    const score = scoreStorm.current.getScore()
    const numberOfMeasures = score.globalMeasures.length
    score.removeMeasure(numberOfMeasures - 1)
    scoreStorm.current.render()
    updateRemoveMeasureDisabled()
  }

  return (
    <AppShell aside={{ width: 300, breakpoint: "md", collapsed: { desktop: false, mobile: true } }} padding="xl">
      <AppShell.Main>
        <div id="preload">.</div>
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
