export class Logo {
  static logo: any
  static baseUrl = 'https://image.6-79.cn/foto/logo/'

  static staticConstructor() {
    let companies = [
      'Apple', 'Canon', 'Casio', 'Fujifilm', 'Huawei',
      'Leica', 'Meitu', 'Meizu', 'Nikon', 'Olympus',
      'Panasonic', 'Pentax', 'Ricoh', 'Samsung', 'Sony',
      'Tencent', 'Xiaomi',
    ]

    this.logo = {}
    for (let company of companies) {
      this.logo[company.toUpperCase()] = this.baseUrl + company + '.svg'
    }
  }

  static getLogoPath(company: string | null) {
    if (!company) {
      return null
    }
    if (this.logo.hasOwnProperty(company.toUpperCase())) {
      return {
        url: this.logo[company.toUpperCase()],
        isUrl: true,
        alt: company,
      }
    }
    return company
  }
}

Logo.staticConstructor()
