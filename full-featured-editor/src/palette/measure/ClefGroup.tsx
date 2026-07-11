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

  const isClef = selectedObject instanceof GraphicalClef
  const selectedGraphicalClef = isClef ? (selectedObject as GraphicalClef) : null

  const handleClefClick = () => {
    if (!selectedGraphicalClef) return
    scoreStorm.executeCommand(new ChangeClefCommand({ measure: selectedGraphicalClef.measure }))
    scoreStorm.render()
  }

  const gClefActive = !!selectedGraphicalClef && selectedGraphicalClef.sign === "G"
  const fClefActive = !!selectedGraphicalClef && selectedGraphicalClef.sign === "F"

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
