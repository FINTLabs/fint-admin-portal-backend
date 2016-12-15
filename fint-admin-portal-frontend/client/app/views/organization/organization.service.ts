import { Injectable } from '@angular/core';
import { Http, Request, Response, URLSearchParams, XSRFStrategy } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/throw';

import { ApiBase } from '../../api/ApiBase';

export interface IResponsible {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
export interface IOrganization {
  orgId: string;
  name: string;
  components: string[];
  responsible: IResponsible;
}
@Injectable()
export class OrganizationService extends ApiBase {

  constructor(private http: Http) {
    super();
  }

  all(): IOrganization[] {
    return [
      { orgId: '971045698', name: 'ROGALAND FYLKESKOMMUNE', components: [], responsible: { id: 111, firstName: '', lastName: '', email: '', phone: '' } },
      { orgId: '958935420', name: 'OSLO KOMMUNE', components: [], responsible: { id: 112, firstName: '', lastName: '', email: '', phone: '' } },
      { orgId: '938626367', name: 'HORDALAND FYLKESKOMMUNE', components: [], responsible: { id: 113, firstName: '', lastName: '', email: '', phone: '' } },
      { orgId: '960895827', name: 'VEST-AGDER FYLKESKOMMUNE', components: [], responsible: { id: 111, firstName: '', lastName: '', email: '', phone: '' } },
    ];
  }

  fetchOrganizationByName(filter: string) {
    let params = new URLSearchParams();
    params.set('page', '0');
    params.set('size', '100');
    params.set('$filter', 'startswith(navn,\'' + filter + '\') and (organisasjonsform eq \'FYLK\' or organisasjonsform eq \'KOMM\')');
    return this.http.get('//data.brreg.no/enhetsregisteret/enhet.json', { search: params })
      .map(items => items.json().data)
      .catch(this.handleError);
  }

  getOrganizationByOrgId(orgId: number) {
    let params = new URLSearchParams();
    params.set('page', '0');
    params.set('size', '100');
    params.set('$filter', 'organisasjonsnummer eq \'' + orgId + '\'');
    return this.http.get('//data.brreg.no/enhetsregisteret/enhet.json', { search: params })
      .map(items => items.json().data)
      .catch(this.handleError);
  }

  save(org: IOrganization) {

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
