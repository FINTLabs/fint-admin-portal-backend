import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MdCheckboxChange, MdDialogRef, MdDialog } from '@angular/material';
import { each } from 'lodash';

import { OrganizationService } from '../organization.service';
import { IOrganization } from 'app/api/IOrganization';
import { IContact, EmptyContact } from 'app/api/IContact';
import { ErrorComponent } from 'app/shared/dialogs/error/error.component';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {
  organizationForm: FormGroup;
  organization: IOrganization = <IOrganization>{};

  errorDialogRef: MdDialogRef<ErrorComponent>;

  responsible: IContact[] = [];
  _legalContact: IContact = <IContact>{};
  get legalContact(): IContact {
    if (!this._legalContact) {
      let index          = this.responsible.findIndex(r => r.primaryLegal === true);
      let c              = index > -1 ? this.responsible[index] : new EmptyContact();
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
      let c                  = index > -1 ? this.responsible[index] : new EmptyContact();
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
    private organizationService: OrganizationService,
    private dialog: MdDialog
  ) {
    this.route.params.subscribe(params => {
      if (params['id']) {
        // Get organisation data
        organizationService.get(params['id'])
          .subscribe(organization => {
            this.organization = organization;
            this.organizationForm.setValue(organization);

            // Get contact data
            organizationService.getContacts(this.organization.uuid)
              .subscribe(
                result => {
                  this._legalContact = null;
                  this._technicalContact = null;
                  this.responsible = result;
                },
                error => {
                  this.errorDialogRef = this.dialog.open(ErrorComponent);
                  this.errorDialogRef.componentInstance.errorSubtitle = 'Under lasting av organisasjonens kontakter';
                  this.errorDialogRef.componentInstance.errorMessage = error;
                });
          });
      }
    });
  }

  ngOnInit() {
    this.organizationForm = this.fb.group({
      dn         : [this.organization.dn],
      uuid       : [this.organization.uuid],
      displayName: [this.organization.displayName, [Validators.required]],
      orgNumber  : [this.organization.orgNumber, [Validators.required]],
      orgId      : [this.organization.orgId, [Validators.required]]
    });
  }

  save(model: IOrganization) {
    this.organizationService.save(model)
      .subscribe(result => {
        if (this.responsible.length) {
          // Save all contacts
          Promise.all(this.responsible.map((responsible: IContact) => {
            return this.organizationService.saveContact(result.uuid, responsible).toPromise();
          }))
            // Then return
            .then(result => {
              console.log('Contacts saved!');
              this.goBack();
            })
            .catch(error => {
              console.error(error);
              this.errorDialogRef = this.dialog.open(ErrorComponent);
              this.errorDialogRef.componentInstance.errorMessage = error;
            });
        } else { this.goBack(); }
      });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
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
