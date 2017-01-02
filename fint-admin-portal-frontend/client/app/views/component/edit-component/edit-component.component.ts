import { SafeStyle } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CommonComponentService } from '../common-component.service';
import {ICommonComponent} from 'app/api/ICommonComponent';

@Component({
  selector: 'app-edit-component',
  templateUrl: './edit-component.component.html',
  styleUrls: ['./edit-component.component.scss']
})
export class EditComponentComponent implements OnInit {
  component: ICommonComponent;
  componentForm: FormGroup;
  iconFile: File;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private componentService: CommonComponentService,
    private sanitizer: DomSanitizer
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

  getIcon(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle('background-image: url(' + this.component.icon + ')');
  }

  setIcon($event: Event) {
    let files: FileList = event.srcElement['files'];
    if (files && files.length) {
      console.log(files[0].name);
    }
  }

  save(model: ICommonComponent) {
    if (!model.uuid) { delete model.dn; }
    this.componentService.save(model)
      .subscribe(result => {
        this.router.navigate(['../'], { relativeTo: this.route});
      });
  }
}
