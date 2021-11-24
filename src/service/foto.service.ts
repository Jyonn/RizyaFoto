import {Injectable} from "@angular/core";
import {Foto} from "../model/foto";
import {Parallel} from "../model/utils/parallel";
import {ApiService} from "./api.service";

@Injectable()
export class FotoService {
  constructor(
    private api: ApiService,
  ) {}

  async preLoadSquareWorker(foto: Foto): Promise<any> {
    if (foto.squareLoaded) {
      return
    }
    await foto.preLoad(Foto.TYPE_SQUARE, false)
  }

  async preLoadRotateWorker(foto: Foto): Promise<any> {
    if (foto.rotateLoaded) {
      return
    }
    await foto.preLoad(Foto.TYPE_ROTATE, false)
  }

  preLoad(fotos: Array<Foto>, handler: CallableFunction) {
    let parallel = new Parallel(fotos, handler, 6)
    parallel.start().then()
  }

  preLoadExif(fotos: Array<Foto>) {
    let parallel = new Parallel(fotos, this.api.getExif.bind(this.api), 6)
    parallel.start().then()
  }
}
