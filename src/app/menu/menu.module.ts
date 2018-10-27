import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTableModule } from "angular2-datatable";

//routing
import { MenuRoutingModule } from './menu-routing.module';
// componentes

import { MenuComponent } from "./menu.component";
import { GustosComponent } from "app/gustos/gustos.component";
import { CartaHomeComponent } from 'app/carta/carta-home.component';

import { AlertModule } from 'ngx-bootstrap/alert';
import { GustosService } from "app/gustos/gustos.service";
import { GustosModule } from 'app/gustos/gustos.module';
import { CartaModule } from "app/carta/carta.module";
import { CategoriaService } from "app/categoria/categoria.service";
import { ProductosService } from "app/productos/productos.service";
import { SubCategoriaService } from "app/subcategoria/subcategoria.service";
//importa para obtener lan hora
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MenuService } from "app/menu/menu.service";
//importo para obtener la ubicacion
import { LocationStrategy, HashLocationStrategy } from '@angular/common';


@NgModule({
  imports: [
    GustosModule,
    MenuRoutingModule,
    ChartsModule,
    DataTableModule,
    HttpModule,
    FormsModule,
    CommonModule,    
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    TimepickerModule.forRoot()
   // CartaModule //agrego modulo, dario
  ],
  declarations: [MenuComponent, CartaHomeComponent],//quito CartaHomeComponent dario
  providers: [MenuService],//agrego argumentos dario
  exports: [MenuComponent]
})
export class MenuModule { }
