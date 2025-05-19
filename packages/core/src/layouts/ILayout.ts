export interface ILayout {
  getPageDimensions(containerWidth: number): {
    width: number
    height: number
  }
  // getPageMargins(): {
  //   top: number
  //   right: number
  //   bottom: number
  //   left: number
  // }
}
