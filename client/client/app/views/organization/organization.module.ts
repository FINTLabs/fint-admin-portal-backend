// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatOptionModule, MatCheckboxModule } from '@angular/material';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

import { LibSharedModule } from 'fint-shared-components';

import { OrganizationRoutes } from './organization.routes';
import { HttpModule, XSRFStrategy, Request} from '@angular/http';

// Components
import { OrganizationComponent } from './organization.component';
import { EditOrganizationComponent } from './edit-organization/edit-organization.component';
import { EditResponsibleComponent } from './edit-responsible/edit-responsible.component';

// Services
import { FintDialogService } from 'fint-shared-components';
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
    BrowserAnimationsModule,

    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatOptionModule,

    AngularFontAwesomeModule,

    LibSharedModule,
    RouterModule.forChild([...OrganizationRoutes])
  ],
  declarations: [
    OrganizationComponent,
    EditOrganizationComponent,
    EditResponsibleComponent
  ],
  providers: [OrganizationService, FintDialogService, { provide: XSRFStrategy, useClass: NoXSRFStrategy }] // !!HACK!!
})
export class OrganizationModule { }
