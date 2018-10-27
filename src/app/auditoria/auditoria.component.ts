import { Component, OnInit, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import { ModalDirective } from "ngx-bootstrap/modal";
import { AuditoriaService } from 'app/auditoria/auditoria.service';


@Component({
  selector: 'auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {
//DECORA LA CLASE COMO UNA VISTA 'HIJO'
 @ViewChild('auditoriaModal') modal:ModalDirective;

//atributos para la fecha
public fecha:Date[];
datepickerModel: Date;
bsConfig:any ={
  containerClass: "theme-red"
}
    public opc1:string;
    public opc2:string;
    public opcSelect:string;
    public vista: string;
    public descuentos;//variable que me almacena las facturas con descuentos globales
    public borrados;//variable que me almacena los productos borrados
// /////////////////////////////////////////////////////////////////
    //VARIABLES PARA VER LA JUSTIFICACION EN EL MODAL
    public tr:number;
    public numFactura:number;
    public fechaAud;
    public cliente:string;
    public descuento:number;
    public total:number;
    public precioP:number;
    public justif:string;
// ////////////////////////////////////////////////////

    constructor(private auditoriaService: AuditoriaService){
        this.opcSelect = this.opc1 = "Descuentos Globales";
        this.opc2 = "Descuentos a productos";
        this.vista = "descuentos";       
        this.fecha = [new Date(), new Date()]; 
        this.descuentos = [];
        this.borrados = [];
        //inicializo las variables para enviar al modal de justificacion
        this.tr = 0;
        this.numFactura = 0;
        this.fechaAud = "";
        this.cliente = "";
        this.descuento = 0;
        this.total = 0;
        this.precioP = 0;
        this.justif = "";
    }

    ngOnInit() {
        this.cargarDescuentos_globales();
        this.cargarEnviados_borrados();
     }

    showModal(){
        this.modal.show();
    }

    hideModal(){
        this.modal.hide();
    }

    cambiaVista(){
        let desc = 'descuentos';
        if(this.vista == desc){
            this.opcSelect = this.opc1 = "Descuentos Globales";
            this.opc2 = "Descuentos a productos";            
        }else{
            this.opcSelect = this.opc1 = "Enviados a comanda";
            this.opc2 = "Sin enviar a comanda";
        }
    }
/**************************************
*METODOS PARA LAS VISTA EN DESCUENTOS
****************************************/
    descProducto():boolean{
        let op = "Descuentos a productos";
        if(op == this.opcSelect){
            return true;
        }else{
            return false;
        }
    }
    descGlobal():boolean{
        let op = "Descuentos Globales";
        if(op == this.opcSelect){
            return true;
        }else{
            return false;
        }
    }
    verDescuentos():boolean{
        let v = "descuentos";
        if(this.vista == v){
            return true;
        }else{
            return false;
        }
    }

    //funcion que me retorna true si selecciono los borrados enviados a comanda
    enviados():boolean{
        let enviados = "Enviados a comanda";
        if(enviados == this.opcSelect){
            return true;
        }else{
            return false;
        }
    }

    //METODO QUE ME BUSCA LOS DESCUENTOS GLOBALES
    cargarDescuentos_globales(){
        let date1 = this.fecha[0].getFullYear()+"-"+(this.fecha[0].getMonth()+1)+"-"+this.fecha[0].getDate();
        let date2 = this.fecha[1].getFullYear()+"-"+(this.fecha[1].getMonth()+1)+"-"+this.fecha[1].getDate();
        this.auditoriaService.obtenerDescuentos_globales(date1, date2).subscribe(result=>{
            this.descuentos = result;
        },error=>{
            console.log(<any>error);
        });
    }
    cargarDescuentos_productos(){
        let date1 = this.fecha[0].getFullYear()+"-"+(this.fecha[0].getMonth()+1)+"-"+this.fecha[0].getDate();
        let date2 = this.fecha[1].getFullYear()+"-"+(this.fecha[1].getMonth()+1)+"-"+this.fecha[1].getDate();
        this.auditoriaService.obtenerDescuentos_productos(date1, date2).subscribe(result=>{
            this.descuentos = result;
        },error=>{
            console.log(<any>error);
        });
    }

    //METODOS QUE ME CARGA LOS PRODUCTOS BORRADOS
    cargarEnviados_borrados(){
        let date1 = this.fecha[0].getFullYear()+"-"+(this.fecha[0].getMonth()+1)+"-"+this.fecha[0].getDate();
        let date2 = this.fecha[1].getFullYear()+"-"+(this.fecha[1].getMonth()+1)+"-"+this.fecha[1].getDate();
        this.auditoriaService.obtenerEnviados_Borrados(date1, date2).subscribe(result=>{
            this.borrados = result;
        },error=>{
            console.log(<any>error);
        });
    }
    cargar_No_Enviados_borrados(){
        let date1 = this.fecha[0].getFullYear()+"-"+(this.fecha[0].getMonth()+1)+"-"+this.fecha[0].getDate();
        let date2 = this.fecha[1].getFullYear()+"-"+(this.fecha[1].getMonth()+1)+"-"+this.fecha[1].getDate();
        this.auditoriaService.obtenerNoEnviados_Borrados(date1, date2).subscribe(result=>{
            this.borrados = result;
            console.log("borrados",this.borrados);
        },error=>{
            console.log(<any>error);
        });
    }

    //METODO QUE ME LLAMA AL MODAL 'JUSTIFICACION'
    verJustificacion(justificacion, tr:number, numFact:number, fecha:string, cliente:string,
        descuento:number, total:number, precio:number, justif:string){
        this.tr = tr;
        this.numFactura = numFact;
        this.fechaAud = fecha;
        this.cliente = cliente;
        this.descuento = descuento;
        this.total = total;
        this.precioP = precio;
        this.justif = justif;
        justificacion.showModal();
    }

    eventBuscar(){
        if(this.verDescuentos()){
            let descG = "Descuentos Globales";
            if(descG == this.opcSelect){
                this.cargarDescuentos_globales();
            }else{
                this.cargarDescuentos_productos();
            }
        }else{
            let enviados = "Enviados a comanda";
            if(enviados == this.opcSelect){
                this.cargarEnviados_borrados();
            }else{
                this.cargar_No_Enviados_borrados();
            }
            
        }
    }




}