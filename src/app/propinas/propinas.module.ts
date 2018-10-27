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
//importo para el picker de la fecha
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PropinasComponent } from 'app/propinas/propinas.component';
import { PropinasService } from 'app/propinas/propinas.service';




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
    PropinasComponent
  ],
  providers: [
    PropinasService
  ],
  exports:[
    PropinasComponent
  ]
})
export class PropinasModule{ }