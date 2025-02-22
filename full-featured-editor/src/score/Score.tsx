import { useContext, useEffect, useRef } from "react"
import { ScoreStormContext } from "../ScoreStormProvider"
// import Renderer from "@score-storm/svg-renderer"
import Renderer from "@score-storm/canvas-renderer"
import { Cursor } from "./Cursor"
import styles from "./Score.module.css"

export const Score = () => {
  const rootElementRef = useRef<HTMLDivElement>(null)
  const { scoreStorm } = useContext(ScoreStormContext)

  useEffect(() => {
    scoreStorm.setRenderer(new Renderer(rootElementRef.current!))
    scoreStorm.render()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={rootElementRef}>
        <Cursor />
      </div>
    </div>
  )
}
