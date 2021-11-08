import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {Foto} from "../../model/foto";
import {fromEvent, Subscription} from "rxjs";
import {FotoDepotService} from "../../service/foto-depot.service";
import {Position} from "../../model/position";
import {MenuService} from "../../service/menu.service";
import {DisplayComponent} from "../display/display.component";

@Component({
  styleUrls: ['album.component.less'],
  templateUrl: 'album.component.html'
})
export class AlbumComponent implements OnInit, OnDestroy {
  name!: string
  fotos: Array<Foto>
  @ViewChild('albumContainer') container!: ElementRef

  _resizeSubscription: Subscription

  displayedFoto?: Foto
  displayedElement?: any

  activateRotatePreLoad: boolean

  constructor(
    private activateRoute: ActivatedRoute,
    private api: ApiService,
    private fotoDepot: FotoDepotService,
    private menu: MenuService,
  ) {
    this.fotos = []
    this.activateRotatePreLoad = false

    this._resizeSubscription = fromEvent(window, 'resize')
      .subscribe(this.fitFotoSize.bind(this));
  }

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      this.name = params.name;

      this.fotos = []
      let fotos = this.fotoDepot.getAlbum(this.name)
      if (fotos) {
        this.fotos = fotos
      }
      this.api.getAlbum(this.name).then((resp: any) => {
        let updatedFotos = []
        for (let foto of resp.fotos) {
          updatedFotos.push(this.fotoDepot.getFoto(foto))
        }
        this.fotos = updatedFotos
        this.fitFotoSize()
        this.fotoDepot.updateAlbum(this.name, this.fotos)
        this.fotoDepot.preLoad(this.fotos, this.fotoDepot.preLoadSquareWorker)
      })
    })
  }

  fitFotoSize() {
    let e = this.container.nativeElement as HTMLElement
    // let width = e.offsetWidth, height = e.offsetHeight
    let size = e.offsetWidth

    let baseSize = 240, baseMargin = 20
    let fotoPerLine = Math.max(Math.floor(size / (baseSize + baseMargin)), 1)

    size = Math.floor(size / fotoPerLine) - baseMargin

    this.fotos.forEach(foto => foto.setFeasibleAlbumSize(size))
    setTimeout(() => {
      this._displayFoto(true)
    }, 500)
  }

  ngOnDestroy() {
    if (this._resizeSubscription) {
      this._resizeSubscription.unsubscribe();
    }
  }

  async scrollContainer(container: Element, current: number, target: number, resizeUpdate: boolean) {
    let requiredMove
    let scrollPerStep

    if (resizeUpdate) {
      return new Promise(resolve => {
        container.scrollTo(0, target)
        return resolve(null)
      })
    }

    return new Promise(resolve => {
      let handler = setInterval(() => {
        requiredMove = current - target
        scrollPerStep = requiredMove / 50
        if (Math.abs(requiredMove) < 10) {
          container.scrollTo(0, target)
          clearInterval(handler)
          return resolve(null)
        } else {
          current -= scrollPerStep
          container.scrollTo(0, current)
        }
      }, 1)
    })
  }

  _displayFoto(resizeUpdate: boolean) {
    let element = this.displayedElement
    let foto = this.displayedFoto

    if (element && foto) {
      let container = element.offsetParent
      let left = element.offsetLeft, top = 0
      let elementTop = element.offsetTop
      element = container

      while (element) {
        left += element.offsetLeft
        top += element.offsetTop
        element = element.offsetParent
      }

      let component = this.menu.displayComponent as DisplayComponent

      foto.preLoad(Foto.TYPE_ROTATE).then(_ => {
        this.scrollContainer(container, container.scrollTop, elementTop, resizeUpdate)
          .then(() => {
            foto!.position = new Position(top - container.scrollTop + elementTop, left)
            component.display(foto!, resizeUpdate)
          })
      })
    }
  }

  displayFoto($event: Event, foto: Foto) {
    if (!this.activateRotatePreLoad) {
      this.activateRotatePreLoad = true
      this.fotoDepot.preLoad(this.fotos, this.fotoDepot.preLoadRotateWorker)
    }

    this.displayedElement = $event.currentTarget as any
    this.displayedFoto = foto

    this._displayFoto(false)
  }
}
