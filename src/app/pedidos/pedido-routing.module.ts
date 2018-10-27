import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoComponent } from './pedido.component';

const routes: Routes = [
  {
    path: ':mesa',
    component: PedidoComponent
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule {}