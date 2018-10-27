import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuComponent } from './menu.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'menu'
    },
    children: [
      {
        path: 'inicio/:infoBasica/:mesa/:numFactura/:turno/:actualizar/:tr',
        component: MenuComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }