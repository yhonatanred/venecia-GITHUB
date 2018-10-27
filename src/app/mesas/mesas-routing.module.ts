import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesasNuevoComponent } from './mesas-nuevo.component';
import {MesasHomeComponent} from './mesas-home.component'

const routes: Routes = [
{
  path: '',
  data: {
    title: 'mesas'
  },
  children: [
    {
      path: 'inicio',
      component: MesasHomeComponent
    },
    {
      path: 'nuevo',
      component: MesasNuevoComponent
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesasRoutingModule {}
