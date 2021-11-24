import {Injectable} from "@angular/core";
import {RequestService} from "./utils/request.service";
import {Subscriber} from "../model/utils/subscriber";
import {Foto} from "../model/foto";
import {Exif} from "../model/exif";

@Injectable()
export class ApiService {
  homepageGetter: Subscriber
  albumGetter: Subscriber
  space: string

  constructor(
    private request: RequestService,
  ) {
    this.homepageGetter = new Subscriber()
    this.albumGetter = new Subscriber()
    this.space = 'rizya'
  }

  getHomePage() {
    this.request.get({url: '/', paramDict: {space: this.space}}).then((resp: any) => this.homepageGetter.subscribe(resp))
  }

  getAlbum(album: string) {
    return this.request.get({url: `/album`, paramDict: {album: album, space: this.space}})
  }

  getExif(foto: Foto) {
    if (foto.exif.loaded) {
      return new Promise(resolve => resolve(null))
    }

    return this.request.get({
      url: foto.sources.exif,
    }).then(exif => {
      foto.exif.loaded = true
      foto.exif.data = new Exif(exif, foto)
      this.getLocation(foto.exif.data).then()
    }).catch(_ => {
      foto.exif.loaded = true
      foto.exif.data = null
    })
  }

  getLocation(exif: Exif) {
    let location = exif.getRawLocation()
    if (!location) {
      return new Promise(resolve => resolve(null))
    }

    return this.request.get({
      url: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
      paramDict: {
        latitude: location[0],
        longitude: location[1],
        localityLanguage: 'en'
      }
    }).then(location => {
      exif.location.loaded = true
      exif.location.data = location
    })
  }
}
