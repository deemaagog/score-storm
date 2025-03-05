import React, { useEffect, useRef } from "react"
import ScoreStorm, { FlowLayout, Score, TimeSignature } from "@score-storm/core"
import CanvasRenderer from "@score-storm/canvas-renderer"
import SvgRenderer from "@score-storm/svg-renderer"
import {fromMusicXML} from "@score-storm/musicxml-importer"

function Demo({ renderer = "canvas", musicXml = undefined, bordered = false, scale = 100 }) {
  const rootElementRef = useRef(null)

  const scoreStorm = useRef()

  useEffect(() => {
    if (!rootElementRef.current) {
      return
    }
    scoreStorm.current = new ScoreStorm({ scale /* debug: {bBoxes: true} */ })

    scoreStorm.current.setRenderer(
      renderer === "canvas" ? new CanvasRenderer(rootElementRef.current) : new SvgRenderer(rootElementRef.current),
    )
    scoreStorm.current.setLayout(new FlowLayout())

    const score = musicXml
      ? fromMusicXML(musicXml)
      : Score.createQuickScore({ numberOfMeasures: 3, timeSignature: new TimeSignature(4, 4) })
    scoreStorm.current.setScore(score)
    scoreStorm.current.render()
  }, [rootElementRef, musicXml, renderer])

  return (
    <div style={{ width: "100%", border: bordered ? "1px solid #efefef" : "none", padding: "40px 0" }}>
      <div style={{ width: "100%", lineHeight: 0 }} ref={rootElementRef} />
    </div>
  )
}

export default Demo
