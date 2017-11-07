import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IContact } from 'app/api';

@Component({
  selector: 'app-edit-responsible',
  templateUrl: './edit-responsible.component.html',
  styleUrls: ['./edit-responsible.component.scss']
})
export class EditResponsibleComponent implements OnInit {
  @Output()
  responsibleChange: EventEmitter<IContact> = new EventEmitter<IContact>();

  _responsible: IContact = <IContact>{};
  @Input()
  get responsible() { return this._responsible };
  set responsible(c: IContact) {
    this._responsible = c;
    if (c && this.responsibleForm) {
      this.responsibleForm.setValue(this._responsible);
    }
  }
  responsibleForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.responsibleForm = this.fb.group({
      dn:               [this.responsible.dn],
      firstName:        [this.responsible.firstName,  [Validators.required]],
      lastName:         [this.responsible.lastName,   [Validators.required]],
      mail:             [this.responsible.mail,       [Validators.required]],
      mobile:           [this.responsible.mobile,     [Validators.required]],
      nin:              [this.responsible.nin,        [Validators.required]],
      orgId:            [this.responsible.orgId,      [Validators.required]],
      primaryTechnical: [this.responsible.primaryTechnical],
      primaryLegal:     [this.responsible.primaryLegal],
    });
  }

  onChange() {
    this._responsible = this.responsibleForm.value;
    this.responsibleChange.emit(this._responsible);
  }

  moveNextOnSpace($event, element: HTMLElement) {
    if ($event.keyCode === 32) { element.focus(); }
  }
}
