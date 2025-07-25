import { CSSProperties, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ScoreStormContext } from "../ScoreStormProvider"
import { PlayerContext } from "../PlayerProvider"
import { useSettings } from "../SettingsProvider"
import CanvasRenderer from "@score-storm/canvas-renderer"
import { GlobalMeasure } from "@score-storm/core"

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
      const score = scoreStorm.getScore()
      const firstBeatPosition = score.globalMeasures[0].globalBeats[0].graphical.position!
      const initialY = score.globalMeasures[0].graphical.position!.y
      setCursorParams({
        x: firstBeatPosition.x,
        y: initialY,
        height: score.globalMeasures[0].graphical.height,
        width: scoreStorm.getSettings().unit,
      })

      const keyFrames: Keyframe[] = []
      let durationTotal = 0

      // two loops are needed because need to calculate total duration first
      for (const globalMeasure of score.globalMeasures) {
        for (const globalBeat of globalMeasure.globalBeats) {
          durationTotal += globalBeat.duration
        }
      }

      let offset = 0
      let previousY = 0
      let prevGlobalMeasure: GlobalMeasure
      let pageOffset = 0
      let previousPageOffset = 0

      const pages = score.graphical.pages

      for (let pi = 0; pi < pages.length; pi++) {
        pageOffset = pageElements[pi].offsetTop
        const page = pages[pi]
        for (let ri = 0; ri < page.rows.length; ri++) {
          const row = page.rows[ri]
          for (let gm = 0; gm < row.globalMeasures.length; gm++) {
            const globalMeasure = row.globalMeasures[gm]
            const currentY = globalMeasure.graphical.position!.y + pageOffset
            const isNewRow = previousY != 0 && previousY !== currentY

            for (let gb = 0; gb < globalMeasure.globalBeats.length; gb++) {
              const globalBeat = globalMeasure.globalBeats[gb]
              const translateX = globalBeat.graphical.position!.x - firstBeatPosition.x
              const translateY = currentY - initialY

              if (isNewRow && gb === 0) {
                const prevGlobalBeat = prevGlobalMeasure!.globalBeats[prevGlobalMeasure!.globalBeats.length - 1]
                const prevMeasureEndX =
                  prevGlobalMeasure!.graphical.position!.x +
                  prevGlobalMeasure!.graphical.width -
                  prevGlobalBeat.graphical.position!.x -
                  scoreStorm.getSettings().unit // minus barline width

                keyFrames.push({
                  transform: `translate(${prevGlobalBeat.graphical.position!.x - firstBeatPosition.x + prevMeasureEndX}px,${prevGlobalMeasure!.graphical.position!.y + (ri === 0 ? previousPageOffset : pageOffset) - initialY}px)`,
                  offset,
                })
                keyFrames.push({
                  transform: `translate(${translateX}px,${translateY}px) scaleY(${globalMeasure.graphical.height / score.globalMeasures[0].graphical.height})`,
                  offset,
                })
              } else {
                keyFrames.push({
                  transform: `translate(${translateX}px,${translateY}px) scaleY(${globalMeasure.graphical.height / score.globalMeasures[0].graphical.height})`,
                  offset,
                })
              }
              offset = offset + globalBeat.duration / durationTotal
            }
            prevGlobalMeasure = globalMeasure
            previousY = currentY
          }
        }
        previousPageOffset = pageOffset
      }

      // last beat
      // get X position of barline
      const lastMeasure = score.globalMeasures[score.globalMeasures.length - 1]
      const lastBeat = lastMeasure.globalBeats[lastMeasure.globalBeats.length - 1]
      const measureEndX =
        lastMeasure.graphical.position!.x +
        lastMeasure.graphical.width -
        lastBeat.graphical.position!.x -
        scoreStorm.getSettings().unit // minus barline width

      keyFrames.push({
        transform: `translate(${lastBeat.graphical.position!.x - firstBeatPosition.x + measureEndX}px,${lastMeasure.graphical.position!.y + pageOffset - initialY}px)`,
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
