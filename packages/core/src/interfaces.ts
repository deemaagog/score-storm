export interface Renderer {
  prepare(height: number, fontSize: number): void

  setColor(color: string): void

  clear(): void

  drawRect(x: number, y: number, width: number, height: number): void

  drawGlyph(glyph: string | number, x: number, y: number): void

  containerWidth: number
}
