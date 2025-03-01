import { Group } from "@mantine/core"
import { useContext } from "react"
import { ScoreStormContext } from "../../ScoreStormProvider"
import { SelectionContext } from "../../SelectionProvider"
import { GClefIcon } from "../icons/GClef"
import { FClefIcon } from "../icons/FClef"
import { ActionButton } from "../ActionButton"
import { GraphicalClef, ChangeClefCommand } from "@score-storm/core"

export const ClefGroup = () => {
  const { scoreStorm } = useContext(ScoreStormContext)
  const { selectedObject } = useContext(SelectionContext)

  const handleClefClick = () => {
    scoreStorm.executeCommand(new ChangeClefCommand())
    scoreStorm.render()
  }

  const isClef = selectedObject instanceof GraphicalClef

  const gClefActive = isClef && (selectedObject as GraphicalClef).clef.sign === "G"
  const fClefActive = isClef && (selectedObject as GraphicalClef).clef.sign === "F"

  return (
    <Group>
      <ActionButton
        Icon={GClefIcon}
        onClick={handleClefClick}
        disabled={!isClef}
        active={gClefActive}
        tooltip={"G Clef"}
      />
      <ActionButton
        Icon={FClefIcon}
        onClick={handleClefClick}
        disabled={!isClef}
        active={fClefActive}
        tooltip={"F Clef"}
      />
    </Group>
  )
}
