import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Usuarios } from './usuarios';
import {GLOBAL} from '../global/global';

@Injectable()
export class UsuariosService{
  //variable que representa la url del servidor
  public urlUsuarios: string;
    //metodo constructor
  constructor(private _http: Http){
    this.urlUsuarios = GLOBAL.urlUsuarios;
  }

   //metodo para crear un nuevo usuario
   nuevoUsuario(usuario: Usuarios){
    let nuevoUser= {opcion:'crear', usuario};
    let json = JSON.stringify(nuevoUser);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(this.urlUsuarios, params, {headers: headers});
  }

  //metodo para listar los usuarios
  listarUsuarios(){
    let leerUser= {opcion:'leer'};
    let json = JSON.stringify(leerUser);
    let params = 'json='+json;
		return this._http.get(this.urlUsuarios+'?json='+json).map(res => res.json());
  }
  
  //metodo para listar un usuario por id
 /*listarUsuariosId(id){
    let leerUser= {opcion:'leerid',idUsuario: id};
    let json = JSON.stringify(leerUser);
    let params = 'json='+json;
		return this._http.get(this.urlUsuarios+'?json='+json).map(res => res.json());
	}*/

 
  //metodo para modificar un usuario por id
  modificarUsuario(usuario: Usuarios){
    let modificarUsuario= {opcion:'actualizar', usuario: usuario};
    let json = JSON.stringify(modificarUsuario);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(this.urlUsuarios, params, {headers: headers});
  }

  //metodo para desactivar un usuario por id
  eliminarUsuario(id){
    let leerUser= {opcion:'eliminar',idUsuario: id};
    let json = JSON.stringify(leerUser);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(this.urlUsuarios,params, {headers: headers});
  }

}