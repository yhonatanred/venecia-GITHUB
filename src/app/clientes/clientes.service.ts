import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Clientes } from './clientes';
import {GLOBAL} from '../global/global';

@Injectable()
export class ClientesService{
  //variable que representa la url del servidor
  public urlClientes: string;
    //metodo constructor
  constructor(private _http: Http){
    this.urlClientes = GLOBAL.urlClientes;
  }

   //metodo para crear un nuevo cliente
   nuevoCliente(cliente: Clientes){
    let nuevoCliente= {opcion:'crear', cliente: cliente};
    let json = JSON.stringify(nuevoCliente);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(this.urlClientes, params, {headers: headers});
  }

  //metodo para listar los Clientes
  listarClientes(){
    let leerCliente= {opcion:'leer'};
    let json = JSON.stringify(leerCliente);
    let params = 'json='+json;
		return this._http.get(this.urlClientes+'?json='+json).map(res => res.json());
  }
  
  //metodo para listar un Cliente por id
 /*listarClientesId(id){
    let leerUser= {opcion:'leerid',idCliente: id};
    let json = JSON.stringify(leerUser);
    let params = 'json='+json;
		return this._http.get(this.urlClientes+'?json='+json).map(res => res.json());
	}*/

 
  //metodo para modificar un Cliente por id
  modificarCliente(cliente: Clientes){
    let modificarCliente= {opcion:'actualizar', cliente: cliente};
    let json = JSON.stringify(modificarCliente);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(this.urlClientes, params, {headers: headers});
  }

  //metodo para desactivar un cliente por id
  eliminarCliente(id){
    let eliminarcliente= {opcion:'eliminar',idCliente: id};
    let json = JSON.stringify(eliminarcliente);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(this.urlClientes,params, {headers: headers});
  }

   //DARIO
  //metodo para llamar los clientes por telefono
  buscarCliente_X_tel(telefono: string){
    let buscarCliente= {opcion:'leer_X_tel', telefono: telefono};
    let json = JSON.stringify(buscarCliente);
    let params = 'json='+json;
		return this._http.get(this.urlClientes+'?json='+json).map(res => res.json());
  }


}