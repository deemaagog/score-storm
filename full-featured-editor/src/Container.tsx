import { useContext, useEffect, useRef } from "react"
import { ScoreStormContext } from "./ScoreStormProvider"
// import Renderer from "@score-storm/svg-renderer"
import Renderer from "@score-storm/canvas-renderer"

export default function Container() {
  const rootElementRef = useRef<HTMLDivElement>(null)
  const { scoreStorm } = useContext(ScoreStormContext)

  useEffect(() => {
    scoreStorm.setRenderer(new Renderer(rootElementRef.current!))
    scoreStorm.render()
  }, [])

  return <div id="ss-container" ref={rootElementRef} />
}
