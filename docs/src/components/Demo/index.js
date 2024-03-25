import React, { useEffect, useRef } from "react"
import ScoreStorm, { Score } from "@score-storm/core"
import CanvasRenderer from "@score-storm/canvas-renderer"
import SvgRenderer from "@score-storm/svg-renderer"

function Demo({ renderer = "canvas", musicXml = undefined, bordered = false, scale = 100 }) {
  const rootElementRef = useRef(null)

  const scoreStorm = useRef(new ScoreStorm({scale}))

  useEffect(() => {
    if (!rootElementRef.current) {
      return
    }

    scoreStorm.current.setRenderer(
      renderer === "canvas" ? new CanvasRenderer(rootElementRef.current) : new SvgRenderer(rootElementRef.current),
    )
    
    scoreStorm.current.render()
  }, [rootElementRef, renderer])

  useEffect(() => {
    if (!rootElementRef.current) {
      return
    }

    scoreStorm.current.setScore(musicXml ? Score.fromMusicXML(musicXml) : Score.createDefaultScore())
    scoreStorm.current.render()
  }, [rootElementRef, musicXml])

  return (
    <div style={{ width: "100%", border: bordered ? "1px solid #efefef" : "none", padding: "40px 0" }}>
      <div style={{ width: "100%", lineHeight: 0 }} ref={rootElementRef} />
    </div>
  )
}

export default Demo
