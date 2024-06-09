import { ActionIcon, Group, Tooltip } from "@mantine/core"
import { useContext, useState } from "react"
import { ScoreStormContext } from "../../ScoreStormProvider"
import { IconColumnInsertLeft, IconColumnRemove } from "@tabler/icons-react"

export const ManagementGroup: React.FC = () => {
  const { scoreStorm } = useContext(ScoreStormContext)

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
    <Group>
      <Tooltip openDelay={1000} label="Add measure at the end">
        <ActionIcon color="blue.9" bg={"blue.1"} size="xl" variant="white" onClick={handleAddMeasureClick}>
          <IconColumnInsertLeft size={32} strokeWidth={1.2} />
        </ActionIcon>
      </Tooltip>

      {!removeMeasureDisabled && (
        <Tooltip openDelay={1000} label="Remove last measure">
          <ActionIcon color="blue.9" bg={"blue.1"} size="xl" variant="white" onClick={handleRemoveMeasureClick}>
            <IconColumnRemove size={32} strokeWidth={1.2} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  )
}
