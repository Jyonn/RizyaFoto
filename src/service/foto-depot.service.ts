import {Injectable} from "@angular/core";
import {Foto} from "../model/foto";
import {Parallel} from "../model/utils/parallel";

@Injectable()
export class FotoDepotService {
  fotos: any
  albums: any

  constructor() {
    this.fotos = {}
    this.albums = {}
  }

  getAlbum(albumId: string): Array<Foto> | null {
    if (this.albums.hasOwnProperty(albumId)) {
      return this.albums[albumId]
    }
    return null
  }

  updateAlbum(albumId: string, fotos: Array<Foto>) {
    this.albums[albumId] = fotos
  }

  getFoto(rawFoto: any): Foto {
    let foto

    if (this.fotos.hasOwnProperty(rawFoto.foto_id)) {
      foto = this.fotos[rawFoto.foto_id]
      foto.update(rawFoto)
    } else {
      foto = new Foto(rawFoto)
      this.fotos[rawFoto.foto_id] = foto
    }
    return foto
  }

  async preLoadSquareWorker(foto: Foto): Promise<any> {
    if (foto.squareLoaded) {
      return
    }
    await foto.preLoad(Foto.TYPE_SQUARE)
  }

  async preLoadRotateWorker(foto: Foto): Promise<any> {
    if (foto.rotateLoaded) {
      return
    }
    await foto.preLoad(Foto.TYPE_ROTATE)
  }

  preLoad(fotos: Array<Foto>, handler: CallableFunction) {
    let parallel = new Parallel(fotos, handler, 6)
    parallel.start()
  }
}
