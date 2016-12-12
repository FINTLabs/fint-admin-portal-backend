import { Routes } from '@angular/router';

import { OrganizationComponent } from './organization.component';
import { EditOrganizationComponent } from './edit-organization/edit-organization.component';

export const OrganizationRoutes: Routes = [
  {
    path: 'organizations', data: { label: 'Organisasjoner', icon: 'sitemap' }, children: [
      { path: '', component: OrganizationComponent, pathMatch: 'full' },
      { path: 'add', component: EditOrganizationComponent },
      { path: ':orgId', component: EditOrganizationComponent },
    ]
  }
];
