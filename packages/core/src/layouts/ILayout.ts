export enum PageHeightType {
  NumberOfRows = "NumberOfRows",
  //   WidthToHeightRatio = "WidthToHeightRatio",
}

// width is fixed, inherited from container for now

export interface ILayout {
  pageHeightType: PageHeightType
  heightValue: number
  //   margins: {
  //     top: number
  //     right: number
  //     bottom: number
  //     left: number
  //   }
}
