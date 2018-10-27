import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global/global';

@Injectable()
export class PropinasService{
  //variable que representa la url del servidor
  public urlPropinas: string;
    //metodo constructor
  constructor(private http: Http){
    this.urlPropinas = GLOBAL.urlPropinas;
  }

  //metodo para obtener ventas del dia
 obtenerPropinas_rango(fecha1:string, fecha2: string){    
   let datos = {accion: "verXrango", fecha1:fecha1, fecha2:fecha2};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlPropinas+'?json='+json).map(res => res.json());    
  } 

    }//Fin de la clase