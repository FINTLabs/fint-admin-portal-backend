import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { FintDialogService } from 'fint-shared-components';

import { IComponentHALPage, ICommonComponent } from 'app/api/ICommonComponent';

@Injectable()
export class CommonComponentService {
  base: string = '/api/components';
  constructor(private http: Http, private fintDialog: FintDialogService) { }

  all(): Observable<IComponentHALPage> {
    return this.http.get(this.base)
      .map(result => result.json())
      .catch(error => this.handleError(error));
  }

  get(uuid: string): Observable<ICommonComponent> {
    return this.http.get(this.base + '/' + uuid)
      .map(result => result.json())
      .catch(error => this.handleError(error));
  }

  save(model: ICommonComponent) {
    delete model.icon;
    if (!model.uuid) { delete model.dn; }

    // If exists, put - else post
    return (model.uuid ? this.http.put(this.base + '/' + model.uuid, model) : this.http.post(this.base, model))
      .map(item => item.json())
      .catch(error => this.handleError(error));
  }

  delete(model: ICommonComponent) {
    delete model.icon;
    return this.http.delete(this.base + '/' + model.uuid)
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.fintDialog.displayHttpError(error);
    return Observable.throw(error);
  }
}
