import { Router } from '@angular/router';
import { OrganizationService } from './organization.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  organizations = [];
  constructor(private organizationService: OrganizationService, private router: Router) { }

  ngOnInit() {
    this.organizations = this.organizationService.all();
  }
}
