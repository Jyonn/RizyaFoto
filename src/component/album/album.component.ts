import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../service/api.service";
import {Foto} from "../../model/foto";
import {fromEvent, Subscription} from "rxjs";
import {FotoDepotService} from "../../service/foto-depot.service";
import {Position} from "../../model/position";
import {MenuService} from "../../service/menu.service";
import {DisplayComponent} from "../display/display.component";
import {FotoService} from "../../service/foto.service";
import {Album} from "../../model/album";

@Component({
  styleUrls: ['album.component.less'],
  templateUrl: 'album.component.html'
})
export class AlbumComponent implements OnInit, OnDestroy {
  album: Album
  @ViewChild('albumContainer') container!: ElementRef

  _resizeSubscription: Subscription

  displayedIndex?: number
  displayedElement?: any

  firstDisplayActivate: boolean
  displayComponent?: DisplayComponent

  inRendering: boolean
  fotoPerLine?: number

  constructor(
    private activateRoute: ActivatedRoute,
    private api: ApiService,
    private fotoDepot: FotoDepotService,
    private fotoService: FotoService,
    private menu: MenuService,
  ) {
    this.album = new Album('', [])
    this.firstDisplayActivate = false
    this.inRendering = false

    this._resizeSubscription = fromEvent(window, 'resize')
      .subscribe(this.fitFotoSize.bind(this, false));
  }

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      this.album.name = params.name;

      this.album.fotos = []
      this.firstDisplayActivate = false
      let fotos = this.fotoDepot.getAlbum(this.album.name)
      if (fotos) {
        this.album.fotos = fotos
      }
      this.api.getAlbum(this.album.name).then((resp: any) => {
        let updatedFotos = []
        for (let foto of resp.fotos) {
          updatedFotos.push(this.fotoDepot.getFoto(foto))
        }
        this.album.fotos = updatedFotos
        this.fitFotoSize(true)
        this.fotoDepot.updateAlbum(this.album.name, this.album.fotos)
        this.fotoService.preLoad(this.album.fotos, this.fotoService.preLoadSquareWorker)
        this.fotoService.preLoadExif(this.album.fotos)
      })
    })
  }

  fitFotoSize(init: boolean) {
    let e = this.container.nativeElement as HTMLElement
    // let width = e.offsetWidth, height = e.offsetHeight
    let size = e.offsetWidth - 20

    let baseSize = 240, baseMargin = 20
    this.fotoPerLine = Math.max(Math.floor(size / (baseSize + baseMargin)), 1)

    size = Math.floor(size / this.fotoPerLine) - baseMargin

    this.album.fotos.forEach(foto => foto.setFeasibleAlbumSize(size))
    if (!init) {
      setTimeout(() => {
        this._displayFoto(true)
      }, 500)
    }
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
    let foto = this.album.fotos[this.displayedIndex!]

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

      foto.preLoad(Foto.TYPE_ROTATE, true).then(_ => {
        this.scrollContainer(container, container.scrollTop, elementTop, resizeUpdate)
          .then(() => {
            foto!.position = new Position(top - container.scrollTop + elementTop, left)
            this.displayComponent!.display(this.displayedIndex!, resizeUpdate)
            this.inRendering = false
          })
      })
    }
  }

  displayFoto($event: Event, index: number) {
    if (!this.inRendering) {
      this.inRendering = true
    } else {
      return
    }
    if (!this.firstDisplayActivate) {
      this.firstDisplayActivate = true
      this.displayComponent = this.menu.displayComponent as DisplayComponent
      this.displayComponent.setAlbum(this.album)
      this.fotoService.preLoad(this.album.fotos, this.fotoService.preLoadRotateWorker)
    }

    this.displayedElement = $event.currentTarget as any
    this.displayedIndex = index

    this._displayFoto(false)
  }

  get gridColumn() {
    return `repeat(${this.fotoPerLine}, 1fr)`
  }
}
