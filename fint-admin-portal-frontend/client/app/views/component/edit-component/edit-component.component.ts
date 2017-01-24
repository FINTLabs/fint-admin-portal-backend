import { SafeStyle } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FintDialogService } from 'fint-shared-components';

import { CommonComponentService } from '../common-component.service';
import { ICommonComponent } from 'app/api/ICommonComponent';

@Component({
  selector: 'app-edit-component',
  templateUrl: './edit-component.component.html',
  styleUrls: ['./edit-component.component.scss']
})
export class EditComponentComponent implements OnInit {
  component: ICommonComponent;
  componentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private componentService: CommonComponentService,
    private sanitizer: DomSanitizer,
    private FintDialog: FintDialogService
  ) {
    this.component = <ICommonComponent>{};
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.componentService.get(params['id']).subscribe(component => {
          this.component = component;
          this.createForm();
        });
      }
    });
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.componentForm = this.fb.group({
      'dn': [this.component.dn],
      'uuid': [this.component.uuid],
      'displayName': [this.component.displayName, [Validators.required]],
      'technicalName': [this.component.technicalName, [Validators.required]],
      'description': [this.component.description],
      'icon': [this.component.icon]
    });
  }

  save(model: ICommonComponent) {
    this.componentService.save(model)
      .subscribe(result => this.router.navigate(['../'], { relativeTo: this.route }));
  }

  deleteComponent() {
    this.FintDialog.confirmDelete().afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.componentService.delete(this.component).subscribe(response => {
          this.router.navigate(['../'], { relativeTo: this.route });
        });
      }
    });
  }
}
