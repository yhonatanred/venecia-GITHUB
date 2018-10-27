import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientesNuevoComponent } from './clientes-nuevo.component';
import {ClientesHomeComponent} from './clientes-home.component'

const routes: Routes = [
{
  path: '',
  data: {
    title: 'clientes'
  },
  children: [
    {
      path: 'inicio',
      component: ClientesHomeComponent
    },
    {
      path: 'nuevo',
      component: ClientesNuevoComponent
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule {}
