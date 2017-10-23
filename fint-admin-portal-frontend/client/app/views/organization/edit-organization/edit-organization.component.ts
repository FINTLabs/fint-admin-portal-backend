import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { FintDialogService } from 'fint-shared-components';
import { OrganizationService } from '../organization.service';
import { IOrganization } from 'app/api/IOrganization';
import { IContact } from 'app/api/IContact';
import { ContactStore } from 'app/views/organization/edit-organization/ContactStore';
import {MatAutocompleteSelectedEvent, MatCheckboxChange} from '@angular/material';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {
  organizationForm: FormGroup;
  organization: IOrganization = <IOrganization>{};
  organizations = [];

  responsible: IContact[] = [];
  contactStore: ContactStore = new ContactStore();

  get legalContact(): IContact { return this.contactStore.legalContact; }
  set legalContact(c: IContact) { this.contactStore.legalContact = c; }

  get technicalContact(): IContact { return this.contactStore.technicalContact; }
  set technicalContact(c: IContact) { this.contactStore.technicalContact = c;  }


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
    private FintDialog: FintDialogService
  ) {
    this.route.params.subscribe(params => {
      if (params['id']) {
        // Get organisation data
        organizationService.get(params['id'])
          .subscribe(organization => {
            this.organization = organization;
            this.organizationForm.setValue(organization);

            // Get contact data
            organizationService.getContacts(this.organization.name)
              .subscribe(result => {
                this.responsible = result;
                this.contactStore.value = JSON.parse(JSON.stringify(this.responsible));
              });
          });
      }
    });
  }

  ngOnInit() {
    this.organizationForm = this.fb.group({
      dn:           [this.organization.dn],
      name:         [this.organization.name],
      displayName:  [this.organization.displayName, [Validators.required]],
      orgNumber:    [this.organization.orgNumber,   [Validators.required]],
      orgId:        [this.organization.orgId,       [Validators.required]],
      components:   [this.organization.components]
    });

    const nameCtrl = this.organizationForm.controls['displayName'];
    nameCtrl.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)  // Do not hammer http request. Wait until user has typed a bit
      .subscribe(v => this.organizationService.fetchRegistryOrgByName(v).subscribe(orgs => {
        this.organizations = orgs;
      }))
  }

  save(model: IOrganization) {
    this.organizationService.save(model)
      .subscribe(result => {
        if (this.contactStore.value.length) {
          // Save all contacts
          Promise.all(this.contactStore.value.map((responsible: IContact) => {
            return this.organizationService.saveContact(result.name, responsible).toPromise();
          }))
            // Then return
            .then(result => this.goBack())
            .catch(error => this.FintDialog.displayError('Error saving contacts', error));
        } else { this.goBack(); }
      });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  setSelectedOrganization(value: MatAutocompleteSelectedEvent) {
    this.organizationForm.controls['displayName'].setValue(value.option.value.navn);
    this.organizationForm.controls['orgNumber'].setValue(value.option.value.organisasjonsnummer);
  }

  toggleMergeContact($event: MatCheckboxChange, type: string) {
    this.contactStore.merge($event.checked, type);
  }

  getMatchesByNumberFn() {
    const me = this;
    return function (items, currentValue: number, matchText: string) {
      if (!currentValue || currentValue.toString().length < 9) {
        return items;
      }
      return me.organizationService.fetchRegistryOrgByNumber(currentValue);
    }
  }
}
