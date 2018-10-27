import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartirCuentaComponent } from './partircuenta.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'negocio'
    },
    children: [
      {
        path: 'inicio',
        component: PartirCuentaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartirCuentaRoutingModule { }