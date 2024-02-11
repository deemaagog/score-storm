import React, { useContext } from "react"
import { FontContext } from "@site/src/theme/Root"
import Loader from "./Loader"

function FontLoader({ children }) {
  const fontLoaded = useContext(FontContext)

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {fontLoaded ? children : <Loader />}
    </div>
  )
}

export default FontLoader
