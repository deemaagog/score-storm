// monkey patching mnxconverter score model

import { Bar, Score } from "mnxconverter"

declare module "mnxconverter" {
  interface Score {
    addBar(): void
  }
}

Score.prototype.addBar = function () {
  console.log("this.bars", this.bars)
  this.bars.push(new Bar(this, this.bars.length))
}
