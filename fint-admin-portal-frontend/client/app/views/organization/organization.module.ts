// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { LibSharedModule } from 'fint-shared-components';

import { OrganizationRoutes } from './organization.routes';
import { HttpModule, XSRFStrategy } from '@angular/http';
import { NoXSRFStrategy, OrganizationService } from '../../api/organization.service';

// Components
import { OrganizationComponent } from './organization.component';
import { EditOrganizationComponent } from './edit-organization/edit-organization.component';


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LibSharedModule,
    RouterModule.forChild([...OrganizationRoutes])
  ],
  declarations: [
    OrganizationComponent,
    EditOrganizationComponent
  ],
  providers: [OrganizationService, { provide: XSRFStrategy, useClass: NoXSRFStrategy }] // !!HACK!!
})
export class OrganizationModule { }
