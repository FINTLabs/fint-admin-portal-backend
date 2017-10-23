import {IHAL} from './IHAL';

export interface IOrganization {
  dn;
  name: string;                 // Unique identifier for the organisation (UUID). This is automatically generated and should not be set.
  orgNumber: string;          // The organisation number from Enhetsregisteret (https://w2.brreg.no/enhet/sok/index.jsp)
  orgId: string;              // Id of the organisation. Should be the official domain of the organisation. For example rogfk.no
  displayName: string;        // The official name of the organisation. See Enhetsregisteret (https://w2.brreg.no/enhet/sok/index.jsp)
  components;
}
export interface IOrgHALPage extends IHAL {
  _embedded: {
    organisationList: IOrganization[]
  }
}
