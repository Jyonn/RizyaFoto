import {Injectable} from "@angular/core";

@Injectable()
export class MenuService {
  menuText: string
  opening: boolean

  constructor() {
    this.opening = false
    this.menuText = 'Menu'
  }

  closeMenu() {
    this.opening = false
    this.menuText = 'Menu'
  }

  openMenu() {
    this.opening = true
    this.menuText = 'Close'
  }

  toggleMenu() {
    if (this.opening) {
      this.closeMenu()
    } else {
      this.openMenu()
    }
  }
}
