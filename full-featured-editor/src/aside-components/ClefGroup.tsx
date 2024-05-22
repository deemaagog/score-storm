import { Group, Tooltip, ActionIcon } from "@mantine/core"
import { IconLetterG, IconLetterF } from "@tabler/icons-react"
import { useContext } from "react"
import { ScoreStormContext } from "../ScoreStormProvider"
import { SelectionContext, SelectionType } from "../SelectionProvider"

export const ClefGroup = () => {
  const { scoreStorm } = useContext(ScoreStormContext)
  const { type } = useContext(SelectionContext)

  const handleClefClick = () => {
    scoreStorm.getScore().setClef()
    scoreStorm.render()
  }

  if (type !== SelectionType.Clef) {
    return null
  }

  return (
    <Group>
      <Tooltip openDelay={1000} label="G Clef">
        <ActionIcon color="blue.9" bg={"blue.1"} size="xl" variant="white" onClick={handleClefClick}>
          <IconLetterG size={32} strokeWidth={1.2} />
        </ActionIcon>
      </Tooltip>

      <Tooltip openDelay={1000} label="F Clef">
        <ActionIcon color="blue.9" bg={"blue.1"} size="xl" variant="white" onClick={handleClefClick}>
          <IconLetterF size={32} strokeWidth={1.2} />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}
