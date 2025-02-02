import { GlobalBeat } from "../model/GlobalBeat"

export class GraphicalGlobalBeat  {
  globalBeat: GlobalBeat
  offsetLeft: number = 0
  offsetRight: number = 0

  constructor(globalBeat: GlobalBeat) {
    this.globalBeat = globalBeat
    
  }

  setOffsets(offsetLeft: number, offsetRight: number) {
    this.offsetLeft = offsetLeft
    this.offsetRight = offsetRight
  }
}
