export class Url {
  static host = 'https://tools.6-79.cn/dev/api/arts/foto';

  private readonly url: string;
  private readonly fullUrl: string;
  readonly isLocalAPI: boolean;

  constructor(
    url: string
  ) {
    this.url = url;
    if (url.startsWith('/')) {
      this.fullUrl = Url.host + this.url;
      this.isLocalAPI = true;
    } else {
      this.fullUrl = this.url;
      this.isLocalAPI = false;
    }
  }

  getFullUrl(): string {
    return this.fullUrl;
  }
}
