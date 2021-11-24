import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'fotoSize'})
export class FotoSizePipe implements PipeTransform {
  transform(size: Array<number>): string {
    return size[0] + ' x ' + size[1]
  }
}
