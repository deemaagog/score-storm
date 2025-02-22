import { PropsWithChildren, useState } from "react"
import { Group, Collapse, UnstyledButton, rem, Title, Box } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import classes from "./CollapsibleGroup.module.css"

interface LinksGroupProps {
  label: string
}

export const CollapsibleGroup: React.FC<PropsWithChildren<LinksGroupProps>> = ({ label, children }) => {
  const [opened, setOpened] = useState(true)
  return (
    <Box>
      <UnstyledButton onClick={() => setOpened(!opened)} className={classes.control}>
        <Group onClick={() => setOpened(!opened)} justify="space-between" mb="xs" gap={0}>
          <Title c="rgba(18,42,89, 1)" order={5} fw={400}>
            {label}
          </Title>
          <IconChevronRight
            className={classes.chevron}
            stroke={2}
            style={{
              width: rem(20),
              height: rem(20),
              transform: opened ? "rotate(-90deg)" : "none",
            }}
            color="rgba(18,42,89, 1)"
          />
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>
        <div className={classes.content}>{children}</div>
      </Collapse>
    </Box>
  )
}
