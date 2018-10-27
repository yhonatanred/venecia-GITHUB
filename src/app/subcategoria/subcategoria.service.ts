import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {SubCategoria} from './subcategoria';
import {GLOBAL} from '../global/global';

@Injectable()
export class SubCategoriaService{
  //variable que representa la url del servidor
  public urlSubCategoria: string;
  public subcategorias: string[];
    //metodo constructor
  constructor(private http: Http){
    this.urlSubCategoria = GLOBAL.urlSubCategoria;
  }

  //metodo para crear una nueva categoria
  nuevaSubCategoria(nombreSubCateg: string, idCateg: number, color:string){
   let datos = {accion: "crear", nombre: nombreSubCateg, idCategoria: idCateg, color:color};    
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlSubCategoria, params, {headers: headers});    
  }

  //metodo para obtener los nombre de todas las categorias en la BD
  obtenerSubCategorias(){    
   let datos = {accion: "leer"};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlSubCategoria+'?productJson='+json).map(res => res.json());    
  }

  //metodo que obtiene las subcategorias pertenecientes a una categoria
  obtenerSubCategoriasXcategoria(idCateg:number){    
   let datos = {accion: "leerXcateg", idCategoria: idCateg};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlSubCategoria+'?productJson='+json).map(res => res.json());    
  }

  //metodo para buscar subcategorias con nombres en comun
  buscarSubCategoria(nombreCateg:string){    
   let datos = {accion: "buscar", nombre: nombreCateg};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlSubCategoria+'?productJson='+json).map(res => res.json());    
  }

   //metodo para buscar subcategorias perteneciente a una categoria con nombres en comun
  buscarSubCategoriaXcategoria(nombreCateg:string, idCat: number){    
   let datos = {accion: "buscarXcateg", nombre: nombreCateg, idCategoria:idCat};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlSubCategoria+'?productJson='+json).map(res => res.json());    
  }

  modificarSubCategorias(idSubCateg: number, nombreNuevo:string, color:string){
   let datos = {accion: "actualizar", id: idSubCateg, nombreNuev: nombreNuevo, color:color}; 
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlSubCategoria, params, {headers: headers});
  }

  eliminarSubCategoria(idSubCateg: number, desactiva: boolean){
   let datos = {accion: "eliminar", id:idSubCateg, desactivar: desactiva}; 
   let json = JSON.stringify(datos);
   let params = 'productJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlSubCategoria, params, {headers: headers});
  }


  obtenerSubCategoriasId(idSubcategoria) {
    let datos = { accion: "leerId", idSubcategoria };
    let json = JSON.stringify(datos);

    //retorno el servicio del json convocado al backend
    return this.http.get(this.urlSubCategoria + '?productJson=' + json).map(res => res.json());
  }

    }//Fin de la clase