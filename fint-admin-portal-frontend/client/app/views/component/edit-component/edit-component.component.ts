import { Event } from '@angular/platform-browser/src/facade/browser';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CommonComponentService, ICommonComponent } from '../../../api/common-component.service';

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
    private CommonComponent: CommonComponentService,
    private sanitizer: DomSanitizer
  ) {
    this.component = <ICommonComponent>{};
    this.route.params.subscribe(params => {
      if (params['id']) {
        let components = this.CommonComponent.all();
        let index = components.findIndex(org => org.id === +params['id']);
        if (index > -1) {
          this.component = components[index];
        }
      }
    });
  }

  ngOnInit() {
    this.componentForm = this.fb.group({
      'name': [this.component.name, [Validators.required]],
      'technicalName': [this.component.technicalName, [Validators.required]],
      'description': [this.component.description],
      'icon': [this.component.icon]
    });
  }

  getIcon() {
    return this.sanitizer.bypassSecurityTrustStyle('background-image: url(' + this.component.icon + ')');
  }

  setIcon($event: Event) {
    let files: FileList = event.srcElement['files'];
    if (files && files.length) {
      console.log(files[0].name);
    }
  }

  save(model: ICommonComponent) {
    this.router.navigate(['../']);
  }
}
