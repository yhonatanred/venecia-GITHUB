import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Productos} from './Productos';
import {GLOBAL} from '../global/global';
import { Gustos } from "app/gustos/gustos";

@Injectable()
export class ProductosService{
  //variable que representa la url del servidor
  public urlProductos: string;
    //metodo constructor
  constructor(private http: Http){
    this.urlProductos = GLOBAL.urlProductos;
  }

  //metodo para crear un nuevo producto
  nuevoProductCongustos(producto: Productos, gustos){
   let datos = {accion: "crear", producto: producto, gustos: gustos};    
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlProductos, params, {headers: headers});    
  }

  nuevoProducto(producto: Productos){
   let datos = {accion: "crear", producto: producto};    
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlProductos, params, {headers: headers});    
  }

  nuevoProducto_gustos(producto: Productos, gustos:Gustos){
   let datos = {accion: "crearPyG", producto: producto, gustos: gustos};    
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlProductos, params, {headers: headers});    
  }

  obtenerProductos(){    
   let datos = {accion: "leer"};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlProductos+'?productJson='+json).map(res => res.json());    
  }

  obtenerDetallesP(){    
   let datos = {accion: "detalles"};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlProductos+'?productJson='+json).map(res => res.json());
  }

  actualizarProducto(producto: Productos, activo:boolean, idAnterior:number){
   let act = 1;
   if(!activo){
     act = 0;
   }
   let datos = {accion: "actualizar", producto: producto, activo:act, idAnterior:idAnterior};    
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlProductos, params, {headers: headers});    
  }
  actualizarProducto_con_gustos(producto: Productos, activo:boolean, idAnterior:number, gusto:Gustos){
   let act = 1;
   if(!activo){
     act = 0;
   }
   let datos = {accion: "actualizarPyG", producto: producto, activo:act, idAnterior:idAnterior, gustos:gusto};    
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlProductos, params, {headers: headers});    
  }


  //metodo que retorna los ids de los gustos con los ids de los productos que tienen gustos
  obtenerGustos_de_Productos(){
    let datos = {accion: "obtenerGustosP"};    
    let json = JSON.stringify(datos);
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    //retorno el servicio del json convocado al backend
    return this.http.get(this.urlProductos+'?productJson='+json).map(res => res.json());    
  }

  cambiarEstado(idProducto:number, estado:boolean){
   let activo = 1;
   if(!estado){
     activo = 0;
   }
   let datos = {accion: "estado", activo:activo, idProducto:idProducto};    
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlProductos, params, {headers: headers}); 
  }

  // yhonatan
  obtenerProductosId(idSubCategoria){    
    let datos = {accion: "leerId", id: idSubCategoria};    
    let json = JSON.stringify(datos);
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
 
    //retorno el servicio del json convocado al backend
    return this.http.get(this.urlProductos+'?productJson='+json).map(res => res.json());    
   }

   
   //OBTIENE LOS PRODUCTOS POR SU IDPRODUCTO --fecha:06-11-2017
   obtenerProductos_X_codigo(idProducto:string){
    let datos = {accion: "prodXid", idProducto: idProducto};    
    let json = JSON.stringify(datos);
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
 
    //retorno el servicio del json convocado al backend
    return this.http.get(this.urlProductos+'?productJson='+json).map(res => res.json());
   }

   //OBTIENE LOS IDS DE LOS PRODUCTOS---fecha:06-11-2017
   obtenerIds_de_Productos(){
    let datos = {accion: "obtenerIds"};    
    let json = JSON.stringify(datos);
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
 
    //retorno el servicio del json convocado al backend
    return this.http.get(this.urlProductos+'?productJson='+json).map(res => res.json());
   }

   //OBTIENE LOS PRODUCTOS POR SU NOMBRE EN COMUN
   buscarProducto(nombre: string){
    let datos = {accion: "buscar_comun", nombre: nombre};    
    let json = JSON.stringify(datos);
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
     
    //retorno el servicio del json convocado al backend
    return this.http.get(this.urlProductos+'?productJson='+json).map(res => res.json());
   }


    }//Fin de la clase