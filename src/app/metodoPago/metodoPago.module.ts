import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MetodoPagoComponent } from "app/metodoPago/metodoPago.component";
import { MetodoPagoService } from "app/metodoPago/metodoPago.service";
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';




@NgModule({
  imports: [
    AlertModule,
    ChartsModule,
    FormsModule,
    CommonModule,
    ModalModule.forRoot(),
    TypeaheadModule.forRoot()    
  ],
  declarations: [ 
    MetodoPagoComponent
  ],
  providers: [
    MetodoPagoService, 
  ],
  exports:[
    MetodoPagoComponent
  ]
})
export class MetodoPagoModule{ }