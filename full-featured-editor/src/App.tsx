import "@mantine/core/styles.css"
import "./App.css"
import { AppShell } from "@mantine/core"
import Aside from "./Aside"

import styles from "./App.module.css"
import Container from "./Container"

export default function App() {
  console.log("App render")

  return (
    <AppShell
      aside={{ width: { base: 210, sm: 210, md: 300 }, breakpoint: "xs", collapsed: { desktop: false, mobile: false } }}
      padding="xl"
    >
      <AppShell.Main>
        <Container />
      </AppShell.Main>
      <AppShell.Aside className={styles.ssEditorAside} p="xl">
        <Aside />
      </AppShell.Aside>
    </AppShell>
  )
}
