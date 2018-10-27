import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {GLOBAL} from '../global/global';

@Injectable()
export class NegocioDetallesService{
  //variable que representa la url del servidor
  public urlNegocioDetalles: string;
    //metodo constructor
  constructor(private _http: Http){
    this.urlNegocioDetalles = GLOBAL.urlNegocioDetalles;
  }
  //metodo para listar los usuarios
  listarDetalles(){
    let leerDetalles= {opcion:'leer'};
    let json = JSON.stringify(leerDetalles);
    let params = 'json='+json;
		return this._http.get(this.urlNegocioDetalles+'?json='+json).map(res => res.json());
  }
 
  //metodo para modificar un usuario por id
  modificarDetalles(detalles){
    let modificarDetalles= {opcion:'actualizar', detalles: detalles};
    let json = JSON.stringify(modificarDetalles);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(this.urlNegocioDetalles, params, {headers: headers});
  }

}