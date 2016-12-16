import {IHAL} from './ApiBase';

export interface ICommonComponent {
  id: string;
  dn: string;
  displayName: string;
  technicalName: string;
  description: string;
  icon: string;
}
export interface IComponentHALPage extends IHAL {
  _embedded: {
    componentList: ICommonComponent[]
  }
}
