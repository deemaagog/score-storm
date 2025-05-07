import { useContext, useEffect, useLayoutEffect, useRef } from "react"
import { ScoreStormContext } from "../ScoreStormProvider"
// import Renderer from "@score-storm/svg-renderer"
import Renderer from "@score-storm/canvas-renderer"
import { Cursor } from "./Cursor"
import styles from "./Score.module.css"
import { debounce } from "../utils"

export const Score = () => {
  const rootElementRef = useRef<HTMLDivElement>(null)
  const rootElementRefWidth = useRef<number | null>(null)
  const { scoreStorm } = useContext(ScoreStormContext)

  useEffect(() => {
    scoreStorm.setRenderer(new Renderer(rootElementRef.current!))
    scoreStorm.render()
  }, [])

  useLayoutEffect(() => {
    if (rootElementRef.current) {
      rootElementRefWidth.current = rootElementRef.current.clientWidth
    }
  }, [])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      debounce((entries) => {
        const newWidth = Math.round(entries[0].contentRect.width)
        if (newWidth === rootElementRefWidth.current) {
          return
        }
        rootElementRefWidth.current = newWidth
        scoreStorm.setRenderer(new Renderer(rootElementRef.current!)) //TODO: this needs to be revisited
        scoreStorm.render()
      }, 250),
    )

    resizeObserver.observe(rootElementRef.current!)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={rootElementRef}>
        <Cursor />
      </div>
    </div>
  )
}
