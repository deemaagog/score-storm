import "@mantine/core/styles.css"
import "./App.css"
import { Affix, AppShell, Drawer, Stack, Text, Title, Tooltip, UnstyledButton, rem } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconActivityHeartbeat, IconArticle, IconFile, IconMathGreater, IconPlaylist } from "@tabler/icons-react"
import classNames from "classnames"
import { useState } from "react"
import { Measure } from "./sidebar/measure"
import { Note } from "./sidebar/note"
import { File } from "./sidebar/file"
import styles from "./App.module.css"
import Container from "./Container"

const actions = [
  {
    label: "File",
    icon: IconFile,
    content: <File />,
  },
  {
    label: "Measure",
    icon: IconArticle,
    content: <Measure />,
  },
  {
    label: "Note",
    icon: IconPlaylist,
    content: <Note />,
  },
  {
    label: "Dynamics",
    icon: IconActivityHeartbeat,
    content: <Text>TBD</Text>,
  },
  {
    label: "Articulations",
    icon: IconMathGreater,
    content: <Text>TBD</Text>,
  },
]

export const App = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const [activeAction, setActiveAction] = useState<null | string>(null)

  const handleClick = (action: string) => {
    if (activeAction === action) {
      close()
      setActiveAction(null)
      return
    }
    setActiveAction(action)
    if (!opened) {
      open()
      return
    }
  }

  return (
    <>
      <AppShell
        aside={{
          width: 60,
          breakpoint: "",
          collapsed: { desktop: false, mobile: false },
        }}
        padding={{ md: "xl", xl: "xl", sm: "sm", xs: "sm", base: "sm" }}
      >
        <AppShell.Main>
          <Container />
        </AppShell.Main>
        <AppShell.Aside withBorder={false}></AppShell.Aside>
      </AppShell>
      <Drawer
        position="right"
        offset={64}
        radius="md"
        opened={opened}
        onClose={close}
        removeScrollProps={{ enabled: false }}
        size={300}
        withOverlay={false}
        className={styles.drawer}
        withCloseButton={false}
      >
        <Title c={"var(--mantine-color-blue-9)"} mb={"xl"} fw={800} order={2}>
          {activeAction}
        </Title>
        {activeAction && actions.find((a) => a.label === activeAction)?.content}
      </Drawer>
      <Affix position={{ bottom: "50%", right: 0 }} style={{ transform: "translateY(50%)" }}>
        <Stack className={classNames({ [styles.sidebarActions]: true, [styles.noShadows]: opened })}>
          {actions.map(({ icon: Icon, ...action }) => (
            <Tooltip label={action.label} position="left" openDelay={500} key={action.label}>
              <UnstyledButton
                onClick={() => handleClick(action.label)}
                className={styles.actionButton}
                data-active={activeAction === action.label || undefined}
              >
                <Icon style={{ width: rem(24), height: rem(24) }} stroke={1.7} />
              </UnstyledButton>
            </Tooltip>
          ))}
        </Stack>
      </Affix>
    </>
  )
}
