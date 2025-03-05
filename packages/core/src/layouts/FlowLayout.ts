import { ILayout, PageHeightType } from "./ILayout"

type FlowLayoutParams = {
  heightValue?: number
}

export class FlowLayout implements ILayout {
  pageHeightType!: PageHeightType
  heightValue!: number

  constructor(params?: FlowLayoutParams) {
    this.pageHeightType = PageHeightType.NumberOfRows
    this.heightValue = params?.heightValue || Infinity
  }
}
