import { FileButton, Flex, Stack, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useContext, useRef } from "react"
import { IconActivityHeartbeat, IconArticle, IconMathGreater, IconPlaylist, IconPlus } from "@tabler/icons-react"
import { fromMusicXML } from "@score-storm/musicxml-importer"
import { Measure } from "../palette/measure"
import { Note } from "../palette/note"
import { ScoreStormContext } from "../ScoreStormProvider"
import { AsideButton } from "./AsideButton"
import styles from "./Aside.module.css"

export const ASIDE_ACTIONS = [
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

export const Aside: React.FC<{
  activeAction: string
  handler: (action: string) => void
}> = ({ activeAction, handler }) => {
  const { scoreStorm } = useContext(ScoreStormContext)
  const fileInputRef = useRef<(() => void) | null>(null)

  const handleImport = (payload: File | null) => {
    console.log("handleImport", payload)
    if (!payload) {
      return
    }
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      const scoreXml = event.target!.result as string
      try {
        scoreStorm.setScore(fromMusicXML(scoreXml))
        scoreStorm.render()
      } catch (error) {
        console.error(error)
        notifications.show({
          title: "Something went wrong",
          message: error instanceof Error ? error.message : "Unknown error",
          color: "red",
          withBorder: true,
        })
      }
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current()
      }
    }
    fileReader.readAsText(payload)
  }

  return (
    <Flex role="aside" w="64px" h="100%" justify={"space-between"} direction={"column"} align={"center"}>
      <Stack className={styles.asideActions}>
        <FileButton onChange={handleImport} accept=".xml,.musicxml" resetRef={fileInputRef}>
          {(props) => <AsideButton Icon={IconPlus} label={"New"} {...props} active={false} />}
        </FileButton>
        {ASIDE_ACTIONS.map(({ icon: Icon, label }) => (
          <AsideButton
            key={label}
            Icon={Icon}
            label={label}
            onClick={() => handler(label)}
            active={activeAction === label}
          />
        ))}
      </Stack>
    </Flex>
  )
}
