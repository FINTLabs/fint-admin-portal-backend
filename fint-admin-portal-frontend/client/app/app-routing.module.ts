import { ComponentModule } from './views/component/component.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { EventModule } from 'fint-shared-components';
import { OrganizationModule } from './views/organization/organization.module';

import { HomeComponent } from './views/home/home.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    MaterialModule,
    ComponentModule,    // Including routes
    OrganizationModule, // Including routes
    EventModule,        // Including routes
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', data: { label: 'Home' } },
      { path: '**', redirectTo: '' } // Anything else, go home
    ])
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
