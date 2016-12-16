import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
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
    let call = (model.id) ? this.http.put(this.base, model) : this.http.post(this.base, model); // If exists, put - else post
    return call.map(item => item.json()).catch(this.handleError);
  }
}
