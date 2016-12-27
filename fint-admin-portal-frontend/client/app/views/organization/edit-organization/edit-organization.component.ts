import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { OrganizationService } from '../organization.service';
import {IOrganization} from 'app/api/IOrganization';
import {IContact, EmptyContact} from 'app/api/IContact';
import {MdCheckboxChange} from '@angular/material';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {
  organizationForm: FormGroup;
  organization: IOrganization = <IOrganization>{};

  responsible: IContact[] = [];
  _legalContact: IContact = <IContact>{};
  get legalContact(): IContact {
    if (!this._legalContact) {
      let index          = this.responsible.findIndex(r => r.primaryLegal === true);
      let c              = index > -1 ? this.responsible[index] : <IContact>{};
      this._legalContact = c;
    }
    return this._legalContact;
  }
  set legalContact(c: IContact) {
    c.primaryLegal = true;
    let index = this.responsible.findIndex(r => r.primaryLegal === true);
    if (index > -1) {
      this.responsible[index] = c;
    } else {
      this.responsible.push(c);
    }
    this._legalContact = c;
  }

  _technicalContact: IContact = <IContact>{};
  get technicalContact(): IContact {
    if (!this._technicalContact) {
      let index              = this.responsible.findIndex(r => r.primaryTechnical === true);
      let c                  = index > -1 ? this.responsible[index] : <IContact>{};
      this._technicalContact = c;
    }
    return this._technicalContact;
  }
  set technicalContact(c: IContact) {
    c.primaryTechnical = true;
    let index = this.responsible.findIndex(r => r.primaryTechnical === true);
    if (index > -1) {
      this.responsible[index] = c;
    } else {
      this.responsible.push(c);
    }
    this._technicalContact = c;
  }

  _selectedOrganization;
  get selectedOrganization() { return this._selectedOrganization; }
  set selectedOrganization(value) {
    this._selectedOrganization = value;
    this.organizationForm.controls['displayName'].setValue(value.navn);
    this.organizationForm.controls['orgNumber'].setValue(value.organisasjonsnummer);
  }

  items = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private organizationService: OrganizationService
  ) {
    this.route.params.subscribe(params => {
      if (params['orgId']) {
        // Get organisation data
        organizationService.get(params['orgId'])
          .subscribe(organization => {
            this.organization = organization;
            this.organizationForm.setValue(organization);

            // Get contact data
            organizationService.getContacts(this.organization.id)
              .subscribe(result => {
                this._legalContact = new EmptyContact();
                this._technicalContact = new EmptyContact();
                this.responsible = result;
              });
          });
      }
    });

  }
  ngOnInit() {
    this.organizationForm = this.fb.group({
      dn         : [this.organization.dn],
      id         : [this.organization.id],
      displayName: [this.organization.displayName, [Validators.required]],
      orgNumber  : [this.organization.orgNumber, [Validators.required]],
      orgId      : [this.organization.orgId, [Validators.required]]
    });
  }

  save(model: IOrganization) {
    this.organizationService.save(model)
      .subscribe(result => {
        this.router.navigate(['../']);
      });
  }

  toggleMergeContact($event: MdCheckboxChange) {
    let legal = this.legalContact;
    if ($event.checked) {
      // Remove previous technical
      let index = this.responsible.findIndex(r => r.primaryTechnical === true);
      if (index > -1) {
        this.responsible.splice(index, 1);
      }

      // Set new technical
      legal.primaryTechnical = $event.checked;
      this.technicalContact = legal;
    }
    else {
      legal.primaryTechnical = $event.checked;
      this.technicalContact = new EmptyContact();
    }
  }

  getMatchesByNameFn() {
    let me = this;
    return function (items, currentValue: string, matchText: string) {
      if (!currentValue || currentValue.length < 2) {
        return items;
      }
      return me.organizationService.fetchRegistryOrgByName(currentValue);
    }
  }

  getMatchesByNumberFn() {
    let me = this;
    return function (items, currentValue: number, matchText: string) {
      if (!currentValue || currentValue.toString().length < 9) {
        return items;
      }
      return me.organizationService.fetchRegistryOrgByNumber(currentValue);
    }
  }
}
