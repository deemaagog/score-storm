import React, { useEffect, useRef } from "react"
import ScoreStorm from "@score-storm/core"
import CanvasRenderer from "@score-storm/canvas-renderer"
import textXml from "./basic-musicxml"

function Demo() {
    const ref = useRef(null)


    useEffect(() => {
        if (!ref.current) {
            return
        }

        const scoreRenderer = new ScoreStorm()
        scoreRenderer.fromMusicXML(textXml)
        scoreRenderer.setRenderer(new CanvasRenderer(ref.current))
        scoreRenderer.render()

    }, [ref])

    return (
        <canvas height={"600px"} width={"600px"} ref={ref} />
    )
}

export default Demo
