import { Group, Tooltip } from "@mantine/core"
import { useContext } from "react"
import { ScoreStormContext } from "../../ScoreStormProvider"
import { SelectionContext } from "../../SelectionProvider"
import { GClefIcon } from "../icons/GClef"
import { FClefIcon } from "../icons/FClef"
import { ActionButton } from "../ActionButton"
import { GraphicalClef } from "@score-storm/core"

export const ClefGroup = () => {
  const { scoreStorm } = useContext(ScoreStormContext)
  const { selectedObject } = useContext(SelectionContext)

  const handleClefClick = () => {
    scoreStorm.getScore().setClef()
    scoreStorm.render()
  }

  const isClef = selectedObject instanceof GraphicalClef

  const gClefActive = isClef && (selectedObject as GraphicalClef).clef.sign === "G"
  const fClefActive = isClef && (selectedObject as GraphicalClef).clef.sign === "F"

  return (
    <Group>
      <Tooltip openDelay={1000} label="G Clef">
        <ActionButton Icon={GClefIcon} onClick={handleClefClick} disabled={!isClef} active={gClefActive} />
      </Tooltip>

      <Tooltip openDelay={1000} label="F Clef">
        <ActionButton Icon={FClefIcon} onClick={handleClefClick} disabled={!isClef} active={fClefActive} />
      </Tooltip>
    </Group>
  )
}
