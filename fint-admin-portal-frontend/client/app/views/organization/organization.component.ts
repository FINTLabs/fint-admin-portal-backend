import { Router } from '@angular/router';
import { OrganizationService } from './organization.service';
import { Component, OnInit } from '@angular/core';

import { IOrganization } from 'app/api/IOrganization';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  organizations: IOrganization[] = [];
  page: number = 1;
  pages: number;
  total: number;
  pageSize: number = 10;

  constructor(private organizationService: OrganizationService, private router: Router, private titleService: Title) {
    this.titleService.setTitle('Organisasjoner | Fint-Adminportal');
  }

  ngOnInit() {
    this.organizationService.all(this.page, this.pageSize)
      .subscribe(result => {
        this.page = result.page;
        this.total = result.total_items;
        this.pages = result.page_count;
        this.pageSize = result.page_size;
        if (result._embedded) {
          this.organizations = result._embedded.organisationList;
        }
      });
  }
}
