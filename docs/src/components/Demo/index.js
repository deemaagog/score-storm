import React, { useEffect, useRef, useState } from "react"
import ScoreStorm, { Score } from "@score-storm/core"
import CanvasRenderer from "@score-storm/canvas-renderer"
import basicMusicXml from "./musicxml/basic"
import basicAccidentalsMusicXml from "./musicxml/basic-accidentals"
import partsBasicMusicXml from "./musicxml/parts-basic"

const musicalXMLOptions = {
  basic: basicMusicXml,
  accidentals: basicAccidentalsMusicXml,
  parts: partsBasicMusicXml,
}

function Demo() {
  const rootElementRef = useRef(null)
  const [selectedMusicXml, setSelectedMusicXml] = useState()

  const scoreStorm = useRef(new ScoreStorm())

  useEffect(() => {
    if (!rootElementRef.current) {
      return
    }

    scoreStorm.current.setRenderer(new CanvasRenderer(rootElementRef.current))
    scoreStorm.current.render()
  }, [rootElementRef])

  useEffect(() => {
    if (!rootElementRef.current || !selectedMusicXml) {
      return
    }

    scoreStorm.current.setScore(
      musicalXMLOptions[selectedMusicXml]
        ? Score.fromMusicXML(musicalXMLOptions[selectedMusicXml])
        : Score.createDefaultScore(),
    )
    scoreStorm.current.render()
  }, [rootElementRef, selectedMusicXml])

  const handleClickAddBar = () => {
    scoreStorm.current.getScore().addMeasure()
    scoreStorm.current.render()
  }

  return (
    <div style={{ width: "100%" }}>
      <button style={{ marginRight: "16px" }} onClick={handleClickAddBar}>
        + Add bar
      </button>
      Music xml example:
      <select name="select" value={selectedMusicXml} onChange={(e) => setSelectedMusicXml(e.target.value)}>
        <option value={undefined}>No music xml (default)</option>
        {Object.keys(musicalXMLOptions).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <div style={{ marginTop: "16px", border: "1px solid #efefef", padding: "40px" }}>
        <div style={{ width: "100%" }} ref={rootElementRef} />
      </div>
    </div>
  )
}

export default Demo
