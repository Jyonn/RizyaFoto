import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'fotoTime'})
export class FotoTimePipe implements PipeTransform {
  transform(time: string | null): string {
    if (!time) {
      return ''
    }
    let dateAndTime = time.split(' ')
    let date = dateAndTime[0].split(':')
    let year = date[0], month = date[1], day = date[2]
    let intDay = Number.parseInt(day) % 10, intMonth = Number.parseInt(month)
    if (intDay == 1) {
      day += 'st'
    } else if (intDay == 2) {
      day += 'nd'
    } else if (intDay == 3) {
      day += 'rd'
    } else {
      day += 'th'
    }
    month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'][intMonth]
    if (intMonth !== 5) {
      month += '.'
    }
    return day + ' ' + month + ', ' + year
  }
}
