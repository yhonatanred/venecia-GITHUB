import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import { ModalDirective } from "ngx-bootstrap/modal";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FacturasService } from './facturas.service';
import { MetodoPagoService } from 'app/metodoPago/metodoPago.service';
import { ViewChild } from '@angular/core/src/metadata/di';
import { FacturasComponent } from 'app/facturas/facturas.component';

@Component({
  selector: 'lista-factura',
  templateUrl: './listaFacturas.component.html',
  styleUrls: ['./listaFacturas.component.scss']
})
//COMPONENTE HIJO QUE ES LLAMADO DESDE FACTURASCOMPONENT
export class ListaFacturasComponent implements OnInit {
    @Input() dato;
    @Input() buscarPor: string;
    @Input() padre: FacturasComponent;
    //atributos
    public facturas;
    constructor(private facturasService: FacturasService){
        this.facturas = [];
        this.dato = "";
        this.buscarPor = "";
    }
    
    ngOnInit(){
        let fecha = 'fecha';
        if(this.buscarPor == fecha){
            let date = new Date();
            let date1 = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
            this.dato = [date1, date1];
        }
        this.buscarFacturas(this.dato, this.buscarPor);
    }

    buscarFacturas(dato, buscarPor:string){        
        this.facturasService.buscarFacturas(dato, buscarPor).subscribe(result=>{
            this.facturas = result;
        },error=>{
            console.log(<any>error);
        });
    }
    //MANEJADOR DE EVENTOS DE LA TABLA
    buscarFact_X_num(numFactura){
        this.padre.limpiar();
        this.padre.buscarPor = "numFactura";
        this.padre.cargarInfo(numFactura);
    }
   
}