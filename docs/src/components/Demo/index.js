import React, { useEffect, useRef, useState } from "react"
import ScoreStorm, { Score } from "@score-storm/core"
import CanvasRenderer from "@score-storm/canvas-renderer"
import SvgRenderer from "@score-storm/svg-renderer"
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
  const [selectedRenderer, setSelectedRenderer] = useState("canvas")

  const scoreStorm = useRef(new ScoreStorm())

  useEffect(() => {
    if (!rootElementRef.current) {
      return
    }

    scoreStorm.current.setRenderer(
      selectedRenderer === "canvas"
        ? new CanvasRenderer(rootElementRef.current)
        : new SvgRenderer(rootElementRef.current),
    )
    scoreStorm.current.render()
  }, [rootElementRef, selectedRenderer])

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

  const handleChangeRenderer = (e) => {
    setSelectedRenderer(e.target.value)
  }

  return (
    <div style={{ width: "100%" }}>
      <button style={{ marginRight: "16px" }} onClick={handleClickAddBar}>
        + Add bar
      </button>
      Music xml example:
      <select value={selectedMusicXml} onChange={(e) => setSelectedMusicXml(e.target.value)}>
        <option value={undefined}>No music xml (default)</option>
        {Object.keys(musicalXMLOptions).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <div>
        Renderer:
        <input
          type="radio"
          // name="renderer"
          value="canvas"
          id="canvas"
          checked={selectedRenderer === "canvas"}
          onChange={handleChangeRenderer}
        />
        <label htmlFor="canvas">Canvas</label>
        <input
          type="radio"
          // name="renderer"
          value="svg"
          id="svg"
          checked={selectedRenderer === "svg"}
          onChange={handleChangeRenderer}
        />
        <label htmlFor="svg">SVG</label>
      </div>
      <div style={{ marginTop: "16px", border: "1px solid #efefef", padding: "40px" }}>
        <div style={{ width: "100%" }} ref={rootElementRef} />
      </div>
    </div>
  )
}

export default Demo
