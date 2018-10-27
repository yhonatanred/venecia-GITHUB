import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ProductosComponent } from './productos.component';

const routes: Routes = [
  {
    path: ':subCategoria',
    component: ProductosComponent
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule {}
