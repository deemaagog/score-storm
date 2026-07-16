import { CSSProperties, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ScoreStormContext } from "../ScoreStormProvider"
import { PlayerContext } from "../PlayerProvider"
import { useSettings } from "../SettingsProvider"
import CanvasRenderer from "@score-storm/canvas-renderer"

// Very basic cursor implementation.
// TODO: sync with audio timer

export const Cursor: React.FC = () => {
  const { isPlaying } = useContext(PlayerContext)
  const { scoreStorm } = useContext(ScoreStormContext)
  const { bpm } = useSettings()
  const [cursorParams, setCursorParams] = useState<{ x: number; y: number; height: number; width: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  // const animationRef = useRef<Animation | null>(null)

  // TODO: this obviously needs to be revisited
  useEffect(() => {
    if (isPlaying) {
      const pageElements = (scoreStorm.getRenderer() as CanvasRenderer).pages.map((page) => page.pageElement)
      const graphicalScore = scoreStorm.getGraphicalScore()!

      const firstGlobalMeasure = graphicalScore.globalMeasures[0]
      const firstGlobalBeat = firstGlobalMeasure.globalBeats[0]
      const firstBeatPosition = firstGlobalBeat.position!
      const initialY = firstGlobalMeasure.position!.y

      setCursorParams({
        x: firstBeatPosition.x,
        y: initialY,
        height: firstGlobalMeasure.height,
        width: scoreStorm.getSettings().unit,
      })

      const keyFrames: Keyframe[] = []
      let durationTotal = 0

      // two loops are needed because need to calculate total duration first
      for (const graphicalGlobalMeasure of graphicalScore.globalMeasures) {
        for (const graphicalGlobalBeat of graphicalGlobalMeasure.globalBeats) {
          durationTotal += graphicalGlobalBeat.globalBeat.duration
        }
      }

      let offset = 0
      let previousY = 0
      let prevGraphicalGlobalMeasure = firstGlobalMeasure
      let pageOffset = 0
      let previousPageOffset = 0

      const pages = graphicalScore.pages

      for (let pi = 0; pi < pages.length; pi++) {
        pageOffset = pageElements[pi].offsetTop
        const page = pages[pi]
        for (let ri = 0; ri < page.rows.length; ri++) {
          const row = page.rows[ri]
          for (let gm = 0; gm < row.globalMeasures.length; gm++) {
            const graphicalGlobalMeasure = row.globalMeasures[gm]
            const currentY = graphicalGlobalMeasure.position!.y + pageOffset
            const isNewRow = previousY != 0 && previousY !== currentY

            for (let gb = 0; gb < graphicalGlobalMeasure.globalBeats.length; gb++) {
              const graphicalGlobalBeat = graphicalGlobalMeasure.globalBeats[gb]
              const translateX = graphicalGlobalBeat.position!.x - firstBeatPosition.x
              const translateY = currentY - initialY

              if (isNewRow && gb === 0) {
                const prevGlobalBeats = prevGraphicalGlobalMeasure.globalBeats
                const prevGraphicalGlobalBeat = prevGlobalBeats[prevGlobalBeats.length - 1]
                const prevMeasureEndX =
                  prevGraphicalGlobalMeasure.position!.x +
                  prevGraphicalGlobalMeasure.width -
                  prevGraphicalGlobalBeat.position!.x -
                  scoreStorm.getSettings().unit // minus barline width

                keyFrames.push({
                  transform: `translate(${prevGraphicalGlobalBeat.position!.x - firstBeatPosition.x + prevMeasureEndX}px,${prevGraphicalGlobalMeasure.position!.y + (ri === 0 ? previousPageOffset : pageOffset) - initialY}px)`,
                  offset,
                })
                keyFrames.push({
                  transform: `translate(${translateX}px,${translateY}px) scaleY(${graphicalGlobalMeasure.height / firstGlobalMeasure.height})`,
                  offset,
                })
              } else {
                keyFrames.push({
                  transform: `translate(${translateX}px,${translateY}px) scaleY(${graphicalGlobalMeasure.height / firstGlobalMeasure.height})`,
                  offset,
                })
              }
              offset = offset + graphicalGlobalBeat.globalBeat.duration / durationTotal
            }
            prevGraphicalGlobalMeasure = graphicalGlobalMeasure
            previousY = currentY
          }
        }
        previousPageOffset = pageOffset
      }

      // last beat
      // get X position of barline
      const lastGraphicalGlobalMeasure = graphicalScore.globalMeasures[graphicalScore.globalMeasures.length - 1]
      const lastGlobalBeats = lastGraphicalGlobalMeasure.globalBeats
      const lastGraphicalGlobalBeat = lastGlobalBeats[lastGlobalBeats.length - 1]
      const measureEndX =
        lastGraphicalGlobalMeasure.position!.x +
        lastGraphicalGlobalMeasure.width -
        lastGraphicalGlobalBeat.position!.x -
        scoreStorm.getSettings().unit // minus barline width

      keyFrames.push({
        transform: `translate(${lastGraphicalGlobalBeat.position!.x - firstBeatPosition.x + measureEndX}px,${lastGraphicalGlobalMeasure.position!.y + pageOffset - initialY}px)`,
        offset: 1,
      })

      const quarterToBpm = 4 * (60 / bpm)
      console.log("keyFrames", keyFrames)

      ref.current?.animate(keyFrames, {
        duration: durationTotal * 1000 * quarterToBpm,
        easing: "linear",
        fill: "forwards",
        // delay: 1000,
      })
    } else {
      setCursorParams(null)
    }
  }, [scoreStorm, isPlaying, bpm])

  const cursorStyle = useMemo(() => {
    const basicStyle: CSSProperties = {
      position: "absolute",
      backgroundColor: "#1264a3",
      opacity: "0.5",
      transformOrigin: "top left",
    }
    if (cursorParams) {
      return {
        ...basicStyle,
        width: cursorParams.width + "px",
        height: cursorParams.height + "px",
        left: cursorParams.x + "px",
        top: cursorParams.y + "px",
      }
    } else {
      return {
        ...basicStyle,
        display: "none",
      }
    }
  }, [cursorParams])

  return <div ref={ref} style={cursorStyle} />
}
