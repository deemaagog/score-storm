import { ILayout } from "./ILayout"

export class FlowLayout implements ILayout {
  getPageDimensions(containerWidth: number): { width: number; height: number } {
    return { width: containerWidth, height: Infinity }
  }
}
