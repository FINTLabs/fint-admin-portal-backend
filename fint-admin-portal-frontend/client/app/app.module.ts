import { CommonComponentService } from './api/common-component.service';
// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { LibSharedModule, EventService } from 'fint-shared-components';


// Components
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FormsModule,
    MaterialModule.forRoot(),

    LibSharedModule,
    AppRoutingModule
  ],
  providers: [EventService, CommonComponentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
