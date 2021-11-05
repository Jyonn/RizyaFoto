import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../service/api.service";
import {Foto} from "../model/foto";
import {fromEvent, Subscription} from "rxjs";

@Component({
  styleUrls: ['album.component.less'],
  templateUrl: 'album.component.html'
})
export class AlbumComponent implements OnInit, OnDestroy {
  name!: string
  fotos: Array<Foto>
  @ViewChild('albumContainer') container!: ElementRef

  _resizeSubscription: Subscription;

  constructor(
    private activateRoute: ActivatedRoute,
    private api: ApiService,
  ) {
    this.fotos = []

    this._resizeSubscription = fromEvent(window, 'resize')
      .subscribe(this.fitFotoSize.bind(this));
  }

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      this.name = params.name;

      this.fotos = []
      this.api.getAlbum(this.name).then((resp: any) => {
        for (let foto of resp.fotos) {
          this.fotos.push(new Foto(foto, 'square'))
        }
        this.fitFotoSize()
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
  }

  ngOnDestroy() {
    if (this._resizeSubscription) {
      this._resizeSubscription.unsubscribe();
    }
  }
}
