import React, { useEffect, useRef } from "react"
import ScoreRenderer from "@score-storm/core"
import textXml from "./basic-musicxml"

function Demo() {
    const ref = useRef(null)


    useEffect(() => {
        if (!ref.current) {
            return
        }

        const scoreRenderer = new ScoreRenderer(ref.current).fromMusicXML(textXml)

        scoreRenderer.render()
    }, [ref])

    return (
        <canvas height={"600px"} width={"600px"} ref={ref} />
    )
}

export default Demo
