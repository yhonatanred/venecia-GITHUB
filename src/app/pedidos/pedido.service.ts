import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global/global';
import { Pedido } from 'app/menu/pedido';

@Injectable()
export class PedidoService{
  //variable que representa la url del servidor
  public urlPedidoTempo: string;
  public urlFacturar: string;
  public urlProductos: string;
  public urlAuditoria: string;
    //metodo constructor
  constructor(private http: Http){
    this.urlPedidoTempo = GLOBAL.urlServicioTemporal;//obtengo la url que almacena los archivos temporales de los pedidos pendiente
    this.urlFacturar = GLOBAL.urlFacturar;
    this.urlProductos = GLOBAL.urlProductos;
    this.urlAuditoria = GLOBAL.urlAuditoria;
  }

  //metodo para obtener los gustos
 obtenerPedidos(){    
   let datos = {accion: "cargar"}; 
   let json = JSON.stringify(datos);
   let params = 'pedidoJson='+json; 
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlPedidoTempo+'?'+params).map(res => res.json());    
  }

  //metodo para almacenar un pago, recibe como argumento el tipo: (mesa, llevar o dimicilio) y toda la info del pedido 
  pagarPedido(tipo: string, pedido){
    let datos = {accion: "pagar", pedido: pedido, tipo: tipo};    
    let json = JSON.stringify(datos);
    let params = 'pedidoJson='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    return this.http.post(this.urlPedidoTempo, params, {headers: headers}); 
  }

  consultarNumFactura(){
   let datos = {accion: "numFactura"}; 
   let json = JSON.stringify(datos);
   let params = 'pedidoJson='+json; 
   let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

   //retorno el servicio del json convocado al backend
   return this.http.get(this.urlPedidoTempo+'?'+params).map(res => res.json());   
  }

  //consulta el consecutivo del domicilio
  consultarNumDomicilio(){
    let datos = {accion: "consecDomicilio"}; 
     let json = JSON.stringify(datos);
     let params = 'pedidoJson='+json; 
     let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
  
     //retorno el servicio del json convocado al backend
     return this.http.get(this.urlPedidoTempo+'?'+params).map(res => res.json());   
    }

     //consulta el consecutivo de un pedido para llevar
  consultarNumLlevar(){
    let datos = {accion: "llevar"}; 
     let json = JSON.stringify(datos);
     let params = 'pedidoJson='+json; 
     let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
  
     //retorno el servicio del json convocado al backend
     return this.http.get(this.urlPedidoTempo+'?'+params).map(res => res.json());   
    }

    imprimirCuenta(pedido: Pedido, fecha:string, tipoPago: string, entrega: number, cambio: number, vrTarjeta: number,
      vrEfectivo: number, tipoReporte: string){
      let datos = {accion: "imprimir", pedido: pedido, fecha: fecha, tipoPago: tipoPago, entrega: entrega, cambio: cambio,
            vrTarjeta: vrTarjeta, vrEfectivo: vrEfectivo, tipoReporte: tipoReporte};
      let json = JSON.stringify(datos);
      let params = 'json='+json;
      let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

      return this.http.post(this.urlFacturar, params, {headers: headers}); 
      }

      //REEMPLAZA EL FICHERO DE UN PEDIDO
      reemplazarPedido(pedido: Pedido){
        let datos = {accion: "reemplazar", pedido: pedido};    
        let json = JSON.stringify(datos);
        let params = 'pedidoJson='+json;
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    
        return this.http.post(this.urlPedidoTempo, params, {headers: headers}); 
      }

      //CONSULTA EL ULTIMO TR
      consultarTr(){
        let datos = {accion: "tr"}; 
        let json = JSON.stringify(datos);
        let params = 'productJson='+json; 
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
     
        //retorno el servicio del json convocado al backend
        return this.http.get(this.urlProductos+'?'+params).map(res => res.json());   
      }

      //CONSULTA LAS VENTAS ACOMULADAS EN EL DÍA
      ventasAcomuladas(fecha: string){
        let datos = {accion: "acomulado", fecha: fecha}; 
        let json = JSON.stringify(datos);
        let params = 'json='+json; 
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
     
        //retorno el servicio del json convocado al backend
        return this.http.get(this.urlFacturar+'?'+params).map(res => res.json());
      }

      //FUNCION QUE ME GUARDA UN PRODUCTO BORRADO EN LA BD
      //argumentos, producto a eliminar, fecha de eliminacion, hora cuando se elimina
      guardarBorrados(producto, fecha, hora, justificacion){
        let datos = {accion: "guardarBorrado", producto:producto, fecha:fecha, hora:hora, justificacion:justificacion};    
        let json = JSON.stringify(datos);
        let params = 'json='+json;
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    
        return this.http.post(this.urlAuditoria, params, {headers: headers}); 
      }

    }//Fin de la clase