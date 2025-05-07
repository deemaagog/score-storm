import { useContext, useEffect, useRef } from "react"
import { ScoreStormContext } from "../ScoreStormProvider"
// import Renderer from "@score-storm/svg-renderer"
import Renderer from "@score-storm/canvas-renderer"
import { Cursor } from "./Cursor"
import { debounce } from "../utils"
import styles from "./Score.module.css"

export const Score = () => {
  const rootElementRef = useRef<HTMLDivElement>(null)
  const { scoreStorm } = useContext(ScoreStormContext)

  useEffect(() => {
    scoreStorm.setRenderer(new Renderer(rootElementRef.current!))
    scoreStorm.render()
  }, [])

  // Add resize observer logic
  useEffect(() => {
    if (!rootElementRef.current) return
    let didInitial = false
    const debouncedRender = debounce(() => {
      scoreStorm.render()
    }, 100)
    const handleResize = () => {
      if (!didInitial) {
        didInitial = true
        return
      }
      debouncedRender()
    }
    const observer = new window.ResizeObserver(handleResize)
    observer.observe(rootElementRef.current)
    return () => {
      observer.disconnect()
    }
  }, [scoreStorm])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={rootElementRef}>
        <Cursor />
      </div>
    </div>
  )
}
