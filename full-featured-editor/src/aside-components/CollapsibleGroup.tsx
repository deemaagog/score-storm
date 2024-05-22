import { PropsWithChildren, useState } from "react"
import { Group,  Collapse,  UnstyledButton, rem, Title } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import classes from "./CollapsibleGroup.module.css"

interface LinksGroupProps {
  label: string
}

export const CollapsibleGroup: React.FC<PropsWithChildren<LinksGroupProps>> = ({ label, children }) => {
  const [opened, setOpened] = useState(true)
  return (
    <>
      <UnstyledButton onClick={() => setOpened(!opened)} className={classes.control}>
        <Group mb="xs" justify="space-between" gap={0}>
          <Title c="var(--mantine-color-blue-9)" order={4}>
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
            color="var(--mantine-color-blue-9)"
          />
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>
        <div className={classes.content}>{children}</div>
      </Collapse>
    </>
  )
}
