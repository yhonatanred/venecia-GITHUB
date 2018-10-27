import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTableModule } from "angular2-datatable";

//routing
import { CartaRoutingModule } from './carta-routing.module';
// componentes

import { CartaHomeComponent } from "./carta-home.component";
import { MenuComponent } from 'app/menu/menu.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { GustosComponent } from 'app/gustos/gustos.component';
import { GustosService } from 'app/gustos/gustos.service';
import { MenuModule } from "app/menu/menu.module";
import { SubCategoriaService } from "app/subcategoria/subcategoria.service";
import { CategoriaService } from "app/categoria/categoria.service";
import { ProductosService } from "app/productos/productos.service";

@NgModule({
  imports: [
    CartaRoutingModule,
    ChartsModule,
    DataTableModule,
    HttpModule,
    FormsModule,
    CommonModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
   // MenuModule
  ],
  declarations: [CartaHomeComponent, MenuComponent], //,MenuComponent
  providers: [CategoriaService, ProductosService, SubCategoriaService],//agrego argumentos dario
  exports:[CartaHomeComponent]
})
export class CartaModule { }
