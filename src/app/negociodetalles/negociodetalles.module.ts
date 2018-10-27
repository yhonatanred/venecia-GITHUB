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
import { NegocioDetallesComponent } from 'app/negociodetalles/negociodetalles.component';
import { NegocioDetallesRoutingModule } from 'app/negociodetalles/negociodetalles-routing.module';
import { NegocioDetallesService } from 'app/negociodetalles/negociodetalles.service';
import { HttpModule } from '@angular/http';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ImageUploadModule } from "angular2-image-upload";


@NgModule({
  imports: [
    ImageUploadModule.forRoot(),
    HttpModule,
    ChartsModule,
    FormsModule,
    CommonModule,
    BsDropdownModule,
    NegocioDetallesRoutingModule,
    AlertModule.forRoot()
  ],
  declarations: [NegocioDetallesComponent
  ],
  providers: [NegocioDetallesService]
})
export class NegocioDetallesModule{ }
