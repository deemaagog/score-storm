import { Button, Stack } from "@mantine/core"
import { useContext, useState } from "react"
import { ScoreStormContext } from "./ScoreStormProvider"

export default function Aside() {
  const { scoreStorm } = useContext(ScoreStormContext)

  console.log("scoreStorm", scoreStorm)
  const [removeMeasureDisabled, setRemoveMeasureDisabled] = useState(true)

  const updateRemoveMeasureDisabled = () => {
    const score = scoreStorm.getScore()
    const numberOfMeasures = score.globalMeasures.length
    setRemoveMeasureDisabled(numberOfMeasures === 1)
  }

  const handleAddMeasureClick = () => {
    scoreStorm.getScore().addMeasure()
    scoreStorm.render()
    updateRemoveMeasureDisabled()
  }

  const handleRemoveMeasureClick = () => {
    const score = scoreStorm.getScore()
    const numberOfMeasures = score.globalMeasures.length
    score.removeMeasure(numberOfMeasures - 1)
    scoreStorm.render()
    updateRemoveMeasureDisabled()
  }

  return (
    <Stack bg="var(--mantine-color-body)" align="stretch" justify="center" gap="md">
      <Button onClick={handleAddMeasureClick}>+ Add measure</Button>
      <Button disabled={removeMeasureDisabled} onClick={handleRemoveMeasureClick}>
        - Remove measure
      </Button>
    </Stack>
  )
}
