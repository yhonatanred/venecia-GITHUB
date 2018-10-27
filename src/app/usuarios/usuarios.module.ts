import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { UsuariosNuevoComponent } from './usuarios-nuevo.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { HttpModule } from "@angular/http";

import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UsuariosListaComponent } from "./usuarios-lista.component";
import { UsuariosHomeComponent } from "./usuarios-home.component";
//importar el ngif
import { CommonModule } from "@angular/common";
import { UsuariosService } from "app/usuarios/usuarios.service";

//importar pipes
import { UsuarioFiltroNombre } from "../pipes/usuario-filtro-nombre.pipe";

import { DataTableModule } from "angular2-datatable";
import { AlertModule } from 'ngx-bootstrap/alert';


@NgModule({
  imports: [
    UsuariosRoutingModule,
    ChartsModule,
    DataTableModule,
    HttpModule,
    FormsModule,
    CommonModule,
    ModalModule.forRoot(),
    AlertModule.forRoot()
  ],
  declarations: [ UsuariosNuevoComponent, UsuariosListaComponent, UsuariosHomeComponent,
    UsuarioFiltroNombre],
  providers: [UsuariosService]
})
export class UsuariosModule { }
