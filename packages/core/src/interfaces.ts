export interface Renderer {
  containerWidth: number
  isInitialized: boolean

  init(): void

  prepare(height: number, fontSize: number): void

  clear(): void

  destroy(): void

  setColor(color: string): void

  drawRect(x: number, y: number, width: number, height: number): void

  drawGlyph(glyph: string | number, x: number, y: number): void
}
