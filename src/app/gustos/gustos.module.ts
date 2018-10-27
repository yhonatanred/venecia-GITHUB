import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';


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
import { GustosService } from "app/gustos/gustos.service";
import { GustosComponent } from "app/gustos/gustos.component";
import { AlertModule } from 'ngx-bootstrap/alert';




@NgModule({
  imports: [
    AlertModule,
    ChartsModule,
    FormsModule,
    CommonModule,
    BsDropdownModule,
    ModalModule.forRoot()
  ],
  declarations: [ 
    GustosComponent
  ],
  providers: [
    GustosService, 
  ],
  exports:[
    GustosComponent
  ]
})
export class GustosModule{ }
