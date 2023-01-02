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
    let intDay = Number.parseInt(day), intMonth = Number.parseInt(month), intDayR = intDay % 10
    if (intDayR == 1 && intDay != 11) {
      day += 'st'
    } else if (intDayR == 2 && intDay != 12) {
      day += 'nd'
    } else if (intDayR == 3 && intDay != 13) {
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
