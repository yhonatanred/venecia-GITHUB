import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {PedidoRoutingModule} from './pedido-routing.module';
import {PedidoComponent} from './pedido.component';

//importo componentes y modulos de angular
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';


import { LetterBoldPipe } from '../shared/letter-bold.pipe';
// RECOMMENDED (doesn't work with system.js)
import { AlertModule } from 'ngx-bootstrap/alert';
// RECOMMENDED (doesn't work with system.js) tooltip -- mensaje 
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PedidoService } from "app/pedidos/pedido.service";
import { MesasService } from "app/mesas/mesas.service";
import { UsuariosService } from "app/usuarios/usuarios.service";
//para el autollenado
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ClientesService } from "app/clientes/clientes.service";;
//IMPORTO EL COMPONENTE PARA UN NUEVO CLIENTE
import { ClientesModule } from "app/clientes/clientes.module"
import { MenuService } from "app/menu/menu.service";
import { ComandaService } from "app/comanda/comanda.service";
import { ProductosService } from "app/productos/productos.service";
import { MetodoPagoModule } from "app/metodoPago/metodoPago.module";
import { CantidadPedido } from 'app/pedidos/cantidadPedido.component';
import { VentasDiaModule } from 'app/ventasdia/ventasdia.module';
import { FacturasModule } from 'app/facturas/facturas.module';
import { PartirCuentaModule } from 'app/partircuenta/partircuenta.module';



@NgModule({
  imports: [
    ChartsModule,
    FormsModule,
    PedidoRoutingModule,
    CommonModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    ClientesModule,
    MetodoPagoModule,
    VentasDiaModule,
    FacturasModule,
    PartirCuentaModule
  ],
  declarations: [ PedidoComponent, CantidadPedido],
  providers: [ 
    PedidoService, MesasService, UsuariosService, ClientesService, MenuService, ComandaService, ProductosService 
  ]
})
export class PedidoModule{ }