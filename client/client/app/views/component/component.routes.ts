import { Routes } from '@angular/router';

import { EditComponentComponent } from './edit-component/edit-component.component';
import { ComponentComponent } from './component.component';

export const ComponentRoutes: Routes = [
  {
    path: 'components', data: { label: 'Komponenter', icon: 'puzzle-piece' }, children: [
      { path: '', component: ComponentComponent, pathMatch: 'full' },
      { path: 'add', component: EditComponentComponent },
      { path: ':id', component: EditComponentComponent, pathMatch: 'full' },
    ]
  }
];
