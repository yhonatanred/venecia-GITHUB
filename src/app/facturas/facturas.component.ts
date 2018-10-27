import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ModalDirective } from "ngx-bootstrap/modal";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FacturasService } from './facturas.service';
import { MetodoPagoService } from 'app/metodoPago/metodoPago.service';
import { ListaFacturasComponent } from 'app/facturas/listaFacturas.component';
import { Pedido } from 'app/menu/pedido';

@Component({
  selector: 'facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

    //decoradores hijos
    @ViewChild('facturasModal') modal: ModalDirective;
    @ViewChild('listaFacturas') listaFacturas: ListaFacturasComponent;    
    //ATRIBUTOS PARA EL PICKER DE LA FECHA
    public fechaD:Date[];
    datepickerModel: Date;
    bsConfig:any ={
      containerClass: "theme-dark-blue"
    }
    //ATRIBUTO PARA METODO DE PAGO
    public MIXTO:string = "MIXTO";
    public EFECTIVO:string = "EFECTIVO";
    public TARJETA:string = "TARJETA";
    //ATRIBUTOS
    public mesa: string;
    public descuentoG: number;
    public propina: number;
    public subTotal: number;
    public total: number;
    public fecha: string;
    public numFactura;
    public productos;
    public cajero: string;
    public nombreC: string;
    public direccionC:string;
    public telefonoC: string;
    public empresaC: string;
    public devuelta: number;
    public buscarPor:string;
    public dato;
    /*********************************************
     * VARIABLES QUE ME REPRESENTAN LOS METODOS
     * Y ACCIONES DE PAGO
     ********************************************/
    public metodos_pagos;//variable que me representa los diferentes metodos de pagos que hay en la BD
    // public vista:number;//representa la vista de los input ---efectivo, tarjeta o credito
     public valor1:number;     
     public valor2:number; 
     public verAlerta:boolean;
     public mensajeAlerta:string;
     //variable que represnta el metodo de pago
     public metodoP: string;
     //variable que representa los nombres de los metodos de pago
     public metodos_nombres;
     public fm: boolean;//variable que me representa el foco en el input 'metodoPago'  
     public vrTotal: number;
     public editar: boolean;
     public pedido;
     public pagoAnterior: string;

    constructor(private metodoPagoService: MetodoPagoService, private facturaService: FacturasService){
        this.mesa = "";
        this.descuentoG = 0;
        this.propina = 0;
        this.subTotal = 0;
        this.total = 0;
        this.devuelta = 0;
        this.fecha = "";
        this.productos = [];
        //inicializo las variables de los meodos de pago
        this.metodos_pagos = [];
        this.metodos_nombres = [];  
        this.pedido = [];
       // this.valor1 = this.valor2 = 0;
        //this.vista = -1;
        this.verAlerta = false;
        this.mensajeAlerta = "";
        this.metodoP = "";
        this.fm = false;
        this.vrTotal = this.total;
        this.editar = false;
        this.cajero = "";
        this.pagoAnterior = "";
        this.buscarPor = "numFactura";
        this.dato = "";
    }
    ngOnInit(){
        this.obtenerMetodos_de_pago();
        this.fechaD = [new Date(), new Date()];
    }

    showModal(){
        this.modal.show();
    }

    hideModal(){        
        this.limpiar();
        this.modal.hide();        
    }
    calcularSubTotal(){
        let subTotal = 0;
        for(let i = 0; i < this.productos.length; i++){
            subTotal += (this.productos[i].cantidad * this.productos[i].precioP);
        }
        this.subTotal = this.redondear(subTotal);
    }
    calcularTotal(): number{
        let total:number = 0;
        for(let i = 0; i < this.productos.length; i++){
            total += (this.productos[i].cantidad * this.productos[i].precioP) - (this.productos[i].descuentoP * this.productos[i].precioP)/100;
        }
        total += this.propina;
        total -= this.descuentoG;
        return this.total =  this.redondear(total);
    }

    
    cargarInfo(numFactura: number){
        
        this.facturaService.obtenerFactura_X_numero(numFactura).subscribe(result=>{
            this.productos = result.productos;
            this.pedido = result;
            if(this.productos.length > 0){
                this.numFactura = parseInt(result.infoFactura.numFactura);
                this.descuentoG = parseInt(result.infoFactura.descuentoF);
                this.propina = parseInt(result.infoFactura.propina);
                this.fecha = result.infoFactura.fechaF;
                this.productos = result.productos;
                this.nombreC = result.infoFactura.nombreCompleto;
                this.direccionC = result.infoFactura.direccionC;
                this.telefonoC = result.infoFactura.telefonoC;
                this.empresaC = result.infoFactura.empresa;
                this.cajero = result.infoFactura.cajero;
                this.devuelta = result.infoFactura.devuelta;
                this.mesa = result.infoFactura.mesa;
                this.empresaC = result.infoFactura.empresa;
                if(result.metodosPago.length == 2){
                    this.metodoP = this.MIXTO;
                    this.pagoAnterior = this.MIXTO;
                    if(result.metodosPago[0].metodo == this.EFECTIVO){
                        this.valor1 = parseInt(result.metodosPago[0].valor);
                    }
                    if(result.metodosPago[1].metodo == this.TARJETA){
                        this.valor2 = parseInt(result.metodosPago[1].valor);
                    }
                }else{
                    this.metodoP = result.metodosPago[0].metodo;
                    this.pagoAnterior = result.metodosPago[0].metodo;
                    this.valor1 = parseInt(result.metodosPago[0].valor);
                }
                this.calcularSubTotal();
                this.calcularTotal();
                console.log(result);
            }else{
                this.limpiar();
            }
            
        },error=>{
            console.log(<any>error);
        });
    }
    formato(){
        let cad = ""+this.valor1; 
        let aux = ""; 
        let cont = 0;      
        if(cad.length > 3){
            for(let i = cad.length-1; i >= 0; i--){    
                aux = cad.charAt(i)+""+aux;            
                if(cont%2 == 0 && cont > 0 && i > 0){
                    aux = "."+aux;
                }
                ++cont;
                
            }
        } 
        console.log("formato: "+aux);
    }
    

    //MANEJO TODAS LAS ACCIONES DE LOS METODOS DE PAGO
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
    limpiar(){
        this.valor1 = this.valor2 = undefined;
        this.numFactura = undefined;
        //this.vista = -1;
        this.verAlerta = false;
        this.mensajeAlerta = "";
        this.metodoP = "";
        this.vrTotal = 0;
        this.mesa = "";
        this.descuentoG = 0;
        this.propina = 0;
        this.subTotal = 0;
        this.total = 0;
        this.devuelta = 0;
        this.fecha = "";
        this.productos = [];
        this.fm = false;
        this.editar = false;
        this.cajero = "";
        this.dato = "";
        this.buscarPor="numFactura";
        this.nombreC = "";
        this.direccionC = "";
        this.telefonoC = "";
        this.empresaC = "";
    }
    //METODOS DE CALCULOS
    calcularDevuelta():number{                  
        return ( this.recibo() - this.vrTotal);
    }
    /*calcularTotal(){//calcula el total a pagar según la propina
        if(this.propina == undefined){            
            return this.redondear(this.total);
        }else{            
            return this.redondear(this.total + this.propina);
        }        
    }*/
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
    focusMetodoP(){
        if(this.fm){
            document.getElementById("metodoP").focus();
        }else{
            document.getElementById("metodoP").blur();
        }
    }
    eventMetodoP(event, metodoP){     /*   
        this.metodoP =  this.metodoP.toLocaleUpperCase();
        this.saltar(event, metodoP);*/
        this.metodoP =  this.metodoP.toLocaleUpperCase();
        let band = false;
        for(let i = 0; i < this.metodos_nombres.length; i++){
            console.log(this.metodos_nombres[i].toLocaleUpperCase()+" metodo>P: "+this.metodoP);
            if(this.metodoP == this.metodos_nombres[i].toLocaleUpperCase()){
                band = true;
            }
        }
        if(band){
            this.fm = false;
            this.saltar(event, metodoP);
            console.log("entra band");
        }
    }
    saltar(event, metodoP:string){
        let enter = '13';
        if(event.keyCode == enter){
            console.log("metodo__:: "+metodoP);
            document.getElementById(metodoP).focus();
        }
    }
    
    eventMixto(event){
        if(event.keyCode == '13'){
            document.getElementById("efectivoMixto").focus();
        }
    }

    eventEditar(){
        if(this.productos.length > 0){
            this.editar = true;
        }        
    }
    validarPago(){
        let entrega:number = (this.valor1 + this.valor2);
        if(entrega >= this.vrTotal){
            return true;
        }else{
            return false;
        }
    }
    guardar(){
        if(this.validarPago()){
            this.devuelta = ( this.recibo() - this.vrTotal);     
            let infoFactura = {
                nombre: this.nombreC,
                telefono: this.telefonoC,
                direccion: this.direccionC,
                empresa: this.empresaC,
                entrega: (this.valor1 + this.valor2),
                devuelta: this.devuelta,
                consecFactura: this.numFactura
            };
            console.log("variable: ", infoFactura);
            this.facturaService.actualizar_info_Factura(infoFactura, this.pagoAnterior, this.metodoP, this.valor1, 
                this.valor2, this.devuelta, this.propina).subscribe((data)=>{
                    console.log(data);
                },error=>{
                    console.log(<any>error);
                });
            this.editar = false;
            this.mensajeAlerta = "";
            this.verAlerta = false;
        }else{
            this.mensajeAlerta = "El valor entregado no cubre el total";
            this.verAlerta = true;
        }        
    }
    eventGuardar(){
        if(this.valor2 == undefined){
            this.valor2 = 0;            
        }
        this.guardar();
        console.log("entra");
    }
    verFactura(){
        let numFactura = 'numFactura';
        if(this.buscarPor == numFactura){
            return true;
        }else{
            return false;
        }
    }
    
    buscarFacturas(){
        if(this.buscarPor == 'fecha'){
            let date1 = this.fechaD[0].getFullYear()+"-"+(this.fechaD[0].getMonth()+1)+"-"+this.fechaD[0].getDate();
            let date2 = this.fechaD[1].getFullYear()+"-"+(this.fechaD[1].getMonth()+1)+"-"+this.fechaD[1].getDate();
            let date = [date1, date2];
            this.listaFacturas.buscarFacturas(date, this.buscarPor);
        }else{
            this.listaFacturas.buscarFacturas(this.dato, this.buscarPor);
        }        
    }

    eventCargarInfo(numFactura, event){
        let enter = '13';
        if(event.keyCode == enter){
            this.cargarInfo(numFactura);
        }
    }

    //19-12-2017
    //metodo que me imprime la factura
    imprimir(){
        
               let infoBasica;
               infoBasica = {
                   direccion: this.pedido.infoFactura.direccionC,
                   empresa: this.pedido.infoFactura.empresa,
                   mesero: this.pedido.infoFactura.mesero,
                   nombreC: this.pedido.infoFactura.nombreCompleto,
                   telefono: this.pedido.infoFactura.telefonoC
               };
               let horaP = this.pedido.infoFactura.horaF;
               let pe = new Pedido(this.pedido.productos, this.subTotal, this.propina, this.descuentoG, this.total,
                       this.mesa, infoBasica, 0, horaP, this.numFactura, true, this.descuentoG, "");
               console.log(pe);
               let entrega:number = (this.valor1 + this.valor2);
               this.metodoPagoService.imprimirFactura(pe, this.pedido.infoFactura.fechaF, this.metodoP, entrega, this.devuelta, 
                   this.valor1, this.valor2, "factura").subscribe((dat)=>{
                   console.log(dat);
                   },err=>{
                   console.log(<any>err);
               });
           }
   
    
}