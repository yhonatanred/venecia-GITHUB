import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PropinasModule } from 'app/propinas/propinas.module';
import { AuditoriaModule } from 'app/auditoria/auditoria.module';
import { CierreDeCajaModule } from 'app/cierreDeCaja/cierreDeCaja.module';
import { ClientesService } from '../clientes/clientes.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ProductosService } from '../productos/productos.service';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [
    DashboardRoutingModule,
    ChartsModule,
    PropinasModule,
    AuditoriaModule,
    CierreDeCajaModule,

    
    CommonModule
   
  ],
  declarations: [
    DashboardComponent 
  ],
  providers: [
    ClientesService,UsuariosService,ProductosService
  ],
})
export class DashboardModule { }
