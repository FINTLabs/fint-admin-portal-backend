import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/throw';

import {ApiBase, IHAL} from '../../api/ApiBase';

export interface IContact {
  dn: string;                 // DN of the contact. This is automatically set.
  nin: string;                // National Idenitification Number (NIN). This would be fødselsnummer (11 digits)
  firstName: string;          // First name of the contact.
  lastName: string;           // Last name of the contact.
  mail: string;               // Internet email address for the contact.
  mobile: string;             // Mobile number of the contact. Should include landcode.
  orgId: string;              // OrgId of the organisation the contact is connected to.
  primaryTechnical: boolean;  // Indicates if the contact is the primary technical contact for the organisation.
  primaryLegal: boolean;      // Indicates if the contact is the primary legal contact for the organisation.
}
export interface IContactHALPage extends IHAL {
  _embedded: {
    contactList: IContact[]
  }
}
export interface IOrganization {
  dn;
  id: string;                 // Unique identifier for the organisation (UUID). This is automatically generated and should not be set.
  orgNumber: string;          // The organisation number from Enhetsregisteret (https://w2.brreg.no/enhet/sok/index.jsp)
  orgId: string;              // Id of the organisation. Should be the official domain of the organisation. For example rogfk.no
  displayName: string;        // The official name of the organisation. See Enhetsregisteret (https://w2.brreg.no/enhet/sok/index.jsp)
}
export interface IOrgHALPage extends IHAL {
  _embedded: {
    organisationList: IOrganization[]
  }
}
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
