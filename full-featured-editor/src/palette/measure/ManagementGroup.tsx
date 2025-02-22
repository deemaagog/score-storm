import { Group } from "@mantine/core"
import { useContext, useState } from "react"
import { ScoreStormContext } from "../../ScoreStormProvider"
import { IconCopyPlus, IconSquarePlus, IconSquareX, IconViewportWide } from "@tabler/icons-react"
import { ActionButton } from "../ActionButton"

export const ManagementGroup: React.FC = () => {
  const { scoreStorm } = useContext(ScoreStormContext)

  const [removeMeasureDisabled, setRemoveMeasureDisabled] = useState(
    () => scoreStorm.getScore().globalMeasures.length === 1,
  )

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

  const handleCloneMeasureClick = () => {}

  return (
    <Group>
      <ActionButton Icon={IconSquarePlus} onClick={handleAddMeasureClick} tooltip={"Add measure at the end"} />
      <ActionButton Icon={IconCopyPlus} onClick={handleCloneMeasureClick} tooltip={"Clone current measure"} />
      <ActionButton
        Icon={IconViewportWide}
        onClick={handleCloneMeasureClick}
        tooltip={"Insert empty measure before current"}
      />
      <ActionButton
        Icon={IconSquareX}
        onClick={handleRemoveMeasureClick}
        tooltip={"Remove last measure"}
        disabled={removeMeasureDisabled}
      />
    </Group>
  )
}
