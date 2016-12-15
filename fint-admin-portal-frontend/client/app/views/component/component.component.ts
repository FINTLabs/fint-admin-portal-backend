import { CommonComponentService, ICommonComponent } from './common-component.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.scss']
})
export class ComponentComponent implements OnInit {
  components: ICommonComponent[];

  constructor(private titleService: Title, private CommonComponent: CommonComponentService) {
    this.titleService.setTitle('Fint | Components');
    this.components = CommonComponent.all();
  }

  ngOnInit() {
  }

}
