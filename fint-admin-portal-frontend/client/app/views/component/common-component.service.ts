import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Response} from '@angular/http';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

export interface ICommonComponent {
  id: number;
  name: string;
  technicalName: string;
  description: string;
  icon: string;
  status: boolean;
}

@Injectable()
export class CommonComponentService {
  components: ICommonComponent[];
  constructor() {
    this.components = [
      { id: 0, name: 'Arbeidstaker', technicalName: '', description: '', icon: 'http://mhskkop.com/images/freshers.png', status: true },
      { id: 1, name: 'Variable transaksjoner', technicalName: '', description: '', icon: '', status: true },
      { id: 2, name: 'Elev', technicalName: '', description: '', icon: '', status: true },
      { id: 3, name: 'Undervisningsgrupper', technicalName: '', description: '', icon: '', status: false },
      { id: 4, name: 'Organisasjonsstruktur', technicalName: '', description: '', icon: '', status: true },
      { id: 5, name: 'Kodeverk', technicalName: '', description: '', icon: '', status: false }
    ];

  }
  all(): ICommonComponent[] {
    return this.components;
  }

  protected handleError(error: Response | any): ErrorObservable {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
