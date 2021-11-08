export class Position {
  top: string
  left: string

  constructor(top: number, left: number) {
    this.top = top + 'px'
    this.left = left + 'px'
  }
}
