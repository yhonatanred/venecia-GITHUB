import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Categoria} from './categoria';
import {GLOBAL} from '../global/global';

@Injectable()
export class CategoriaService{
  //variable que representa la url del servidor
  public urlCategoria: string;
  public categorias: string[];
    //metodo constructor
  constructor(private http: Http){
    this.urlCategoria = GLOBAL.urlCategoria;
  }

  //metodo para crear una nueva categoria
  nuevaCategoria(nombreCateg: string){
   let datos = {accion: "crear", nombre: nombreCateg};    
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlCategoria, params, {headers: headers});    
  }

  //metodo para obtener los nombre de todas las categorias en la BD
  obtenerCategorias(){    
   let datos = {accion: "leer"};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlCategoria+'?productJson='+json).map(res => res.json());    
  }

  //metodo para buscar categorias con nombres en comun
  buscarCategoria(nombreCateg:string){    
   let datos = {accion: "buscar", nombre: nombreCateg};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlCategoria+'?productJson='+json).map(res => res.json());    
  }

  modificarCategorias(idCateg: number, nombreNuevo:string){
   let datos = {accion: "actualizar", id: idCateg, nombreNuev: nombreNuevo}; 
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlCategoria, params, {headers: headers});
  }

  eliminarCategoria(idCateg: number, desactiva: boolean){
   let datos = {accion: "eliminar", id:idCateg, desactivar: desactiva}; 
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlCategoria, params, {headers: headers});
  }
    }//Fin de la clase