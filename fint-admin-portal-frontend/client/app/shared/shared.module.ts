import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { ConfirmDeleteComponent } from './dialogs/confirm-delete/confirm-delete.component';
import { ErrorComponent } from './dialogs/error/error.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [ConfirmDeleteComponent, ErrorComponent],
  declarations: [ConfirmDeleteComponent, ErrorComponent]
})
export class SharedModule { }
