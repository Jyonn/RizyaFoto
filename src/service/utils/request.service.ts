import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Url} from '../../model/utils/url';

@Injectable()
export class RequestService {
  constructor(
    public httpClient: HttpClient,
  ) {}

  preHandler(o: Observable<object>, urlObject: Url, preAnalyse: boolean): Promise<any> {
    if (urlObject.isLocalAPI && preAnalyse) {
      return o.toPromise()
        .then((r: any) => {
          if (r.identifier === 'OK') {
            return r.body;
          } else {
            return Promise.reject(r);
          }
        });
    }
    return o.toPromise();
  }

  get({url, paramDict = null, preAnalyse = true}: {url: string; paramDict?: any; preAnalyse?: boolean}): Promise<any> {
    paramDict = paramDict || {};

    const urlObject = new Url(url);
    const params = new HttpParams({fromObject: paramDict});

    return this.preHandler(
      this.httpClient.get(urlObject.getFullUrl(), {params}),
      urlObject,
      preAnalyse,
    );
  }
}
