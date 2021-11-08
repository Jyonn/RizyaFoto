import {Component, ElementRef, ViewChild} from "@angular/core";
import {Foto} from "../../model/foto";
import {Position} from "../../model/position";
import {MenuService} from "../../service/menu.service";

@Component({
  templateUrl: 'display.component.html',
  styleUrls: ['display.component.css'],
  selector: 'app-display',
})
export class DisplayComponent {
  foto?: Foto | null
  position?: Position

  mask: boolean



  top?: string
  left?: string
  width?: string
  height?: string

  @ViewChild('displayContainer') container!: ElementRef

  constructor(
    private menu: MenuService,
  ) {
    this.mask = false
    menu.setDisplayComponent(this)
  }

  displayHugeFotoSize() {
    let e = this.container.nativeElement as HTMLElement
    let width = e.offsetWidth, height = e.offsetHeight

    let size = this.foto?.setFeasiblePinnedSize(width, height, true)
    this.width = size!.width + 'px'
    this.height = size!.height + 'px'
    this.top = 'calc(50% - ' + size!.height / 2 + 'px)'
    this.left = 'calc(50% - ' + size!.width / 2 + 'px)'
  }

  displayNormalFotoSize() {
    this.position = this.foto!.position

    this.top = this.position!.top
    this.left = this.position!.left
    this.width = this.foto!.widthPx
    this.height = this.foto!.heightPx
  }

  display(foto: Foto) {
    this.foto = foto
    this.displayNormalFotoSize()
    setTimeout(() => {
      this.displayHugeFotoSize()
      this.mask = true
    }, 500)
  }

  hide() {
    this.displayNormalFotoSize()
    this.mask = false
    setTimeout(() => {
      this.foto = null
    }, 500)
  }
}
