---
sidebar_position: 2
---

# RN Skia

This is the most advanced solution, it's particularly suitable for rendering large scores since it has a good potential for optimization. It's based on high performant [React-Native-Skia](https://github.com/Shopify/react-native-skia)

A possible Renderer implementation could use OffScreen API and look like this:

```ts
import { matchFont, SkFont, Skia, SkPaint, SkSurface, SkTypefaceFontProvider } from "@shopify/react-native-skia"
import { EventManager, IGraphical, IRenderer, Settings } from "@score-storm/core"

class ReactNativeSkiaRenderer implements IRenderer {
  containerWidth: number
  isInitialized: boolean = false
  settings!: Settings
  eventManager!: EventManager
  fontManager!: SkTypefaceFontProvider
  font!: SkFont
  paint!: SkPaint
  surface: SkSurface | null = null

  constructor(width: number, fontManager: SkTypefaceFontProvider) {
    this.containerWidth = width
    this.fontManager = fontManager
    this.paint = Skia.Paint()
    this.paint.setColor(Skia.Color("black"))
  }

  init() {
    this.isInitialized = true
  }

  destroy() {
    this.isInitialized = false
  }

  preRender(height: number, fontSize: number) {
    const fontStyle = {
      fontFamily: "Bravura",
      fontWeight: "normal",
      fontSize,
    } as const

    this.font = matchFont(fontStyle, this.fontManager)

    const pd = PixelRatio.get()
    this.surface = Skia.Surface.MakeOffscreen(this.containerWidth * pd, height * pd)
    const canvas = this.surface.getCanvas()
    canvas.scale(pd, pd)
    canvas.drawColor(Skia.Color("white")) //background color
  }

  clear() {
    this.surface = null
  }

  postRender(): void {}

  setColor(color: string) {
    this.paint.setColor(Skia.Color(color))
  }

  drawRect(x: number, y: number, width: number, height: number) {
    this.surface!.getCanvas().drawRect({ x, y, width, height }, this.paint)
  }

  drawGlyph(glyph: string, x: number, y: number) {
    this.surface!.getCanvas().drawText(glyph, x, y, this.paint, this.font)
  }

  renderInGroup(graphicalObject: IGraphical, renderCallback: () => void) {
    renderCallback()
  }
}
```

:::info

This is not production ready code, there is a room for improvement. Also, this is not a complete implementation, it's just a starting point. You may need to implement editor part of the renderer, handle events, etc.

:::

A React-Native component that uses this renderer could look like this:

```jsx
import {
  Canvas,
  Image,
  useFonts,
} from '@shopify/react-native-skia';
const SSCanvas = ({ width }: { width: number }) => {

  const fontMgr = useFonts({
    Bravura: [require('../assets/fonts/Bravura.otf')],
  });

  const [isReady, setIsReady] = React.useState(false);
  const refSS = useRef<null | ScoreStorm>(null);
  useEffect(() => {
    if (!fontMgr) {
      return;
    }
    const scoreStorm = new ScoreStorm({ scale: 80 });

    scoreStorm.setRenderer(new ReactNativeSkiaRenderer(width, fontMgr));

    scoreStorm.setScore(
      Score.createQuickScore({
        numberOfMeasures: 1,
        timeSignature: { count: 4, unit: 4 },
      })
    );
    scoreStorm.render();

    refSS.current = scoreStorm;

    setIsReady(true);

    return () => {
      refSS.current!.destroy();
    };
  }, [fontMgr]);

  if (!fontMgr || !isReady) {
    return null;
  }

  const surface = (refSS.current!.getRenderer() as ReactNativeSkiaRenderer)
    .surface!;
  const image = surface.makeImageSnapshot().makeNonTextureImage();
  const imageWidth = surface.width() / PixelRatio.get();
  const imageHeight = surface.height() / PixelRatio.get();

  return (
    <Canvas style={{ flex: 1 }}>
        <Image
            image={image}
            x={0}
            y={0}
            width={imageWidth}
            height={imageHeight}
            fit="cover"
        />
    </Canvas>
  );
};
```
