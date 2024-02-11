---
sidebar_position: 2
---

# Fonts

:::info

**Bravura font** can be downloaded from https://github.com/steinbergmedia/bravura/tree/master/redist

:::

Score-Storm is designed to work with any SMuFL-compliant font, but as for now only **Bravura Font** is supported

Library does not contain the font itself, it's up to developer to wire it up.
For instance, in browser environment, it can be done as follows:

```css
@font-face {
  font-family: Bravura;
  src: url(bravura.woff); // path to font
}
```

or using `FontFace` Api

```js
const font = new FontFace(
  "Bravura",
  "url(https://cdn.jsdelivr.net/gh/steinbergmedia/bravura/redist/woff/Bravura.woff2) format(woff2)", // cdn as an example, can be a local asset
  {
    style: "normal",
    weight: "400",
  },
)

font.load().then((bravuraFont) => {
  document.fonts.add(bravuraFont)
})
```

For non-browser environments, instructions can be found on renderers pages
