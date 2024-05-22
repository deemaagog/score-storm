import { useContext } from "react"
import { ActionIcon, Group, Stack, Tooltip } from "@mantine/core"
import { IconLetterN, IconLetterR } from "@tabler/icons-react"
import { CollapsibleGroup } from "./CollapsibleGroup"
import { SelectionContext, SelectionType } from "../SelectionProvider"
import { ScoreStormContext } from '../ScoreStormProvider'
import { GraphicalNoteEvent } from '@score-storm/core/dist/graphical/GraphicalNoteEvent'

export const Note: React.FC = () => {
  const { scoreStorm } = useContext(ScoreStormContext)
  const { type, getSelectedObject } = useContext(SelectionContext)

  const handleClick = () => {
    scoreStorm.getScore().swithNoteType((getSelectedObject() as GraphicalNoteEvent).noteEvent)
    scoreStorm.render()
  }


  return (
    <Stack align="stretch" justify="center" gap="md">
      <CollapsibleGroup label="Change type">
        <Group>
          {type === SelectionType.Note && (
            <Tooltip label="Make current note rest">
              <ActionIcon color="blue.9" bg={"blue.1"} size="xl" variant="white" onClick={handleClick}>
                <IconLetterR size={32} strokeWidth={1.2} />
              </ActionIcon>
            </Tooltip>
          )}

          {type === SelectionType.Rest && (
            <Tooltip label="Remove current rest note">
              <ActionIcon color="blue.9" bg={"blue.1"} size="xl" variant="white" onClick={handleClick}>
                <IconLetterN size={32} strokeWidth={1.2} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </CollapsibleGroup>
    </Stack>
  )
}
