import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { ClientesNuevoComponent } from './clientes-nuevo.component';
import { ClientesRoutingModule } from './clientes-routing.module';
import { HttpModule } from "@angular/http";

import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ClientesListaComponent } from "./clientes-lista.component";
import { ClientesHomeComponent } from "./clientes-home.component";
//importar el ngif
import { CommonModule } from "@angular/common";
import { ClientesService } from "app/clientes/clientes.service";

import { ClienteFiltroNombre } from "../pipes/cliente-filtro-nombre.pipe";
import { ClienteFiltroNumero } from "../pipes/cliente-filtro-numero.pipe";
import { DataTableModule } from "angular2-datatable";
import { PedidoComponent } from 'app/pedidos/pedido.component';
import { PedidoModule } from 'app/pedidos/pedido.module';
import { AlertModule } from 'ngx-bootstrap/alert';


@NgModule({
  imports: [
    ClientesRoutingModule,
    ChartsModule,
    DataTableModule,
    HttpModule,
    FormsModule,
    CommonModule,
    ModalModule.forRoot(),
    AlertModule.forRoot()
  ],
  declarations: [ 
    ClientesNuevoComponent, ClientesListaComponent, ClientesHomeComponent,
    ClienteFiltroNombre,ClienteFiltroNumero
  ],
  providers: [
    ClientesService, ClientesListaComponent
  ],
  exports:[
    ClientesNuevoComponent, ClientesListaComponent, ClientesHomeComponent,
    ClienteFiltroNombre,ClienteFiltroNumero
  ]
})
export class ClientesModule { }
