import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {VentasDia} from '../ventasdia/ventasdia';
import {GLOBAL} from '../global/global';

@Injectable()
export class VentasDiaService{
  //variable que representa la url del servidor
  public urlVentasDia: string;
    //metodo constructor
  constructor(private http: Http){
    this.urlVentasDia = GLOBAL.urlVentasDia;
  }

  //metodo para obtener ventas del dia
 obtenerVentasDia(fecha1:string, fecha2:string){    
   let datos = {accion: "verVentas", fecha1:fecha1, fecha2:fecha2};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlVentasDia+'?json='+json).map(res => res.json());    
  } 

    }//Fin de la clase