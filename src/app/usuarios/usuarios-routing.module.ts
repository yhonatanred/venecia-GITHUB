import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosNuevoComponent } from './usuarios-nuevo.component';
import {UsuariosHomeComponent} from './usuarios-home.component'

const routes: Routes = [
{
  path: '',
  data: {
    title: 'usuarios'
  },
  children: [
    {
      path: 'inicio',
      component: UsuariosHomeComponent
    },
    {
      path: 'nuevo',
      component: UsuariosNuevoComponent
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
