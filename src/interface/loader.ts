export interface Loader<T> {
  loaded: boolean
  data?: T | null
}
