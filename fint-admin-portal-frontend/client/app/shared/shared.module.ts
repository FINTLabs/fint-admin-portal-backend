import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { ConfirmDeleteComponent } from './dialogs/confirm-delete/confirm-delete.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [ConfirmDeleteComponent],
  declarations: [ConfirmDeleteComponent]
})
export class SharedModule { }
