// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { LibSharedModule, EventService } from 'fint-shared-components';

// Components
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { MatToolbarModule } from '@angular/material';

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
    BrowserAnimationsModule,

    MatToolbarModule,
    AngularFontAwesomeModule,

    LibSharedModule,
    AppRoutingModule
  ],
  providers: [EventService],
  bootstrap: [AppComponent]
})
export class AppModule { }
