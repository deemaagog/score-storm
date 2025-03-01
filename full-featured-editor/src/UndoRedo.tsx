import { useContext, useEffect, useState } from "react"
import { ScoreStormContext } from "./ScoreStormProvider"
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react"
import { ActionIcon, Group } from "@mantine/core"
import { EventType } from "@score-storm/core"

const UndoRedo = () => {
  const { scoreStorm } = useContext(ScoreStormContext)
  const [undoRedoState, setUndoRedoState] = useState({ undo: false, redo: false })

  useEffect(() => {
    scoreStorm.eventManager.on(EventType.UNDO_REDO_STATE_UPDATED, ({ undo, redo }) => {
      setUndoRedoState({ undo, redo })
    })
  }, [scoreStorm.eventManager])

  const handleUndo = () => {
    scoreStorm.undoCommand()
    scoreStorm.render()
  }

  const handleRedo = () => {
    scoreStorm.redoCommand()
    scoreStorm.render()
  }

  return (
    <Group>
      <ActionIcon
        variant="transparent"
        aria-label="Settings"
        onClick={handleUndo}
        bg={"rgba(255,255,255, 0.22)"}
        color="white"
        disabled={!undoRedoState.undo}
      >
        <IconArrowBackUp style={{ zIndex: 1000 }} role="button" cursor={"pointer"} />
      </ActionIcon>
      <ActionIcon
        variant="transparent"
        aria-label="Settings"
        onClick={handleRedo}
        bg={"rgba(255,255,255, 0.22)"}
        disabled={!undoRedoState.redo}
        color="white"
      >
        <IconArrowForwardUp style={{ zIndex: 1000 }} role="button" cursor={"pointer"} />
      </ActionIcon>
    </Group>
  )
}

export default UndoRedo
