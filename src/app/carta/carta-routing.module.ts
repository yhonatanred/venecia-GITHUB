import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartaHomeComponent } from './carta-home.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'carta'
    },
    children: [
      {
        path: 'inicio',
        component: CartaHomeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartaRoutingModule { }
