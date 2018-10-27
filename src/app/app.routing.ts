import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { CategoriaComponent } from "app/categoria/categoria.component";
import { SubCategoriaComponent } from "app/subcategoria/subcategoria.component";
import { LoginComponent } from 'app/login';
import { AuthGuard } from 'app/_guards';
import { AdminAuthGuard } from 'app/_guards/admin.auth.guard';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  { path: 'login', component: LoginComponent },

  // otherwise redirect to home
  { path: '*', redirectTo: 'dashboard' },

  {
    path: '',
    component: FullLayoutComponent, 
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'categorias',
        component: CategoriaComponent
      },
      {
        path: 'subcategorias/:id',
        component: SubCategoriaComponent
      },
      {
        path: 'productos',
        loadChildren: './productos/productos.module#ProductosModule'
      },
      {
        path: 'usuarios',
        loadChildren: './usuarios/usuarios.module#UsuariosModule'
      },
      {
        path: 'clientes',
        loadChildren: './clientes/clientes.module#ClientesModule'
      },
      {
        path: 'mesas',
        loadChildren: './mesas/mesas.module#MesasModule'
      },
      {
        path: 'menu',
        loadChildren: './menu/menu.module#MenuModule'
      },
      {
        path: 'pedidos',
        loadChildren: './pedidos/pedido.module#PedidoModule'
      },
      {
        path: 'negocio',
        loadChildren: './negociodetalles/negociodetalles.module#NegocioDetallesModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
