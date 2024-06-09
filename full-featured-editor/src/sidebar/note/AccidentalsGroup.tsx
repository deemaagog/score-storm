import { useContext } from "react"
import { Group } from "@mantine/core"
import { IconHash, IconLetterX } from "@tabler/icons-react"
import { SelectionContext } from "../../SelectionProvider"
import { FlatIcon } from "../icons/Flat"
import { DoubleFlatIcon } from "../icons/DoubleFlat"
import { NaturalIcon } from "../icons/Natural"
import { ActionButton } from "../ActionButton"
import { GraphicalNoteEvent } from "@score-storm/core"
import { ScoreStormContext } from "../../ScoreStormProvider"

export const AccidentalsGroup: React.FC = () => {
  const { selectedObject } = useContext(SelectionContext)
  const { scoreStorm } = useContext(ScoreStormContext)

  const handleSetAccidental = (accidental?: number) => {
    const note = (selectedObject as GraphicalNoteEvent).noteEvent?.notes![0]
    scoreStorm.getScore().changeNoteAccidental(note, accidental)
    scoreStorm.render()
  }

  const accidentalsAvailable = selectedObject instanceof GraphicalNoteEvent

  let showAccidentals = false
  let alter: number | undefined

  if (accidentalsAvailable) {
    const firstNoteInEvent = (selectedObject as GraphicalNoteEvent).noteEvent?.notes![0]
    showAccidentals = !!firstNoteInEvent.accidentalDisplay?.show
    if (showAccidentals) {
      alter = firstNoteInEvent.pitch.alter || 0
    }
  }

  return (
    <Group>
      <ActionButton
        Icon={IconHash}
        disabled={!accidentalsAvailable}
        active={alter === 1}
        onClick={() => handleSetAccidental(1)}
      />
      <ActionButton
        Icon={FlatIcon}
        disabled={!accidentalsAvailable}
        active={alter === -1}
        onClick={() => handleSetAccidental(-1)}
      />
      <ActionButton
        Icon={NaturalIcon}
        disabled={!accidentalsAvailable}
        active={alter === 0}
        onClick={() => handleSetAccidental(0)}
      />
      <ActionButton
        Icon={IconLetterX}
        disabled={!accidentalsAvailable}
        active={alter === 2}
        onClick={() => handleSetAccidental(2)}
      />
      <ActionButton
        Icon={DoubleFlatIcon}
        disabled={!accidentalsAvailable}
        active={alter === -2}
        onClick={() => handleSetAccidental(-2)}
      />
    </Group>
  )
}
