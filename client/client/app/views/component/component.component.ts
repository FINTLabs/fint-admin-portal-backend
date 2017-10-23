import { CommonComponentService } from './common-component.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ICommonComponent } from 'app/api/ICommonComponent';

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.scss']
})
export class ComponentComponent implements OnInit {
  components: ICommonComponent[] = [];
  page: number = 1;
  pages: number;
  total: number;
  pageSize: number = 10;
  isLoading: boolean = false;

  constructor(private titleService: Title, private CommonComponent: CommonComponentService) {
    this.titleService.setTitle('Komponenter | Fint');
  }

  ngOnInit() {
    this.isLoading = true;
    this.CommonComponent.all().subscribe(
      result => {
        this.isLoading = false;
        this.page = result.page;
        this.total = result.total_items;
        this.pages = result.page_count;
        this.pageSize = result.page_size;
        if (result._embedded) {
          this.components = result._embedded.componentList;
        }
      },
      error => this.isLoading = false
    );
  }
}
