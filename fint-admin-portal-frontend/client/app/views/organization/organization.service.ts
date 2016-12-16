import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/throw';

import {IOrgHALPage, IOrganization} from 'app/api/IOrganization';
import {ApiBase} from 'app/api/ApiBase';
import {IContactHALPage} from 'app/api/IContact';

@Injectable()
export class OrganizationService extends ApiBase {

  constructor(private http: Http) {
    super();
  }

  all(page: number = 1, pageSize?: number): Observable<IOrgHALPage> {
    let params = new URLSearchParams();
    params.set('page', page.toString());
    //params.set('pageSize', pageSize.toString());
    return this.http.get('/api/organisations', { search: params })
      .map(items => items.json())
      .catch(this.handleError);
  }

  get(orgId: string): Observable<IOrganization> {
    return this.http.get('/api/organisations/' + orgId)
      .map(item => item.json())
      .catch(this.handleError);
  }

  getContacts(orgId: string): Observable<IContactHALPage> {
    return this.http.get('/api/organisations/' + orgId + '/contacts')
      .map(item => item.json())
      .catch(this.handleError);
  }

  save(org: IOrganization) {
//    if (org.id) {
//      return this.http.put('/api/organisations')
//    }
//    return this.http.
  }

  // --------------------------
  // External calls
  // --------------------------
  fetchRegistryOrgByName(filter: string) {
    let params = new URLSearchParams();
    params.set('page', '0');
    params.set('size', '100');
    params.set('$filter', 'startswith(navn,\'' + filter + '\') and (organisasjonsform eq \'FYLK\' or organisasjonsform eq \'KOMM\')');
    return this.http.get('//data.brreg.no/enhetsregisteret/enhet.json', { search: params })
      .map(items => items.json().data)
      .catch(this.handleError);
  }

  fetchRegistryOrgByNumber(orgId: number) {
    let params = new URLSearchParams();
    params.set('page', '0');
    params.set('size', '100');
    params.set('$filter', 'organisasjonsnummer eq \'' + orgId + '\'');
    return this.http.get('//data.brreg.no/enhetsregisteret/enhet.json', { search: params })
      .map(items => items.json().data)
      .catch(this.handleError);
  }
}
