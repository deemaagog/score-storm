import { FileButton, Flex, Stack, Text } from "@mantine/core"
import { useContext } from "react"
import { IconActivityHeartbeat, IconArticle, IconMathGreater, IconPlaylist, IconPlus } from "@tabler/icons-react"
import { Score } from "@score-storm/core"
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
  const handleImport = (payload: File | null) => {
    if (!payload) {
      return
    }
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      const scoreXml = event.target!.result as string
      scoreStorm.setScore(Score.fromMusicXML(scoreXml))
      scoreStorm.render()
    }
    fileReader.readAsText(payload)
  }

  return (
    <Flex role="aside" w="64px" h="100%" justify={"space-between"} direction={"column"} align={"center"}>
      <Stack className={styles.asideActions}>
        <FileButton onChange={handleImport} accept=".xml,.musicxml">
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
