import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

export interface IHAL {
  _links: {
    self: {href: string};
    first: {href: string};
    last: {href: string};
    next: {href: string};
    prev: {href: string};
  },
  page: number;
  page_count: number;
  page_size: number;
  total_items: number;
}
export class ApiBase {
  protected handleError(error: Response | any): ErrorObservable {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      if (error.status === 404) {
        errMsg = `${error.status} - NOT FOUND!`
      } else {
        const body = error.json() || '';
        const err  = body.error || JSON.stringify(body);
        errMsg     = `${error.status} - ${error.statusText || ''} ${err}`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    //console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
