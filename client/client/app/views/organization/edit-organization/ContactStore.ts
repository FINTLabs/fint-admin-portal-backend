import { EmptyContact, IContact } from 'app/api/IContact';

export class ContactStore {
  _legalContact: IContact;
  get legalContact(): IContact {
    if (this._mergedContact) { return this._mergedContact; }
    if (!this._legalContact) { this._legalContact = this.getWhere('primaryLegal', true); }
    return this._legalContact;
  }
  set legalContact(value: IContact) {
    if (!this._mergedContact) {
      value.primaryLegal = true;
      value.primaryTechnical = false;
      this._legalContact = value;
    }
    else {
      this.mergedContact = value;
    }
  }

  _technicalContact: IContact;
  get technicalContact(): IContact {
    if (this._mergedContact) { return this._mergedContact; }
    if (!this._technicalContact) { this._technicalContact = this.getWhere('primaryTechnical', true); }
    return this._technicalContact;
  }
  set technicalContact(value: IContact) {
    if (!this._mergedContact) {
      value.primaryTechnical = true;
      value.primaryLegal     = false;
      this._technicalContact = value;
    }
    else {
      this.mergedContact = value;
    }
  }

  _mergedContact: IContact;
  get mergedContact(): IContact {
    return this._mergedContact;
  }
  set mergedContact(value: IContact) {
    value.primaryTechnical = true;
    value.primaryLegal = true;
    this._mergedContact = value;
  }

  private valueCache: IContact[];

  get value() {
    let val = [];
    if (this.mergedContact) { return [this.mergedContact]; }
    if (!this.legalContact['isEmpty'] || !(<EmptyContact>this.legalContact).isEmpty) {
      val.push(this.legalContact);
    }
    if (!this.technicalContact['isEmpty'] || !(<EmptyContact>this.technicalContact).isEmpty) {
      val.push(this.technicalContact);
    }
    return val;
  }

  set value(responsible: IContact[]) {
    console.log('Reset valueCache');
    this._technicalContact = null;
    this._legalContact = null;
    this.valueCache = responsible;

    if (JSON.stringify(this.legalContact) == JSON.stringify(this.technicalContact)) {
      this.mergedContact = JSON.parse(JSON.stringify(this.legalContact));
    }
  }

  constructor() {}

  public merge(flag: boolean, type?: string) {
    if (flag) {
      if (!type) { throw new Error('Cannot merge when you have not specified a type!'); }
      switch (type) {
        case 'legal':     this.mergedContact = JSON.parse(JSON.stringify(this.technicalContact)); break;
        case 'technical': this.mergedContact = JSON.parse(JSON.stringify(this.legalContact)); break;
      }
    }
    else {
      this._mergedContact = null;
      if (type) {
        if (JSON.stringify(this.technicalContact) == JSON.stringify(this.legalContact)) {
          // Drop one for an empty contact
          switch (type) {
            case 'legal':     this.legalContact = new EmptyContact({primaryLegal: true}); break;
            case 'technical': this.technicalContact = new EmptyContact({primaryTechnical: true}); break;
          }
        }
        else {
          // Switch places
          switch (type) {
            case 'legal':
              if (JSON.stringify(this.legalContact) == JSON.stringify(new EmptyContact({primaryLegal: true}))) {
                this.legalContact = this.technicalContact;
                this.technicalContact = new EmptyContact({primaryTechnical: true});
              }
              break;
            case 'technical':
              if (JSON.stringify(this.technicalContact) == JSON.stringify(new EmptyContact({primaryTechnical: true}))) {
                this.technicalContact = this.legalContact;
                this.legalContact = new EmptyContact({primaryLegal: true});
              }
              break;
          }
        }
      }
      this.technicalContact.primaryLegal = false;
      this.technicalContact.primaryTechnical = true;
      this.legalContact.primaryLegal = true;
      this.legalContact.primaryTechnical = false;
    }
  }

  private getWhere(property: string, value: any): IContact {
    let obj = {}; obj[property] = value; let empty = new EmptyContact(obj);
    if (!this.valueCache || !this.valueCache.length) { return empty; }

    let index = this.valueCache.findIndex(r => r[property] === value);
    return (index > -1 ? JSON.parse(JSON.stringify(this.valueCache[ index ])) : empty);
  }
}
