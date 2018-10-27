import { Component, OnInit, ViewChild, Input} from '@angular/core';
import {Http} from '@angular/http';
import { ModalDirective } from "ngx-bootstrap/modal";
import { AuditoriaService } from 'app/auditoria/auditoria.service';


@Component({
  selector: 'justificacion',
  templateUrl: './justificacion.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class JustificacionComponent implements OnInit {
//DECORA LA CLASE COMO UNA VISTA 'HIJO'
 @ViewChild('justificacionModal') modal:ModalDirective;
 @Input() descGlobal:boolean;
 @Input() tr:number;
 @Input() numFactura:number;
 @Input() fecha;
 @Input() cliente:string;
 @Input() descuento:number;
 @Input() total:number;
 @Input() precioP:number;
 @Input() justificacion;

 constructor(){
     this.descGlobal=true;
     this.tr = 0;
     this.numFactura = 0;
     this.fecha = new Date();
     this.cliente = "";
     this.descuento = 0;
     this.total = 0;
     this.precioP = 0;
     this.justificacion = "";
 }
 ngOnInit(){

 }

 showModal(){
     this.modal.show();
 }

 hideModal(){
     this.modal.hide();
 }

 verFactura(facturas){
    facturas.cargarInfo(this.numFactura);
     facturas.showModal();
 }

}