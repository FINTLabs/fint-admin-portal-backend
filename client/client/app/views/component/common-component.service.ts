import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { FintDialogService } from 'fint-shared-components';

import { IComponentHALPage, ICommonComponent } from 'app/api';

@Injectable()
export class CommonComponentService {
  base = '/api/components';
  constructor(private http: Http, private fintDialog: FintDialogService) { }

  all(): Observable<IComponentHALPage> {
    return this.http.get(this.base)
      .map(result => result.json())
      .catch(error => this.handleError(error));
  }

  get(name: string): Observable<ICommonComponent> {
    return this.http.get(this.base + '/' + name)
      .map(result => result.json())
      .catch(error => this.handleError(error));
  }

  save(model: ICommonComponent) {
    delete model.icon;
    if (model.dn == null) { delete model.dn; }

    // If exists, put - else post
    return (model.dn ? this.http.put(this.base + '/' + model.name, model) : this.http.post(this.base, model))
      .map(item => item.json())
      .catch(error => this.handleError(error));
  }

  delete(model: ICommonComponent) {
    delete model.icon;
    return this.http.delete(this.base + '/' + model.name)
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.fintDialog.displayHttpError(error);
    return Observable.throw(error);
  }
}
