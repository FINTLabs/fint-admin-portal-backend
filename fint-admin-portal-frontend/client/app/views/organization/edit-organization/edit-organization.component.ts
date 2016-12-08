import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { IOrganization, OrganizationService } from '../../../api/organization.service';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {
  organizationForm: FormGroup;
  organization;
  _selectedOrganization;
  get selectedOrganization() {
    return this._selectedOrganization;
  }
  set selectedOrganization(value) {
    this._selectedOrganization = value;
    this.organizationForm.controls['name'].setValue(value.navn);
    this.organizationForm.controls['orgId'].setValue(value.organisasjonsnummer);
  }

  items = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private organizationService: OrganizationService
  ) {
    this.organization = <IOrganization>{ responsible: {} };
    this.route.params.subscribe(params => {
      let organizations = organizationService.all();
      if (params['orgId']) {
        let index = organizations.findIndex(org => org.orgId === params['orgId']);
        if (index > -1) {
          this.organization = organizations[index];
        }
      }
    });
  }

  ngOnInit() {
    this.organizationForm = this.fb.group({
      name: [this.organization.name, [Validators.required]],
      orgId: [this.organization.orgId, [Validators.required]],
      responsible: this.fb.group({
        id: [this.organization.responsible.id, [Validators.required/*, Validators.minLength(11), Validators.maxLength(11)*/]],
        firstName: [this.organization.responsible.firstName, [Validators.required/*, Validators.minLength(2)*/]],
        lastName: [this.organization.responsible.lastName, [Validators.required/*, Validators.minLength(2)*/]],
        email: [this.organization.responsible.email, [Validators.required]],
        phone: [this.organization.responsible.phone, [Validators.required/*, Validators.minLength(8)*/]]
      })
    });
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
      return me.organizationService.fetchOrganizationByName(currentValue);
    }
  }
}
