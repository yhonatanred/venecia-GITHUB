import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';


//importo componentes y modulos de angular
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

//
import { ReactiveFormsModule } from '@angular/forms';
import { LetterBoldPipe } from '../shared/letter-bold.pipe';
import { SearchFilterPipe } from '../shared/filter-pipe';
import { PartirCuentaComponent } from 'app/partircuenta/partircuenta.component';
import { PartirCuentaRoutingModule } from 'app/partircuenta/partircuenta-routing.module';
import { HttpModule } from '@angular/http';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead/typeahead.module';


@NgModule({
  imports: [
    HttpModule,
    ChartsModule,
    FormsModule,
    CommonModule,
    BsDropdownModule,
    PartirCuentaRoutingModule,
    AlertModule.forRoot(),
    SortableModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  declarations: [PartirCuentaComponent],
  providers: [],
  exports:[
    PartirCuentaComponent
  ]
})
export class PartirCuentaModule{ }
