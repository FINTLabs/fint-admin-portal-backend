import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  errorMessage: any;
  errorSubtitle: string;

  constructor(public dialogRef: MdDialogRef<ErrorComponent>) { }

  ngOnInit() {
  }

}
