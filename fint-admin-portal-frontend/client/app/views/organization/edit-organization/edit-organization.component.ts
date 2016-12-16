import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { OrganizationService } from '../organization.service';
import {IOrganization} from 'app/api/IOrganization';
import {IContact} from 'app/api/IContact';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {
  organizationForm: FormGroup;
  organization: IOrganization = <IOrganization>{};
  responsible: IContact[] = [];
  _selectedOrganization;
  get selectedOrganization() {
    return this._selectedOrganization;
  }
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
            this.createOrganisationForm();
          });

        // Get contact data
        organizationService.getContacts(params['orgId'])
          .subscribe(result => this.responsible = result._embedded.contactList);
      }
    });
  }

  ngOnInit() {
    this.createOrganisationForm();
  }

  createOrganisationForm() {
    this.organizationForm = this.fb.group({
      displayName: [this.organization.displayName, [Validators.required]],
      orgNumber: [this.organization.orgNumber, [Validators.required]],
      orgId: [this.organization.orgId, [Validators.required]]
    });
  }

  addContact() {
    let newContact = <IContact>{};
    newContact.isEditing = true;
    this.responsible.push(newContact);
  }

  contactChanged(contact: IContact) {
    if (!contact.firstName && !contact.lastName && !contact.mail && !contact.mobile && !contact.nin) {
      this.deleteContact(contact);
    }
  }

  deleteContact(contact: IContact) {
    let index = this.responsible.findIndex(cn => cn.nin === contact.nin);
    this.responsible.splice(index, 1);
  }

  save(model: IOrganization) {
    this.organizationService.save(model);
    this.router.navigate(['../']);
  }

  getMatchesFn() {
    let me = this;
    return function (items, currentValue: string, matchText: string) {
      if (!currentValue || currentValue.length < 2) {
        return items;
      }
      return me.organizationService.fetchRegistryOrgByName(currentValue);
    }
  }
}
