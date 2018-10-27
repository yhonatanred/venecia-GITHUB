import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ModalDirective } from "ngx-bootstrap/modal";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CierreDeCajaService } from 'app/cierreDeCaja/cierreDeCaja.service';
import { PedidoService } from 'app/pedidos/pedido.service';

@Component({
  selector: 'cierre-de-caja',
  templateUrl: './cierreDeCaja.component.html',
  styleUrls: ['./cierreDeCaja.component.scss']
})
export class CierreDeCajaComponent implements OnInit {
    @ViewChild('confirmarModal') modal: ModalDirective;

    public mensaje:string;
    constructor(private cierreDeCajaService: CierreDeCajaService, private pedidoService: PedidoService){
        this.mensaje = "";
    }

    ngOnInit(){

    }

    showModal(){
        this.modal.show();
    }
    hideModal(){
        this.modal.hide();
    }

    cerrarCaja(mensajeModal){
        this.cierreDeCajaService.cerrarCaja().subscribe((data)=>{
            this.mensaje = "Zeta generada satisfactoriamente!!!";
            console.log(data);
        },error=>{
            console.log(<any>error);
        });
        this.modal.hide();
        mensajeModal.show();        
    }

    //METODO QUE ME VERIFICA QUE NO HALLA MESAS ABIERTAS; ES DECIR QUE NO HALLA PEDIDOS PENDIENTES
    verificarMesas_cerradas(mensajeModal){
        this.pedidoService.obtenerPedidos().subscribe(result=>{
            if(result.length > 0){
                this.mensaje = "Hay mesas abiertas. No se puede cerrar la caja";
                mensajeModal.show();
                this.modal.hide();
            }else{
                this.cerrarCaja(mensajeModal);
            }
            
        },error=>{
            console.log(<any>error);
        });
    }
}