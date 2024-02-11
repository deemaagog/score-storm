/* eslint-disable no-undef */
import React, { useEffect, useState } from "react"

const fontName = "Bravura"
const fontCDN = "https://cdn.jsdelivr.net/gh/steinbergmedia/bravura/redist/woff/Bravura.woff2"
export const FontContext = React.createContext()

// swizzled Root
export default function Root({ children }) {
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(fontName, `url(${fontCDN}) format(woff2)`, {
        style: "normal",
        weight: "400",
      })

      try {
        const loadedFont = await font.load()
        document.fonts.add(loadedFont)
        setFontLoaded(true)
      } catch (error) {
        alert(`Failed to load ${fontName} font`)
      }
    }
    loadFont()
  }, [])
  return <FontContext.Provider value={fontLoaded}>{children}</FontContext.Provider>
}
