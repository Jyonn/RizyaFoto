import {Foto} from "./foto";

export class Album {
  name: string
  fotos: Array<Foto>

  constructor(name: string, fotos: Array<Foto>) {
    this.name = name
    this.fotos = fotos
  }
}
