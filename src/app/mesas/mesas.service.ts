import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Mesas } from './mesas';
import {GLOBAL} from '../global/global';

@Injectable()
export class MesasService{
  //variable que representa la url del servidor
  public urlMesas: string;
    //metodo constructor
  constructor(private _http: Http){
    this.urlMesas = GLOBAL.urlMesas;
  }

   //metodo para crear un nueva mesa
   nuevaMesa(mesa: Mesas){
    let nuevaMesa= {opcion:'crear', mesa: mesa};
    let json = JSON.stringify(nuevaMesa);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(this.urlMesas, params, {headers: headers});
  }

  //metodo para listar los Mesas
  listarMesas(){
    let leerMesa= {opcion:'leer'};
    let json = JSON.stringify(leerMesa);
    let params = 'json='+json;
		return this._http.get(this.urlMesas+'?json='+json).map(res => res.json());
  }
  
  //metodo para listar un Mesa por id
 /*listarMesaId(id){
    let leerUser= {opcion:'leerid',idMesa: id};
    let json = JSON.stringify(leerUser);
    let params = 'json='+json;
		return this._http.get(this.urlMesas+'?json='+json).map(res => res.json());
	}*/

 
  //metodo para modificar una Mesa por id
  modificarMesa(mesa: Mesas){
    let modificarMesa= {opcion:'actualizar', mesa: mesa};
    let json = JSON.stringify(modificarMesa);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(this.urlMesas, params, {headers: headers});
  }

  //metodo para desactivar un Mesa por id
  eliminarMesa(id){
    let eliminarMesa= {opcion:'eliminar',idMesa: id};
    let json = JSON.stringify(eliminarMesa);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(this.urlMesas,params, {headers: headers});
  }

}