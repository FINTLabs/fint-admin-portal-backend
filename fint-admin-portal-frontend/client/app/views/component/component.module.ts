// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { LibSharedModule } from 'fint-shared-components';

import { ComponentRoutes } from './component.routes';
import { ComponentComponent } from './component.component';
import { EditComponentComponent } from './edit-component/edit-component.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LibSharedModule,
    RouterModule.forChild([...ComponentRoutes])
  ],
  declarations: [
    ComponentComponent,
    EditComponentComponent
  ]
})
export class ComponentModule { }
