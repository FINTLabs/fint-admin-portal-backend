import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Http, Headers} from '@angular/http';
import {ApiBase} from 'app/api/ApiBase';
import {IComponentHALPage, ICommonComponent} from 'app/api/ICommonComponent';

@Injectable()
export class CommonComponentService extends ApiBase {
  base: string = '/api/components';
  constructor(private http: Http) {
    super();
  }

  all(): Observable<IComponentHALPage> {
    return this.http.get(this.base)
      .map(result => result.json())
      .catch(this.handleError);
  }

  get(technicalName: string): Observable<ICommonComponent> {
    return this.http.get(this.base + '/' + technicalName)
      .map(result => result.json())
      .catch(this.handleError);
  }

  save(model: ICommonComponent) {
    delete model.icon;
    let headers = new Headers();
    headers.append('x-fint-role', 'FINT_ADMIN_PORTAL');

    // If exists, put - else post
    let call = (model.id) ? this.http.put(this.base, model, { headers: headers}) : this.http.post(this.base, model, { headers: headers});
    return call.map(item => item.json()).catch(this.handleError);
  }
}
