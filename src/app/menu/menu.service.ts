import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global/global';
import { Pedido } from "app/menu/pedido";

@Injectable()
export class MenuService{
  //variable que representa la url del servidor
  public urlPedidoTempo: string;
    //metodo constructor
  constructor(private http: Http){
    this.urlPedidoTempo = GLOBAL.urlServicioTemporal;//obtengo la url que almacena los archivos temporales de los pedidos pendiente
  }

  //metodo para almacenar un pago, recibe como argumento el tipo: (mesa, llevar o dimicilio) y toda la info del pedido 
  enviarPedido(pedido: Pedido){
    let datos = {accion: "generar", pedido: pedido};    
    let json = JSON.stringify(datos);
    let params = 'pedidoJson='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    return this.http.post(this.urlPedidoTempo, params, {headers: headers}); 
  }

  //metodo para almacenar un pago, recibe como argumento el tipo: (mesa, llevar o dimicilio) y toda la info del pedido 
  enviarPedidoNuevo(pedido: Pedido){
    let datos = {accion: "generarNuevo", pedido: pedido};    
    let json = JSON.stringify(datos);
    let params = 'pedidoJson='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    return this.http.post(this.urlPedidoTempo, params, {headers: headers}); 
  }

    //metodo para almacenar un pago, recibe como argumento el tipo: (mesa, llevar o dimicilio) y toda la info del pedido 
    cambioMesa(pedido: Pedido){
      let datos = {accion: "cambioMesa", pedido: pedido};    
      let json = JSON.stringify(datos);
      let params = 'pedidoJson='+json;
      let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
  
      return this.http.post(this.urlPedidoTempo, params, {headers: headers}); 
    }


  //METODO QUE ME AGREGA MAS PRODUCTOS A UN PEDIDO
  actualizarPedido(pedido: Pedido){
    let datos = {accion: "actualizar", pedido: pedido};    
    let json = JSON.stringify(datos);
    let params = 'pedidoJson='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    return this.http.post(this.urlPedidoTempo, params, {headers: headers}); 
  }

  buscarNoEnviados(mesa:string){    
    let datos = {accion: "buscarNoEnviados", mesa: mesa}; 
    let json = JSON.stringify(datos);
    let params = 'pedidoJson='+json; 
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
 
    //retorno el servicio del json convocado al backend
    return this.http.get(this.urlPedidoTempo+'?'+params).map(res => res.json());
  }

  //19-12-2017
  imprimir(pedido: Pedido){
    let datos = {accion: "imprimir", pedido: pedido};    
    let json = JSON.stringify(datos);
    let params = 'pedidoJson='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    return this.http.post(this.urlPedidoTempo, params, {headers: headers}); 
  }

    }//Fin de la clase