import React, { useEffect, useRef, useState } from "react"
import ScoreStorm from "@score-storm/core"
import CanvasRenderer from "@score-storm/canvas-renderer"
import basicMusicXml from "./musicxml/basic"
import basicAccidentalsMusicXml from "./musicxml/basic-accidentals"
import partsBasicMusicXml from "./musicxml/parts-basic"

const musicalXMLOptions = {
    "basic": basicMusicXml,
    "accidentals": basicAccidentalsMusicXml,
    "parts": partsBasicMusicXml
}


function Demo() {
    const rootElementRef = useRef(null)
    const [selectedMusicXml, setSelectedMusicXml] = useState("basic")

    const scoreStorm = useRef(new ScoreStorm())

    useEffect(() => {
        if (!rootElementRef.current) {
            return
        }

        scoreStorm.current.setRenderer(new CanvasRenderer(rootElementRef.current))

    }, [rootElementRef])

    useEffect(() => {
        if (!rootElementRef.current) {
            return
        }

        scoreStorm.current.fromMusicXML(musicalXMLOptions[selectedMusicXml])
        scoreStorm.current.render()

    }, [rootElementRef, selectedMusicXml])

    return (
        <div style={{ width: "100%" }}>
            <button style={{ marginRight: "16px" }}>+ Add bar</button>
            Music xml example:
            <select name="select" value={selectedMusicXml} onChange={e => setSelectedMusicXml(e.target.value)}>
                {Object.keys(musicalXMLOptions).map((key) => <option value={key}>{key}</option>)}
            </select>
            <div style={{ width: "100%", marginTop: "16px", border: "1px solid #efefef" }} ref={rootElementRef} />
        </div >
    )
}

export default Demo
