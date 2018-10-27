import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NegocioDetallesComponent } from './negociodetalles.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'negocio'
    },
    children: [
      {
        path: 'inicio',
        component: NegocioDetallesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NegocioDetallesRoutingModule { }