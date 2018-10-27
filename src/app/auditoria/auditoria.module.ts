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
import { MetodoPagoService } from 'app/metodoPago/metodoPago.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AuditoriaComponent } from 'app/auditoria/auditoria.component';
import { AuditoriaService } from 'app/auditoria/auditoria.service';
import { JustificacionComponent } from 'app/auditoria/justificacion.component';
import { FacturasModule } from 'app/facturas/facturas.module';


@NgModule({
  imports: [
    AlertModule,
    ChartsModule,
    FormsModule,
    CommonModule,
    BsDropdownModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    FacturasModule
  ],
  declarations: [ 
    AuditoriaComponent, JustificacionComponent
  ],
  providers: [
    AuditoriaService
  ],
  exports:[
    AuditoriaComponent
  ]
})

export class AuditoriaModule{ }