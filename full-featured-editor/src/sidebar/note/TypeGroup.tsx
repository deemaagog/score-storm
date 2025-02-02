import { useContext } from "react"
import { ActionIcon, Group, Tooltip } from "@mantine/core"
import { IconLetterN, IconLetterR } from "@tabler/icons-react"
import { SelectionContext } from "../../SelectionProvider"
import { ScoreStormContext } from "../../ScoreStormProvider"
import { GraphicalNoteEvent } from "@score-storm/core"
import { GraphicalRestEvent } from "@score-storm/core"

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
        <Tooltip label="Make current note rest">
          <ActionIcon color="blue.9" bg={"blue.1"} size="xl" variant="white" onClick={handleClick}>
            <IconLetterR size={32} strokeWidth={1.2} />
          </ActionIcon>
        </Tooltip>
      )}

      {selectedObject instanceof GraphicalRestEvent && (
        <Tooltip label="Remove current rest note">
          <ActionIcon color="blue.9" bg={"blue.1"} size="xl" variant="white" onClick={handleClick}>
            <IconLetterN size={32} strokeWidth={1.2} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  )
}
