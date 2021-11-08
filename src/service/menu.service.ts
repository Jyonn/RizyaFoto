import {Injectable} from "@angular/core";

@Injectable()
export class MenuService {
  menuText: string
  opening: boolean
  displayComponent: any

  constructor() {
    this.opening = false
    this.menuText = 'Menu'
    this.displayComponent = null
  }

  setDisplayComponent(component: any) {
    this.displayComponent = component
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
