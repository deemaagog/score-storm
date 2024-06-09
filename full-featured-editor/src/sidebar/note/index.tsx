import { Stack } from "@mantine/core"
import { CollapsibleGroup } from "../CollapsibleGroup"
import { AccidentalsGroup } from "./AccidentalsGroup"
import { TypeGroup } from "./TypeGroup"

export const Note: React.FC = () => {
  return (
    <Stack align="stretch" justify="center" gap="md">
      <CollapsibleGroup label="Change type">
        <TypeGroup />
      </CollapsibleGroup>
      <CollapsibleGroup label="Accidentals">
        <AccidentalsGroup />
      </CollapsibleGroup>
    </Stack>
  )
}
