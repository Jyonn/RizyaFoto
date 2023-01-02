import {ExifMap} from "../interface/exifMap";
import {Loader} from "../interface/loader";
import {Location} from "../interface/location";
import {Logo} from "./logo";

export class Exif {
  data: ExifMap
  location: Loader<Location>
  foto: any

  constructor(data: ExifMap, foto: any) {
    this.data = data
    this.foto = foto
    this.location = {loaded: false}
  }

  transformGPS(value: string): number {
    let DMS = value.split(',')
    let degree = Number.parseFloat(DMS[0])
    let minute = Number.parseFloat(DMS[1])
    let second = Number.parseFloat(DMS[2])
    return degree + minute / 60 + second / 3600
  }

  has(key: string) {
    return this.data.hasOwnProperty(key)
  }

  get(key: string) {
    if (this.has(key)) {
      return this.data[key].val
    }
    return null
  }

  getMake() {
    return Logo.getLogoPath(this.get('Make'))
  }

  getLensMake() {
    return Logo.getLogoPath(this.get('LensMake'))
  }

  getWidth() {
    return this.foto.width
  }

  getHeight() {
    return this.foto.height
  }

  getSize(): string {
    return this.getWidth() + ' x ' + this.getHeight()
  }

  formatTime(time: string | null): string {
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

  getTime() {
    return this.formatTime(this.get('DateTimeOriginal'))
  }

  get Latitude(): number | null {
    let GPSLatitude = this.get('GPSLatitude')
    let GPSLatitudeRef = this.get('GPSLatitudeRef')
    if (!GPSLatitude) {
      return null
    }
    let latitude = this.transformGPS(GPSLatitude)
    if (GPSLatitudeRef === 'S') {
      latitude *= -1
    }
    return latitude
  }

  get Longitude(): number | null {
    let GPSLongitude = this.get('GPSLongitude')
    let GPSLongitudeRef = this.get('GPSLongitudeRef')
    if (!GPSLongitude) {
      return null
    }
    let longitude = this.transformGPS(GPSLongitude)
    if (GPSLongitudeRef === 'W') {
      longitude *= -1
    }
    return longitude
  }

  getRawLocation(): [number, number] | null {
    let latitude = this.Latitude
    let longitude = this.Longitude
    if (latitude === null || longitude === null) {
      return null
    }
    return [latitude, longitude]
  }

  getLocation(): string | null {
    if (this.location.data) {
      if (this.location.data.principalSubdivision) {
        return this.location.data.principalSubdivision + ', ' + this.location.data.locality
      }
      return this.location.data.countryName + ', ' + this.location.data.locality
    }
    let location = this.getRawLocation()
    if (!location) {
      return null
    }
    return location[0].toFixed(2) + ', ' + location[1].toFixed(2)
  }

  getMetaSection(keys: Array<string>) {
    let methods = Object.getPrototypeOf(this)
    let info = []
    for (let key of keys) {
      let value
      if (methods.hasOwnProperty('get' + key)) {
        value = methods['get' + key].bind(this)()
      } else {
        value = this.get(key)
      }
      if (value) {
        info.push([key, value])
      }
    }
    return info
  }

  get fotoSection() {
    return this.getMetaSection(['Size', 'ColorSpace', 'Time', 'Location'])
  }

  get cameraSection() {
    return this.getMetaSection(['Make', 'Model', 'ISOSpeedRatings', 'ExposureTime'])
  }

  get lensSection() {
    return this.getMetaSection(['LensMake', 'LensModel', 'FocalLength', 'FocalLengthIn35mmFilm', 'FNumber'])
  }

  get metaSection(): any {
    return [
      ['FOTO', this.fotoSection],
      ['CAMERA', this.cameraSection],
      ['LENS', this.lensSection],
    ]
  }
}
