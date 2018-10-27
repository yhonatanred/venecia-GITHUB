import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global/global';

@Injectable()
export class ComandaService{
  //variable que representa la url del servidor
  public urlComanda: string;
    //metodo constructor
  constructor(private http: Http){
    this.urlComanda = GLOBAL.urlComanda;
  }

  //metodo para crear una comanda
  nuevaComanda(comanda: string){
   let datos = {accion: "crear", nombre:comanda};    
   let json = JSON.stringify(datos);
   let params = 'comandaJson='+json;
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   return this.http.post(this.urlComanda, params, {headers: headers});    
  }

  verComandas(){   
   let datos = {accion: "leer"};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlComanda+'?comandaJson='+json).map(res => res.json());  
  }


    }//Fin de la clase