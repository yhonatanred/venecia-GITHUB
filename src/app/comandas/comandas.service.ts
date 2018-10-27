import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global/global';

@Injectable()
export class ComandasService{
  //variable que representa la url del servidor
  public urlComanda: string;
    //metodo constructor
  constructor(private http: Http){
    this.urlComanda = GLOBAL.urlComanda;//obtengo la url que almacena los archivos temporales de los pedidos pendiente
  }

  //metodo para obtener los gustos
 obtenerComandas(){    
   let datos = {accion: "leer"}; 
   let json = JSON.stringify(datos);
   let params = 'comandaJson='+json; 
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlComanda+'?'+params).map(res => res.json());    
  }

  

  

    }//Fin de la clase