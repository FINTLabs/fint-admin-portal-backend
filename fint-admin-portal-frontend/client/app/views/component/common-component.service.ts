import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import {ApiBase} from 'app/api/ApiBase';
import {IComponentHALPage, ICommonComponent} from 'app/api/ICommonComponent';

@Injectable()
export class CommonComponentService extends ApiBase {

  constructor(private http: Http) {
    super();
  }

  all(): Observable<IComponentHALPage> {
    return this.http.get('/api/components')
      .map(result => result.json())
      .catch(this.handleError);
  }

  get(technicalName: string): Observable<ICommonComponent> {
    return this.http.get('/api/components/' + technicalName)
      .map(result => result.json())
      .catch(this.handleError);
  }
}
