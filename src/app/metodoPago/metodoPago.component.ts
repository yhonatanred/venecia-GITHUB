import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Http } from '@angular/http';
import { ModalDirective } from "ngx-bootstrap/modal";
import { MetodoPagoService } from "app/metodoPago/metodoPago.service";
import { Selector } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  selector: 'metodo-pago',
  templateUrl: './metodoPago.component.html',
  styleUrls: ['./metodoPago.component.css']
})

export class MetodoPagoComponent implements OnInit {
//DECORA LA CLASE COMO UNA VISTA 'HIJO'
 @ViewChild('modalMetodoPago') modal:ModalDirective;
 @Input() total: number;
 @Input() pedido;
 @Input() padre;
 @Input() mesa;
 @Input() propina:number;

 //VARIABLES
        /******************************
         * LA VARIABLE metodos_pagos
         * ALMACENA OBJETOS CON LA
         * SIGUIENTE ESTRUCTURA
         *objeto_pagos = {
         *  idMetodo_pago: -1,
         *  metodoP: ""
         *}
         ******************************/

    public metodos_pagos;//variable que me representa los diferentes metodos de pagos que hay en la BD
   // public vista:number;//representa la vista de los input ---efectivo, tarjeta o credito
    public valor1:number;     
    public valor2:number;
    public cambio:number; 
    public verAlerta:boolean;
    public mensajeAlerta:string;
    public mesaTempo:string;
    //variable que represnta el metodo de pago
    public metodoP: string;
    //variable que representa los nombres de los metodos de pago
    public metodos_nombres;
    public fp:boolean;//variable que me representa el foco del input 'propina'
    public fm: boolean;//variable que me representa el foco en el input 'metodoPago'  
    public fd:boolean;//variable que me representa el foco del boton cerrar del modal 'devueltas'
    public vrTotal: number;
    public formato:string;
    constructor(private metodoPagoService: MetodoPagoService){
        
        this.metodos_pagos = [];
        this.metodos_nombres = [];  
       // this.valor1 = this.valor2 = 0;
        //this.vista = -1;
        this.verAlerta = false;
        this.mesaTempo = "";
        this.mensajeAlerta = "";
        this.metodoP = "E";
        this.fp = true;
        this.fm = false;
        this.fd = false;
        this.vrTotal = this.total;
        this.formato = "";
    }

    ngOnInit(){
    }

    obtenerMetodos_de_pago(){
        this.metodoPagoService.obtenerMetodos_de_Pago().subscribe(
            result=>{
                this.metodos_pagos = result;
                for(let i = 0; i < this.metodos_pagos.length; i++){
                    this.metodos_nombres[i] = this.metodos_pagos[i].metodoP;
                }
            },error=>{
                console.log(<any>error);
            }
        );
    }

    mixto(metodoP: string):boolean{      
        let mix = "mixto".toUpperCase();   
        if(metodoP.toUpperCase() == mix){
            return true;
        }else{
            return false;
        }
    }

    tarjeta(metodoP: string):boolean{
        let mix = "tarjeta".toUpperCase();   
        if(metodoP.toUpperCase() == mix){
            this.vrTotal = this.calcularTotal();
            this.valor1 = this.vrTotal;
            return true;
        }else{
            return false;
        }
    }

    efectivo(metodoP: string):boolean{
        let mix = "efectivo".toUpperCase();   
        if(metodoP.toUpperCase() == mix){
            this.vrTotal = this.calcularTotal();
            //this.valor1 = 0;
            return true;
        }else{
            return false;
        }
    }
    credito(metodoP: string):boolean{
        let mix = "credito".toUpperCase();   
        if(metodoP.toUpperCase() == mix){
            this.vrTotal = this.calcularTotal();
            this.valor1 = this.vrTotal;
            return true;
        }else{
            return false;
        }
    }

    focusPropina(){
        if(this.fp){
            document.getElementById("propina").focus();
        }else{
            document.getElementById("propina").blur();
        }
        
    }

    showModal(){        
        this.obtenerMetodos_de_pago();    
        if(!this.cobrarPropina()){
            this.metodoP = "E";
            this.fm = true;  
        }    
        this.modal.show();     
    }
    
    hideModal(){    
        this.modal.hide();
        this.limpiar(); 
    }

    limpiar(){
        this.metodos_pagos = [];
        this.metodos_nombres = [];
        this.valor1 = undefined;
        this.valor2 = undefined;
        this.verAlerta = false;
        this.mensajeAlerta = "";
        this.metodoP = "E";
        this.fp = true;
        this.vrTotal = this.total;
        this.formato = ""; 
        this.cambio = 0;
        this.padre.ngOnInit(); 
    }
    //METODOS DE CALCULOS
    calcularDevuelta():number{     
        this.cambio =   this.recibo() - this.vrTotal;
        return ( this.cambio );
    }
    
    calcularTotal(){//calcula el total a pagar según la propina
        if(this.propina == undefined){     
            return this.redondear(this.total);
        }else{          
            return this.redondear(this.total + this.propina);
        }        
    }
    //METODO QUE CALCULA CUANTO DINERO RECIBÍ AL PAGAR
    recibo(){
        let val1 = 0;
        let val2 = 0;
        if(this.valor1 == undefined){
            val1 = 0;
        }else{
            val1 = this.valor1;
        }
        if(this.valor2 == undefined){
            val2 = 0;
        }else{
            val2 = this.valor2;
        }
        return (val1 + val2);
    }
    //METODO QUE ME REDONDEA A CIENTOS
    redondear(val:number): number{
            let n = val/100;
            let r = Math.round(n);
            return (r*100);        
    }
    
    aceptar(idMetodo:number, modalDevuelta){
        this.vrTotal = this.calcularTotal();
        let entrega = this.recibo();
        if(this.valor2 == undefined){
            this.valor2 = 0;
        }
        if(entrega >= this.vrTotal){            
            let date = new Date();
            let fecha = date.getFullYear()+'-'+( date.getMonth()+1 )+"-"+date.getDate();
            let id = JSON.parse(sessionStorage.getItem('currentUser'));
            let idUsuario =  parseInt(id.id);     //obtiene le id del usuario logeado   
            let devuelta = this.calcularDevuelta();
            let idMetodo_pago = idMetodo;
            if(this.propina == undefined){     
                this.propina = 0;
                this.pedido.propina = this.propina;
            }else{          
                this.pedido.propina = this.propina;
            }  
            this. mesaTempo = this.pedido.mesa;
            console.log("datos"+this.pedido+"fecha"+fecha);
            //llamo al servicio para guardar la factura en la BD
            this.metodoPagoService.enviarFactura(this.pedido, fecha, idUsuario, this.metodoP, 
                entrega, devuelta, this.valor1, this.valor2).subscribe(
                (data)=>{    
                    console.log("insert  bueno");    
                        this.verAlerta = false;
                        this.mensajeAlerta = "";            
                        this.modal.hide();  
                        modalDevuelta.show(); 
                        if(this.metodoP == 'MIXTO'){
                            document.getElementById("efectivoMixto").blur();
                        }else{
                            document.getElementById(this.metodoP).blur();
                        }  
                        this.fd = true; 
                },error=>{
                    console.log(<any>error);
                }
            );
            
        }else{
           this.mensajeAlerta = "El valor ingresado no cubre el total de la cuenta";
           this.verAlerta = true;
        }
    }

    sacarPedido(){
        //llamo al servicio para eliminar el archivo json del directorio
        this.metodoPagoService.sacarPedido(this.mesaTempo).subscribe((data)=>{
            console.log("pedido sacado"); 
            this.mesaTempo = "";
            this.padre.numFactura = "";
            this.padre.mesa = "-1";
            this.fd = false;
            this.limpiar(); 
            this.padre.limpiarTodo(); 

        },error=>{
            console.log(<any>error);
        });
    }

    //METODO PARA IMPRIMIR LA FACTURA
    imprimirFactura(){
        let date = new Date();
        let fecha = date.getFullYear()+'-'+( date.getMonth()+1 )+"-"+date.getDate();
        let entrega = this.recibo();
        let devuelta = this.calcularDevuelta();
        /*pedido: Pedido, fecha:string, tipoPago: string, entrega: string, cambio: string, vrTarjeta: string,
        vrEfectivo: string, tipoReporte: string */
        this.metodoPagoService.imprimirFactura(this.pedido, fecha, this.metodoP, entrega, devuelta, 
            this.valor1, this.valor2, "factura").subscribe((dat)=>{console.log("factura impresa");
            },err=>{
            console.log(<any>err);
        });
    }

    saltar(event, metodoP:string){
        let enter = '13';
        if(event.keyCode == enter){
            document.getElementById(metodoP).focus();
        }
    }

    /**************************
     * METODOS MANEJADORES
     * DE EVENTOS
     *************************/
    eventBtnAceptar(modalDevuelta){
        let band:boolean = false;
        let idMetodo:number;
        for(let i = 0; i < this.metodos_pagos.length; i++){
            if(this.metodoP.toLocaleUpperCase() == this.metodos_pagos[i].metodoP.toLocaleUpperCase()){
                band = true;
                idMetodo = this.metodos_pagos[i].idMetodo_pago;
            }
        }
        if(band){
            this.aceptar(idMetodo, modalDevuelta);
        }else{
        this.mensajeAlerta = "Por favor seleccione un metodo de pago";
        this.verAlerta = true;
        }
    }

    //24-11-2017
    eventMetodoP(event, metodoP){     /*   
        this.metodoP =  this.metodoP.toLocaleUpperCase();
        this.saltar(event, metodoP);*/
        this.metodoP =  this.metodoP.toLocaleUpperCase();
        let band = false;
        for(let i = 0; i < this.metodos_nombres.length; i++){
            if(this.metodoP == this.metodos_nombres[i].toLocaleUpperCase()){
                band = true;
            }
        }
        if(band){
            this.fm = false;
            this.saltar(event, metodoP);
        }
    }
    eventPropina(event){
        if(event.keyCode == '13'){//13 es el valor de 'enter' por defecto
            if(this.propina == undefined){
                this.propina = 0;
                this.fp = false;
                document.getElementById("metodoP").focus();
            }else{
                this.fp = false;
                document.getElementById("metodoP").focus();
            }
        }
    }
    eventValor(event, modalDevuelta){
        if(event.keyCode == '13'){            
            this.eventBtnAceptar(modalDevuelta);
        }               
    }
    eventMixto(event){
        if(event.keyCode == '13'){
            document.getElementById("efectivoMixto").focus();
        }
    }

    eventCerrarDevuelta(modal){
        this.sacarPedido();
        this.padre.limpiarTodo();
        this.limpiar(); 
        modal.hide();         
    }

    cobrarPropina():boolean{
        let band = true;
        let domi = 'D';
        let llevar = 'L';
        if(this.mesa.charAt(0).toUpperCase() == domi.toUpperCase() || this.mesa.charAt(0).toUpperCase() == llevar.toUpperCase()){
            this.propina = 0;
            band = false;                      
        }
        return band;
    }

    focusMetodoP(){
        if(this.fm){
            document.getElementById("metodoP").focus();
        }else{
            document.getElementById("metodoP").blur();
        }
    }

    initVal2(){
        this.valor2 = undefined;
    }
    
    focusDevuelta(){
        if(this.fd){
            document.getElementById("cerrarD").focus();
        }else{
            document.getElementById("cerrarD").blur();
        }
    }

}