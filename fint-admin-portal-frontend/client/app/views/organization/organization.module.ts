// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { LibSharedModule } from 'fint-shared-components';

import { OrganizationRoutes } from './organization.routes';
import { HttpModule, XSRFStrategy, Request} from '@angular/http';

// Components
import { OrganizationComponent } from './organization.component';
import { EditOrganizationComponent } from './edit-organization/edit-organization.component';
import { EditResponsibleComponent } from './edit-responsible/edit-responsible.component';

// Services
import { OrganizationService } from './organization.service';

export class NoXSRFStrategy {
  configureRequest(req: Request) {
    // Remove `x-xsrf-token` from request headers
  }
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LibSharedModule.forRoot(),
    RouterModule.forChild([...OrganizationRoutes])
  ],
  declarations: [
    OrganizationComponent,
    EditOrganizationComponent,
    EditResponsibleComponent
  ],
  providers: [OrganizationService, { provide: XSRFStrategy, useClass: NoXSRFStrategy }] // !!HACK!!
})
export class OrganizationModule { }
