import { ILayout } from "./ILayout"

export class PagedLayout implements ILayout {
  getPageDimensions(containerWidth: number) {
    // A4 ratio for now: 1.4142 : 1
    return { width: containerWidth, height: containerWidth * 1.4142 }
  }
}
