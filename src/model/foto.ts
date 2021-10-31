export class Foto {
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
  type: string

  loaded: boolean = false
  active: boolean = false

  constructor({sources, width, height, foto_id, orientation, album}: Foto, type: string) {
    this.sources = sources
    this.width = width
    this.height = height
    this.foto_id = foto_id
    this.orientation = orientation
    this.album = album

    this.widthPx = '0px'
    this.heightPx = '0px'
    this.type = type

    this.preLoad()
  }

  get defaultUrl() {
    return this.sources.rotate;
  }

  get backgroundUrl() {
    if (this.loaded) {
      return `url('${this.defaultUrl}')`
    }
    return ''
  }

  get color() {
    return this.sources.color.replace('0x', '#')
  }

  setFeasiblePinnedSize(maxWidth: number, maxHeight: number) {
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

    this.widthPx = width + 'px'
    this.heightPx = height + 'px'
  }

  setFeasibleAlbumSize(size: number) {
    this.widthPx = this.heightPx = size + 'px'
  }

  preLoad() {
    const image = new Image();

    image.src = this.defaultUrl;
    image.onload = () => {
      this.loaded = true
    };
  }
}
