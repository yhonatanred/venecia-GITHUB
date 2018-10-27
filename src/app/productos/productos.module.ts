import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { ProductosComponent } from './productos.component';
import { ProductosRoutingModule } from './productos-routing.module';

//importo componentes y modulos de angular
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';//importo los modulos de 'dropdowns'
import { ProductosService } from "app/productos/productos.service";
import { ModalModule } from 'ngx-bootstrap/modal';
import { CategoriaService } from "app/categoria/categoria.service";

//
import { ReactiveFormsModule } from '@angular/forms';
import { LetterBoldPipe } from '../shared/letter-bold.pipe';
import { SearchFilterPipe } from '../shared/filter-pipe';
import { SubCategoriaService } from "app/subcategoria/subcategoria.service";
import { GustosComponent } from "app/gustos/gustos.component";
import { ComandaService } from "app/comanda/comanda.service";
//importo el colorPicker
import { ColorPickerModule } from 'ngx-color-picker';
//para el autollenado
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
// RECOMMENDED (doesn't work with system.js)
import { AlertModule } from 'ngx-bootstrap/alert';
// RECOMMENDED (doesn't work with system.js) tooltip -- mensaje 
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { GustosModule } from 'app/gustos/gustos.module';

//tabla
import { DataTableModule } from "angular2-datatable";
import { ActivatedRoute } from '@angular/router';


@NgModule({
  imports: [
    GustosModule,
    DataTableModule,//tabla
    ProductosRoutingModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,//nuevo
    CommonModule,
    BsDropdownModule,
    ModalModule.forRoot(),
    ColorPickerModule,
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [ 
    ProductosComponent,
    SearchFilterPipe,//se agrego a pipe
    LetterBoldPipe
  ],
  providers: [
    ProductosService, 
    CategoriaService,
    SubCategoriaService,
    ComandaService
  ]
})
export class ProductosModule{ }
