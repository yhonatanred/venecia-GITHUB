import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';


//importo componentes y modulos de angular
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';//importo los modulos de 'dropdowns'
import { ModalModule } from 'ngx-bootstrap/modal';

import { ReactiveFormsModule } from '@angular/forms';
import { LetterBoldPipe } from '../shared/letter-bold.pipe';
import { SearchFilterPipe } from '../shared/filter-pipe';
import { AlertModule } from 'ngx-bootstrap/alert';
import { VentasDiaComponent } from 'app/ventasdia/ventasdia.component';
import { VentasDiaService } from 'app/ventasdia/ventasdia.service';
//importo para el picker de la fecha
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';




@NgModule({
  imports: [
    AlertModule,
    ChartsModule,
    FormsModule,
    CommonModule,
    BsDropdownModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  declarations: [ 
    VentasDiaComponent
  ],
  providers: [
    VentasDiaService, 
  ],
  exports:[
    VentasDiaComponent
  ]
})
export class VentasDiaModule{ }
