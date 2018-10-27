import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Gustos} from '../gustos/Gustos';
import {GLOBAL} from '../global/global';

@Injectable()
export class GustosService{
  //variable que representa la url del servidor
  public urlGustos: string;
    //metodo constructor
  constructor(private http: Http){
    this.urlGustos = GLOBAL.urlGustos;
  }

  //metodo para obtener los gustos
 obtenerGustos(){    
   let datos = {accion: "leer"};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlGustos+'?gustosJson='+json).map(res => res.json());    
  }

  //metodo que obtiene los gustos segun su categoria
  obtenerGustosXcateg(idCateg: number){    
   let datos = {accion: "buscar", idCateg: idCateg};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlGustos+'?gustosJson='+json).map(res => res.json());    
  }

  //metodo que obtiene de un producto
  obtenerGustosXproducto(idProducto: string){
  let datos = {accion: "buscarXprod", idProducto: idProducto};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlGustos+'?gustosJson='+json).map(res => res.json());    
  }

  crearGusto(gusto: Gustos){
    let datos = {accion: "crear", gusto:gusto};
    let json = JSON.stringify(datos);
    let params = 'gustosJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlGustos, params, {headers: headers}); 
  }

  eliminarGusto(idGusto:number){
    let datos = {accion: "eliminar", idGusto:idGusto};
    let json = JSON.stringify(datos);
    let params = 'gustosJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlGustos, params, {headers: headers}); 
  }

  actualizarGusto(idGusto:number, nGusto:string){
    let datos = {accion: "actualizar", idGusto:idGusto, gusto:nGusto};
    let json = JSON.stringify(datos);
    let params = 'gustosJson='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    return this.http.post(this.urlGustos, params, {headers: headers}); 
  }

    }//Fin de la clase