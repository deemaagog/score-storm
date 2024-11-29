---
sidebar_position: 3
---

# RN SVG

Unlike React-Native SKIA approach, this approach is based on native capabilities of rendering SVG primitives. It's based on [React-Native-SVG library](https://github.com/software-mansion/react-native-svg)

A possible Renderer implementation is shown below. It essentially builds a tree of react-native-svg components using React's CreateElement API. Then, the tree can be rendered in a React-Native component.

```ts
class ReactNativeSVGRenderer implements IRenderer {
  containerWidth: number
  isInitialized: boolean = false
  settings!: Settings
  eventManager!: EventManager

  svgElement: ReactElement | null = null
  childElements: ReactElement[] = []

  openedGroup: ReactElement | null = null
  openedGroupChildElements: ReactElement[] = []
  groupCounter: number = 0

  fontSize: number = 0
  currentColor!: string

  constructor(width: number) {
    this.currentColor = "black"
    this.containerWidth = width
  }

  init() {
    this.isInitialized = true
  }

  destroy() {
    this.isInitialized = false
  }

  preRender(height: number, fontSize: number) {
    this.fontSize = fontSize

    this.svgElement = React.createElement(
      Svg,
      {
        width: this.containerWidth,
        height,
      },
      this.childElements,
    )
  }

  clear() {
    this.childElements = []
    this.svgElement = null
  }

  postRender(): void {}

  setColor(color: string) {
    this.currentColor = color
  }

  drawRect(x: number, y: number, width: number, height: number) {
    this.childElements.push(
      React.createElement(Rect, {
        key: `${x}-${y}`,
        x,
        y,
        width,
        height,
        fill: this.currentColor,
      }),
    )
  }

  drawGlyph(glyph: string, x: number, y: number) {
    const collection = this.openedGroup ? this.openedGroupChildElements : this.childElements

    collection.push(
      React.createElement(
        Text,
        {
          key: `${x}-${y}`,
          fill: "currentColor",
          fontSize: this.fontSize,
          x,
          y,
          strokeWidth: 0,
          fontFamily: "Bravura",
        },
        glyph,
      ),
    )
  }

  renderInGroup(graphicalObject: IGraphical, renderCallback: () => void) {
    const group = React.createElement(
      G,
      {
        key: `group${this.groupCounter++}`,
        color: this.currentColor,
      },
      this.openedGroupChildElements,
    )

    this.childElements.push(group)
    this.openedGroup = group

    renderCallback()

    this.openedGroup = null
    this.openedGroupChildElements = []
  }
}
```

:::info

This is not production ready code, there is a room for improvement. Also, this is not a complete implementation, it's just a starting point. You may need to implement editor part of the renderer, handle events, etc.

:::

A React-Native component that uses this renderer could look like this:

```tsx
export const Example = ({ width }) => {
  const refSS = useRef<null | ScoreStorm>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const scoreStorm = new ScoreStorm({ scale: 80 })

    scoreStorm.setRenderer(new ReactNativeSVGRenderer(width))

    scoreStorm.setScore(
      Score.createQuickScore({
        numberOfMeasures: 16,
        timeSignature: { count: 4, unit: 4 },
      }),
    )
    scoreStorm.render()

    refSS.current = scoreStorm
    setIsMounted(true)

    return () => {
      refSS.current!.destroy()
    }
  }, [refRenderer.current])

  return <View>{isMounted && (refSS.current!.getRenderer() as ReactNativeSVGRenderer).svgElement}</View>
}
```
