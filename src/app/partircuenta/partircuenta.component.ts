import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Pedido } from "app/menu/pedido";
import { PedidoComponent } from 'app/pedidos/pedido.component';

@Component({
  selector: 'partir-cuenta',
  templateUrl: './partircuenta.component.html',
  styleUrls: ['./partircuenta.component.scss']
})
export class PartirCuentaComponent implements OnInit {

  //DECORA LA CLASE COMO UNA VISTA 'HIJO'
  @ViewChild('partirCuentaModal') modal: ModalDirective;
  @Input() mesaActual: Pedido;
  @Input() mesas: any[];
  @Output() pasarMesas = new EventEmitter();
  public mesaNueva: Pedido;
  public mesita;
  public nombreMesa: string[];
  private mostrarAlert = false;
  private botonGuardar = false;
  /*METODO CONSTRUCTOR */
  constructor(private pedidoComponent: PedidoComponent) {
    this.mesaNueva = new Pedido([], 0, 0, 0, 0, '', [], '', '', '', true, 0, '');
    this.nombreMesa = [];
  }


  nombreMesas() {
    for (let i = 0; i < this.mesas.length; i++) {
      this.nombreMesa[i] = this.mesas[i].mesa;
    }
  }

  guardar() {
    this.pasarMesas.emit({ mesaActual: this.mesaActual, mesaNueva: this.mesaNueva });
    
  }

  ngOnInit() {
    this.mesaActual = new Pedido([], 0, 0, 0, 0, '', [], '', '', '', true, 0, '');
    this.mesas = [];
  }

  showModal() {
    this.nombreMesas();
    this.modal.show();
  }

  //cierra el modal principal de gustos
  hideModal() {
    this.pedidoComponent.cargarPedidos();
    this.mesaNueva = new Pedido([], 0, 0, 0, 0, '', [], '', '', '', true, 0, '');
    this.mesita = "";
    this.mostrarAlert = false;
    this.modal.hide();
  }
  mesaN() {
    for (let i = 0; i < this.mesas.length; i++) {
      if (this.mesita == this.mesaActual.mesa) {
        this.mesaNueva = new Pedido([], 0, 0, 0, 0, '', [], '', '', '', true, 0, '');
        this.mostrarAlert = true;
      } else {
        if (this.mesita == this.mesas[i].mesa) {
          this.mesaNueva = this.mesas[i];
          this.mostrarAlert = false;
        }
      }
    }
  }

  btnGuardar() {
    if (this.mesaActual.productos.length > 0 && this.mesaNueva.productos.length > 0 && this.mesaNueva.mesa != "") {
      this.botonGuardar = true;
    }else{
      this.botonGuardar = false;
    }
    
    this.mesaNueva.subTotal = 0;
    this.mesaActual.subTotal = 0;

    for (let i = 0; i < this.mesaActual.productos.length; i++) {
      this.mesaActual.subTotal += this.pedidoComponent.calcularVT(this.mesaActual.productos[i].precioP, this.mesaActual.productos[i].descuentoP, this.mesaActual.productos[i].cantidad);
    }
    
    this.mesaActual.total = (this.mesaActual.subTotal - this.mesaActual.descuentoG);

    for (let i = 0; i < this.mesaNueva.productos.length; i++) {
      this.mesaNueva.subTotal += this.pedidoComponent.calcularVT(this.mesaNueva.productos[i].precioP, this.mesaNueva.productos[i].descuentoP, this.mesaNueva.productos[i].cantidad);
    }
    
    this.mesaNueva.total = (this.mesaNueva.subTotal - this.mesaNueva.descuentoG);

  }

  

}//FIN DE LA CLASE
