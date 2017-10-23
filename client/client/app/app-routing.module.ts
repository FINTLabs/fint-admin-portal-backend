import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventModule } from 'fint-shared-components';
import { ComponentModule } from './views/component/component.module';
import { OrganizationModule } from './views/organization/organization.module';

import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', data: { label: 'Home' } },
  { path: '**', redirectTo: '' } // Anything else, go home
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    ComponentModule,    // Including routes
    OrganizationModule, // Including routes
    EventModule.forRoot(), // Including routes
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
