import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from "@angular/core";
import {Foto} from "../model/foto";
import {ApiService} from "../service/api.service";
import {fromEvent, Subscription} from "rxjs";

@Component({
  styleUrls: ['homepage.component.less'],
  templateUrl: 'homepage.component.html',
})
export class HomePageComponent implements OnDestroy, AfterViewInit {
  fotos: Array<Foto>
  // foto?: Foto
  @ViewChild('homeContainer') container!: ElementRef

  _resizeSubscription!: Subscription;
  lastAppearTime: number;
  index: number = 0

  constructor(
    private api: ApiService,
  ) {
    this.fotos = []
    this.lastAppearTime = new Date().getTime()
  }

  ngAfterViewInit() {
    this.api.homepageGetter.observedBy(this.init.bind(this))
    this._resizeSubscription = fromEvent(window, 'resize')
      .subscribe(this.fitFotoSize.bind(this));
  }

  init(resp: any) {
    for (let foto of resp.fotos) {
      this.fotos.push(new Foto(foto, 'rotate'))
    }

    setInterval(() => {
      this.displayNextFoto()
    }, 100)

    this.fitFotoSize()
  }

  fitFotoSize() {
    let e = this.container.nativeElement as HTMLElement
    let width = e.offsetWidth, height = e.offsetHeight

    this.fotos.forEach(foto => foto.setFeasiblePinnedSize(width, height))
  }

  ngOnDestroy(): void {
    if (this._resizeSubscription) {
      this._resizeSubscription.unsubscribe();
    }
  }

  getOpacity(index: number): number {
    return Number(index === this.index)
  }

  displayNextFoto(compulsory = false) {
    let currentTime = new Date().getTime()
    if (this.fotos.length === 0) {
      return
    }
    if (currentTime - this.lastAppearTime >= 5000 || compulsory) {
      let nextIndex = (this.index + 1) % this.fotos.length
      if (this.fotos[nextIndex].loaded || compulsory) {
        this.index = nextIndex
        this.lastAppearTime = currentTime
      }
    }
  }
}
