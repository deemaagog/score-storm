import React, { useEffect, useState } from "react"
import Loader from './Loader'

function FontLoader({ children }) {

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
                    alert("Failed to load Bravura font")
                })
        }
        loadFont()
    }, [])

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {fontLoaded ? (
                children
            ) : (
                <Loader />
            )}
        </div>
    )
}

export default FontLoader
