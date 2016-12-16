import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IContact} from 'app/api/IContact';

@Component({
  selector: 'app-edit-responsible',
  templateUrl: './edit-responsible.component.html',
  styleUrls: ['./edit-responsible.component.scss']
})
export class EditResponsibleComponent implements OnInit {
  @Input() responsible: IContact;
  @Output() responsibleChange: EventEmitter<IContact> = new EventEmitter<IContact>();
  responsibleForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.responsibleForm = this.fb.group({
      firstName: [this.responsible.firstName, [Validators.required]],
      lastName: [this.responsible.lastName, [Validators.required]],
      mail: [this.responsible.mail, [Validators.required]],
      mobile: [this.responsible.mobile, [Validators.required]],
      nin: [this.responsible.nin, [Validators.required]],
      orgId: [this.responsible.orgId, [Validators.required]]
    });
  }
  save(contact: IContact) {

  }

  closeEditor() {
    this.responsible.isEditing = false;
    this.responsibleChange.emit(this.responsible);
  }
}
