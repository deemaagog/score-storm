import { Group } from "@mantine/core"
import { useContext } from "react"
import { ScoreStormContext } from "../../ScoreStormProvider"
import { IconCopyPlus, IconSquarePlus, IconSquareX } from "@tabler/icons-react"
import { ActionButton } from "../ActionButton"
import {
  AddMeasureCommand,
  GraphicalNoteEvent,
  GraphicalRestEvent,
  RemoveMeasureCommand,
  CloneMeasureCommand,
} from "@score-storm/core"
import { SelectionContext } from "../../SelectionProvider"

export const ManagementGroup: React.FC = () => {
  const { scoreStorm, numberOfMeasures } = useContext(ScoreStormContext)
  const { selectedObject } = useContext(SelectionContext)

  const isBeatSelected = selectedObject instanceof GraphicalNoteEvent || selectedObject instanceof GraphicalRestEvent

  const handleAddMeasureClick = () => {
    scoreStorm.executeCommand(new AddMeasureCommand())
    scoreStorm.render()
  }

  const handleRemoveMeasureClick = () => {
    const score = scoreStorm.getScore()
    const numberOfMeasures = score.globalMeasures.length
    scoreStorm.executeCommand(new RemoveMeasureCommand({ index: numberOfMeasures - 1 }))
    scoreStorm.render()
  }

  const handleCloneMeasureClick = () => {
    const index = (selectedObject as GraphicalNoteEvent).noteEvent.measure.index
    scoreStorm.executeCommand(new CloneMeasureCommand({ index }))
    scoreStorm.render()
  }

  return (
    <Group>
      <ActionButton Icon={IconSquarePlus} onClick={handleAddMeasureClick} tooltip={"Add measure at the end"} />
      <ActionButton
        Icon={IconCopyPlus}
        onClick={handleCloneMeasureClick}
        tooltip={"Clone current measure"}
        disabled={!isBeatSelected}
      />
      {/* <ActionButton
        Icon={IconViewportWide}
        onClick={handleCloneMeasureClick}
        tooltip={"Insert empty measure before current"}
      /> */}
      <ActionButton
        Icon={IconSquareX}
        onClick={handleRemoveMeasureClick}
        tooltip={"Remove last measure"}
        disabled={numberOfMeasures === 1}
      />
    </Group>
  )
}
