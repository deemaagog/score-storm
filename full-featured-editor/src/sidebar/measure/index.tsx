import { Stack } from "@mantine/core"
import { CollapsibleGroup } from "../CollapsibleGroup"
import { ClefGroup } from "./ClefGroup"
import { ManagementGroup } from './ManagementGroup'

export const Measure: React.FC = () => {

  return (
    <Stack align="stretch" justify="center" gap="md">
      <CollapsibleGroup label="Management">
        <ManagementGroup/>
      </CollapsibleGroup>
      <CollapsibleGroup label="Clef">
        <ClefGroup />
      </CollapsibleGroup>
    </Stack>
  )
}
