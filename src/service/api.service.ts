import {Injectable} from "@angular/core";
import {RequestService} from "./utils/request.service";
import {Subscriber} from "../model/utils/subscriber";

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
    this.space = 'default'
  }

  getHomePage() {
    this.request.get({url: '/', paramDict: {space: this.space}}).then((resp: any) => this.homepageGetter.subscribe(resp))
  }

  getAlbum(album: string) {
    return this.request.get({url: `/album`, paramDict: {album: album, space: this.space}})
  }
}
