import { useContext } from "react"
import { Group } from "@mantine/core"
import { IconLetterN, IconLetterR } from "@tabler/icons-react"
import { SelectionContext } from "../../SelectionProvider"
import { ScoreStormContext } from "../../ScoreStormProvider"
import { GraphicalNoteEvent } from "@score-storm/core"
import { GraphicalRestEvent } from "@score-storm/core"
import { ActionButton } from "../ActionButton"

export const TypeGroup: React.FC = () => {
  const { scoreStorm } = useContext(ScoreStormContext)
  const { selectedObject } = useContext(SelectionContext)

  const handleClick = () => {
    const selectedBeat = (selectedObject as GraphicalNoteEvent).noteEvent
    selectedBeat.switchType()
    scoreStorm.render()
  }

  return (
    <Group>
      {selectedObject instanceof GraphicalNoteEvent && (
        <ActionButton Icon={IconLetterR} onClick={handleClick} tooltip={"Make current note rest"} />
      )}

      {selectedObject instanceof GraphicalRestEvent && (
        <ActionButton Icon={IconLetterN} onClick={handleClick} tooltip={"Make current rest note"} />
      )}
    </Group>
  )
}
