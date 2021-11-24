export interface Location {
  latitude: number
  longitude: number
  continent: string
  continentCode: string
  countryName: string
  countryCode: string
  principalSubdivision: string
  principalSubdivisionCode: string
  city: string
  locality: string
  localityInfo: {
    administrative: Array<{
      order: number
      adminLevel: number
      name: string
      description: string
      isoName: string
      isoCode: string
      wikidataId: string
      geonameId: string
    }>
    informative: Array<{
      order: number
      name: string
      description: string
      isoCode: string
      wikidataId: string
      geonameId: string
    }>
  }
}
