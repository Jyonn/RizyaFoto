import {Position} from "./position";

export class Foto {
  static TYPE_ROTATE = 0
  static TYPE_SQUARE = 1

  sources: {
    rotate: string
    origin: string
    square: string
    color: string
  }

  width: number
  height: number
  foto_id: string
  orientation: Array<any>
  album: string

  widthPx: string
  heightPx: string

  rotateLoaded: boolean = false
  squareLoaded: boolean = false

  position?: Position

  constructor({sources, width, height, foto_id, orientation, album}: Foto) {
    this.sources = sources
    this.width = width
    this.height = height
    this.foto_id = foto_id
    this.orientation = orientation
    this.album = album

    this.widthPx = '0px'
    this.heightPx = '0px'

    // this.preLoad()
  }

  update({sources, width, height, foto_id, orientation, album}: Foto) {
    this.album = album
  }

  get rotateUrl() {
    if (this.rotateLoaded) {
      return `url('${this.sources.rotate}')`
    }
    return ''
  }

  get squareUrl() {
    if (this.squareLoaded) {
      return `url('${this.sources.square}')`
    }
    return ''
  }

  get color() {
    return this.sources.color.replace('0x', '#')
  }

  setFeasiblePinnedSize(maxWidth: number, maxHeight: number, exportOnly: boolean): {width: number, height: number} | null {
    let wRatio = maxWidth / this.width
    let hRatio = maxHeight / this.height
    let width, height

    if (wRatio > hRatio) {
      width = hRatio * this.width
      height = maxHeight
    } else {
      height = wRatio * this.height
      width = maxWidth
    }

    if (exportOnly) {
      return {width, height}
    }

    this.widthPx = width + 'px'
    this.heightPx = height + 'px'
    return null
  }

  setFeasibleAlbumSize(size: number) {
    this.widthPx = this.heightPx = size + 'px'
  }

  async preLoad(type: number) {
    const image = new Image()

    if (type == Foto.TYPE_ROTATE) {
      image.src = this.sources.rotate
    } else {
      image.src = this.sources.square
    }

    return new Promise(resolve => {
      image.onload = () => {
        if (type === Foto.TYPE_ROTATE) {
          this.rotateLoaded = true
        } else {
          this.squareLoaded = true
        }
        resolve(null)
      };
    })
  }
}
