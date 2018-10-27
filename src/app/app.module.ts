import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CategoriaComponent } from './categoria/categoria.component';
import {HttpModule} from '@angular/http';
import {SubCategoriaComponent} from './subcategoria/subcategoria.component';
import { CommonModule } from '@angular/common';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { ColorPickerModule } from "ngx-color-picker/dist";
import { TooltipModule } from "ngx-bootstrap/tooltip";
//login
import { AlertComponent } from 'app/_directives';
import { LoginComponent } from 'app/login';
import { AuthGuard } from 'app/_guards';
import { AdminAuthGuard } from 'app/_guards/admin.auth.guard';
import { AlertService, AuthenticationService } from 'app/_services';
// RECOMMENDED (doesn't work with system.js)
import { CarouselModule } from 'ngx-bootstrap/carousel';



@NgModule({
  imports: [

    //login
    FormsModule,

    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    ChartsModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpModule,
    CommonModule,
    ColorPickerModule,//importo el colorPicker
    TooltipModule.forRoot(),//importo el toolTip
    CarouselModule.forRoot()// import carrousel
    
  ],
  declarations: [
    //login
        AlertComponent,
        LoginComponent,

    AppComponent,
    FullLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    CategoriaComponent,
    SubCategoriaComponent
    
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  AdminAuthGuard,
  AuthGuard,
  AlertService,
  AuthenticationService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
