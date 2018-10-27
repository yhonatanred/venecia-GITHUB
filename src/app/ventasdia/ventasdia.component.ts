import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { VentasDia } from "app/ventasdia/ventasdia";
import { VentasDiaService } from "app/ventasdia/ventasdia.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'modal-ventas-dia',
  templateUrl: './ventasdia.component.html'
})
export class VentasDiaComponent implements OnInit {


  //DECORA LA CLASE COMO UNA VISTA 'HIJO'
  @ViewChild('ventasDiaModal') modal: ModalDirective;

  public productos;
  public totalVentas: number;
  public efectivo: number;
  public tarjeta: number;
  public domicilios: number;
  public propinas: number;
  public creditos: number;
  public fecha:Date[];
  public descuentoG: number;
  //atributos para la fecha
  datepickerModel: Date;
  bsConfig:any ={
    containerClass: "theme-dark-blue"
  }


  //atributo que representa el padre del componente, es decir desde donde se está invocando
  public padre;
  /*METODO CONSTRUCTOR */
  constructor(private ventasDiaService: VentasDiaService) {
    this.totalVentas = 0;
    this.efectivo = 0;
    this.tarjeta = 0;
    this.creditos = 0;
    this.domicilios = 0;    
    this.propinas = 0;
    this.descuentoG = 0;
    this.productos = [];
    this.fecha = [new Date(), new Date()];
  }


  ngOnInit() { 
    this.cargarVentasDia();
  }

  getModal(): ModalDirective {
    return this.modal;
  }

 limpiarTodo(){
  this.totalVentas = 0;
  this.efectivo = 0;
  this.tarjeta = 0;
  this.creditos = 0;
  this.domicilios = 0;    
  this.propinas = 0;
  this.descuentoG = 0;
  this.productos = [];
 }

  //METODO QUE CARGA LAS VENTAS SEGÚN SU FECHA
  cargarVentasDia() {
    this.limpiarTodo();
    let date1 = this.fecha[0].getFullYear()+"-"+(this.fecha[0].getMonth()+1)+"-"+this.fecha[0].getDate();
    let date2 = this.fecha[1].getFullYear()+"-"+(this.fecha[1].getMonth()+1)+"-"+this.fecha[1].getDate();
    this.ventasDiaService.obtenerVentasDia(date1, date2).subscribe(
      result => {
        if(result.productos.length > 0){
          this.productos = result.productos;
          this.propinas = this.redondear(parseInt(result.prop_desc.propina));
          this.descuentoG = this.redondear(parseInt(result.prop_desc.descuentoG));
          if(result.domicilios != null){
            this.domicilios = this.redondear(parseInt(result.domicilios));
          }          
          let efect = "efectivo";
          let tarj = "tarjeta";
          let cred = "credito";
          for(let i = 0; i < result.metodosP.length; i++){
            let metodo = ""+result.metodosP[i].metodo;
            if(metodo.toLocaleUpperCase() == efect.toLocaleUpperCase()){
              let suma: number= parseInt(result.metodosP[i].suma);
              let devuelta: number = parseInt(result.devuelta);
              this.efectivo = this.redondear(suma - devuelta);
            }else if(metodo.toLocaleUpperCase() == tarj.toLocaleUpperCase()){
              this.tarjeta = this.redondear(parseInt( result.metodosP[i].suma ));
            }else if(metodo.toLocaleUpperCase() == cred.toLocaleUpperCase())
            this.creditos = this.redondear(parseInt( result.metodosP[i].suma ));
          }
          this.calcularTotal(); 
        }                 
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //metodo que me redondea los valores a cientos
  redondear(val:number){
    let n = val/100;
    let v = Math.round(n);
    return (v*100);
  }
  
  calcularTotal(){
    this.totalVentas = this.redondear(this.efectivo+this.tarjeta+this.creditos);
  }

  showModal() {
    this.cargarVentasDia();
    this.modal.show();
  }

  //cierra el modal principal de gustos
  hideModal() {
    this.modal.hide();
  }

 //MANEJADOR DE EVENTOS
 eventBuscar(){
   this.cargarVentasDia();
 }


}//FIN DE LA CLASE
