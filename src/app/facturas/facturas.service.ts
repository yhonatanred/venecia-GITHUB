import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global/global';

@Injectable()
export class FacturasService{
  //variable que representa la url del servidor
  public urlFactura: string;
    //metodo constructor
  constructor(private http: Http){
    this.urlFactura = GLOBAL.urlFacturar;
  }

  //metodo para obtener ventas del dia
 obtenerFactura_X_numero(numFact: number){    
   let datos = {accion: "buscarFact_X_num", numFact:numFact};    
   let json = JSON.stringify(datos);
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlFactura+'?json='+json).map(res => res.json());    
  } 

  actualizar_info_Factura(infoFactura, pagoAnterior, pagoActual, valor1, valor2, devuelta, propina){
    let datos = {accion: "actualizarInfo", infoFactura:infoFactura, pagoAnterior:pagoAnterior, 
                pagoActual:pagoActual ,valor1:valor1, valor2:valor2, devuelta:devuelta, propina:propina};    
    let json = JSON.stringify(datos);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    return this.http.post(this.urlFactura, params, {headers: headers}); 
  }

  //METODO QUE ME BUSCA FACTURAS EN EL SERVIDOR POR FECHA O CLIENTE
  buscarFacturas(dato: string, buscarPor:string){
    let datos = {accion: "buscarFact_X_dato", dato:dato, buscarPor:buscarPor};    
    let json = JSON.stringify(datos);
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
 
    //retorno el servicio del json convocado al backend
    return this.http.get(this.urlFactura+'?json='+json).map(res => res.json());
  }

    }//Fin de la clase