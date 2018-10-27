import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {GLOBAL} from '../global/global';
import { Pedido } from "app/menu/pedido";

@Injectable()
export class MetodoPagoService{
  //variable que representa la url del servidor
  public urlFacturar: string;
  public urlPedidoTempo: string;
    //metodo constructor 
  constructor(private http: Http){
    this.urlFacturar = GLOBAL.urlFacturar;
    this.urlPedidoTempo = GLOBAL.urlServicioTemporal;
  }

  //ENVIA EL PEDIDO CON LOS DATOS DE LA FACTURA AL SERVIDOR
  enviarFactura(pedido: Pedido, fecha:string, idUsuario:number, tipoPago:string, 
    entrega:number, devuelta:number, vrTarjeta: number, vrEfectivo: number){
    let datos = {accion: "pagar", pedido: pedido, fecha: fecha, idUsuario: idUsuario, 
    tipoPago: tipoPago, entrega: entrega, devuelta: devuelta, vrTarjeta: vrTarjeta, 
    vrEfectivo: vrEfectivo, abrir_caja: "abrir"};    
    let json = JSON.stringify(datos);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    return this.http.post(this.urlFacturar, params, {headers: headers}); 
  }

  imprimirFactura(pedido: Pedido, fecha:string, tipoPago: string, entrega: number, cambio: number, vrTarjeta: number,
                  vrEfectivo: number, tipoReporte: string){
    let datos = {accion: "imprimir", pedido: pedido, fecha: fecha, tipoPago: tipoPago, entrega: entrega, cambio: cambio,
                  vrTarjeta: vrTarjeta, vrEfectivo: vrEfectivo, tipoReporte: tipoReporte};
    let json = JSON.stringify(datos);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    return this.http.post(this.urlFacturar, params, {headers: headers}); 
  }


  sacarPedido(mesa: string){
    let datos = {accion: "pagar", mesa: mesa};    
    let json = JSON.stringify(datos);
    let params = 'pedidoJson='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    return this.http.post(this.urlPedidoTempo, params, {headers: headers}); 
  }

  //CONSULTA LOS METODOS DE PAGO QUE EXISTEN EN LA BD
  obtenerMetodos_de_Pago(){
  let datos = {accion: "metodos"}; 
   let json = JSON.stringify(datos);
   let params = 'json='+json; 
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlFacturar+'?'+params).map(res => res.json());   
  }

}