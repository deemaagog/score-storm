export interface ScoreStormSettings {
  scale: number
  debug?: {
    bBoxes: boolean
  }
  editor?: {
    enable: boolean
    styles: {
      hoverColor: string
      selectColor: string
    }
  }
}

const SCALE_TO_FONT_RATIO = 64 / 100
const NUMBER_OF_STAFF_LINES = 5 // hardcode for now

export class Settings {
  fontSize!: number
  unit!: number
  numberOfStaffLines!: number
  staffLineThickness!: number
  clefMargin!: number
  timeSignatureMargin!: number
  contentMargin!: number
  barLineThickness!: number
  barlineHeight!: number
  midStave!: number
  mainColor!: string
  staveLineColor!: string
  debug?: {
    bBoxes: boolean
  }
  editor!: {
    enable: boolean
    styles: {
      hoverColor: string
      selectColor: string
    }
  }

  constructor(options?: ScoreStormSettings) {
    const { scale = 100, editor, debug } = options || {}
    this.fontSize = scale * SCALE_TO_FONT_RATIO
    this.unit = this.fontSize / 4
    this.staffLineThickness = this.unit / 8
    this.barlineHeight = this.unit * 4 + this.staffLineThickness
    this.numberOfStaffLines = NUMBER_OF_STAFF_LINES
    this.clefMargin = 1
    this.timeSignatureMargin = 1
    this.contentMargin = 2
    this.barLineThickness = this.staffLineThickness * 1.2
    this.mainColor = "black"
    this.staveLineColor = "#666666"

    this.midStave = this.barlineHeight / 2
    // default editor settings
    this.editor = {
      enable: false,
      styles: {
        hoverColor: "royalblue",
        selectColor: "green",
      },
      ...editor,
    }
    this.debug = debug
  }
}
