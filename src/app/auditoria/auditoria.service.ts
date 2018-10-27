import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global/global';

@Injectable()
export class AuditoriaService{
  //variable que me representa la url del servidor
  public urlAuditoria:string;
    //metodo constructor
  constructor(private http: Http){
    this.urlAuditoria = GLOBAL.urlAuditoria;
  }

   //metodo para obtener los descuentos globales
 obtenerDescuentos_globales(fecha1:string, fecha2:string){    
  let datos = {accion: "descuentoGlobal", fecha1:fecha1, fecha2:fecha2};    
  let json = JSON.stringify(datos);
  let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

  //retorno el servicio del json convocado al backend
  return this.http.get(this.urlAuditoria+'?json='+json).map(res => res.json());    
 } 
 obtenerDescuentos_productos(fecha1:string, fecha2:string){    
  let datos = {accion: "descuentosProductos", fecha1:fecha1, fecha2:fecha2};    
  let json = JSON.stringify(datos);
  let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

  //retorno el servicio del json convocado al backend
  return this.http.get(this.urlAuditoria+'?json='+json).map(res => res.json());    
 }
 obtenerEnviados_Borrados(fecha1:string, fecha2:string){
  let datos = {accion: "obtenerEnviadosBorrados", fecha1:fecha1, fecha2:fecha2};    
  let json = JSON.stringify(datos);
  let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

  //retorno el servicio del json convocado al backend
  return this.http.get(this.urlAuditoria+'?json='+json).map(res => res.json());  
 }
 obtenerNoEnviados_Borrados(fecha1:string, fecha2:string){
  let datos = {accion: "obtenerNoEnviadosBorrados", fecha1:fecha1, fecha2:fecha2};    
  let json = JSON.stringify(datos);
  let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

  //retorno el servicio del json convocado al backend
  return this.http.get(this.urlAuditoria+'?json='+json).map(res => res.json());  
 }

 
  
}//Fin de la clase