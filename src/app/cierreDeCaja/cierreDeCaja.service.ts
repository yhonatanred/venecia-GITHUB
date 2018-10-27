import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global/global';

@Injectable()
export class CierreDeCajaService{
  //variable que representa la url del servidor
  public urlCerrarCaja: string;
    //metodo constructor
  constructor(private http: Http){
    this.urlCerrarCaja = GLOBAL.urlCerrarCaja;
  }

  //metodo para obtener ventas del dia
  cerrarCaja(){    
   let datos = {accion: "cerrarCaja"};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
   let params = 'json='+json;

   return this.http.post(this.urlCerrarCaja, params, {headers: headers});  
  } 



    }//Fin de la clase