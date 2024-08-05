import { Button, FileButton, Group } from "@mantine/core"
import { IconFileImport } from "@tabler/icons-react"
import React, { useContext } from "react"
import { ScoreStormContext } from "../../ScoreStormProvider"
import { Score } from "@score-storm/core"

export const File: React.FC = () => {
  const { scoreStorm } = useContext(ScoreStormContext)

  const hanldeImport = (payload: File | null) => {
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
    <>
      <Group justify="center">
        <FileButton onChange={hanldeImport} accept=".xml,.musicxml">
          {(props) => (
            <Button {...props} leftSection={<IconFileImport />}>
              Music XML
            </Button>
          )}
        </FileButton>
      </Group>
    </>
  )
}
