import {Component, ElementRef, ViewChild} from "@angular/core";
import {Foto} from "../../model/foto";
import {Position} from "../../model/position";
import {MenuService} from "../../service/menu.service";
import {Album} from "../../model/album";

@Component({
  templateUrl: 'display.component.html',
  styleUrls: ['display.component.css'],
  selector: 'app-display',
})
export class DisplayComponent {
  album?: Album
  foto?: Foto | null
  position?: Position

  mask: boolean
  maskMeta: boolean

  top?: string
  left?: string
  width?: string
  height?: string
  borderWidth?: string;

  @ViewChild('displayContainer') container!: ElementRef

  constructor(
    private menu: MenuService,
  ) {
    this.mask = false
    this.maskMeta = false
    menu.setDisplayComponent(this)
  }

  setAlbum(album: Album) {
    this.album = album
  }

  displayHugeFotoSize() {
    let e: any = this.container.nativeElement as HTMLElement
    let width = e.offsetWidth, height = e.offsetHeight
    let size = this.foto?.setFeasiblePinnedSize(width, height, true)
    this.width = size!.width + 'px'
    this.height = size!.height + 'px'
    this.top = 'calc(100% - ' + size!.height + 'px)'
    this.left = 'calc(100% - ' + size!.width + 'px)'

    this.borderWidth = '0px';
  }

  displayNormalFotoSize() {
    let e: any = this.container.nativeElement as HTMLElement
    let left = 0, top = 0
    while (e) {
      left += e.offsetLeft
      top += e.offsetTop
      e = e.offsetParent
    }

    this.position = this.foto!.position

    this.top = (this.position!.top - top) + 'px'
    this.left = (this.position!.left - left) + 'px'
    this.width = this.foto!.widthPx
    this.height = this.foto!.heightPx
    this.borderWidth = '5px';
  }

  display(index: number, resizeUpdate: boolean) {
    if (resizeUpdate) {
      this.displayHugeFotoSize()
      return
    }
    this.foto = this.album!.fotos[index]

    this.displayNormalFotoSize()
    setTimeout(() => {
      this.displayHugeFotoSize()
      this.mask = true

      setTimeout(() => {
        this.maskMeta = true
      })
    }, 200)
  }

  hide() {
    this.displayNormalFotoSize()
    this.maskMeta = false
    setTimeout(() => {
      this.mask = false
      setTimeout(() => {
        this.foto = null
      }, 500)
    }, 500)
  }

  get opacity() {
    return this.mask ? '1' : '0'
  }

  get maskOpacity() {
    return this.maskMeta ? '1' : '0'
  }
}
