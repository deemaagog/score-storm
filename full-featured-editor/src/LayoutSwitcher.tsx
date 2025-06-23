import { useContext, useEffect, useState } from "react"
import { ScoreStormContext } from "./ScoreStormProvider"
import { IconSeparatorHorizontal, IconFile } from "@tabler/icons-react"
import { ActionIcon, Group } from "@mantine/core"
import { FlowLayout, PageLayout } from "@score-storm/core"

const LayoutSwitcher = () => {
  const { scoreStorm } = useContext(ScoreStormContext)
  const [layout, setLayout] = useState("flow")

  useEffect(() => {}, [])

  const handleSetLayout = () => {
    scoreStorm.setLayout(layout === "flow" ? new PageLayout() : new FlowLayout())
    setLayout(layout === "flow" ? "page" : "flow")
    scoreStorm.render()
  }

  return (
    <Group>
      <ActionIcon
        variant="transparent"
        aria-label="Settings"
        onClick={handleSetLayout}
        bg={"rgba(255,255,255, 0.22)"}
        color="white"
        disabled={layout === "flow"}
      >
        <IconSeparatorHorizontal style={{ zIndex: 1000 }} role="button" cursor={"pointer"} />
      </ActionIcon>
      <ActionIcon
        variant="transparent"
        aria-label="Settings"
        onClick={handleSetLayout}
        bg={"rgba(255,255,255, 0.22)"}
        disabled={layout === "page"}
        color="white"
      >
        <IconFile style={{ zIndex: 1000 }} role="button" cursor={"pointer"} />
      </ActionIcon>
    </Group>
  )
}

export default LayoutSwitcher
