import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import { Box, Flex, Group } from "@mantine/core"
import { useState } from "react"
import classes from "./App.module.css"
import { Score } from "./score/Score"
import { Player } from "./Player"
import { Aside, ASIDE_ACTIONS } from "./aside/Aside"
import { KeyboardHandler } from "./KeyboardHandler"
import { Palette } from "./palette/Palette"
import { useSettings } from "./SettingsProvider"
import UndoRedo from "./UndoRedo"
import LayoutSwitcher from "./LayoutSwitcher"

export const App = () => {
  const [activeAction, setActiveAction] = useState<string>(ASIDE_ACTIONS[0].label)
  const settings = useSettings()

  const handleClick = (action: string) => {
    setActiveAction(action)
  }

  return (
    <div className={classes.container}>
      <div className={classes.background} style={{ background: settings.background }} />
      <Flex w={"100%"} h={"100%"} direction={"column"} align={"center"} justify={"center"}>
        <header className={classes.header}>
          <Box className={classes.headerPlaceholder} />
          <Flex align={"center"} flex={1} gap={8} justify="space-between" mr={8}>
            <Player />
            <Group gap="xl">
              <UndoRedo />
              <LayoutSwitcher />
            </Group>
          </Flex>
        </header>
        <div className={classes.wrapper}>
          <Aside activeAction={activeAction} handler={handleClick} />
          <main className={classes.main}>
            <Palette activeAction={activeAction} />
            <Score />
          </main>
        </div>
        <footer className={classes.footer} />
      </Flex>
      <KeyboardHandler />
    </div>
  )
}
