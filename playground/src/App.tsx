import React, { useEffect, useRef, useState } from "react"
import "./App.css"
import ScoreRenderer from "@score-storm/core"
import textXml from "./basic-musicxml"

function App() {
  const ref = useRef<HTMLCanvasElement>(null)

  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        "Bravura",
        "url(https://cdn.jsdelivr.net/gh/steinbergmedia/bravura/redist/woff/Bravura.woff2) format(woff2)",
        {
          style: "normal",
          weight: "400",
          display: "swap",
        },
      )

      await font
        .load()
        .then((f) => {
          document.fonts.add(f)
          setFontLoaded(true)
        })
        .catch(() => {
          alert("Failed to load font")
        })
    }
    loadFont()
  }, [])

  useEffect(() => {
    if (!ref.current || !fontLoaded) {
      return
    }

    const scoreRenderer = new ScoreRenderer(ref.current).fromMusicXML(textXml)

    scoreRenderer.render()
  }, [ref, fontLoaded])

  return (
    <div className="App">
      <header className="App-header">
        {fontLoaded ? (
          <>
            <button>Add bar</button>
            <canvas height={"600px"} width={"600px"} ref={ref} />
          </>
        ) : (
          <div>Loading font...</div>
        )}
      </header>
    </div>
  )
}

export default App
