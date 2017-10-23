import { IHAL } from './IHAL';

export interface ICommonComponent {
  dn: string;
  name: string;           // Unique identifier for the component (UUID). This is automatically generated and should not be set
  displayName: string;    // Displayname of the component.
  description: string;    // A description of what the component does.
  organisations: any;
  clients: any;
  adapters: any;
  icon: string;
}
export interface IComponentHALPage extends IHAL {
  _embedded: {
    componentList: ICommonComponent[]
  }
}
