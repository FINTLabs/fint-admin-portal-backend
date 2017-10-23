// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

import { LibSharedModule } from 'fint-shared-components';

import { ComponentRoutes } from './component.routes';
import { ComponentComponent } from './component.component';
import { EditComponentComponent } from './edit-component/edit-component.component';
import { CommonComponentService } from './common-component.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    AngularFontAwesomeModule,
    MatCardModule,

    LibSharedModule,
    RouterModule.forChild([...ComponentRoutes])
  ],
  declarations: [
    ComponentComponent,
    EditComponentComponent
  ],
  providers: [CommonComponentService]
})
export class ComponentModule { }
