import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
//routing
import { MesasRoutingModule } from './mesas-routing.module';
//pipes
import { MesaFiltroIdentificador } from "../pipes/Mesa-filtro-identificador.pipe";
//servicios
import { MesasService } from "app/mesas/mesas.service";
// componentes

import { MesasNuevoComponent } from './mesas-nuevo.component';
import { MesasListaComponent } from "./mesas-lista.component";
import { MesasHomeComponent } from "./mesas-home.component";
import { DataTableModule } from "angular2-datatable";
import { AlertModule } from 'ngx-bootstrap/alert';


@NgModule({
  imports: [
    MesasRoutingModule,
    ChartsModule,
    DataTableModule,
    HttpModule,
    FormsModule,
    CommonModule,
    ModalModule.forRoot(),
    AlertModule.forRoot()
  ],
  declarations: [ MesasNuevoComponent, MesasListaComponent, MesasHomeComponent,
    MesaFiltroIdentificador],
  providers: [MesasService]
})
export class MesasModule { }
