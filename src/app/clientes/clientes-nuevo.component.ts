import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { ClientesService } from './clientes.service';
import { Clientes } from './clientes';
import { ClientesListaComponent } from "./clientes-lista.component";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PedidoComponent } from 'app/pedidos/pedido.component';


@Component({
  selector: 'clientes-nuevo',
  templateUrl: './clientes-nuevo.component.html'
})
export class ClientesNuevoComponent implements OnInit {

  //DECORA LA CLASE COMO UNA VISTA 'HIJO'
  @ViewChild('modalNuevoCliente') modal: ModalDirective;
  @Input() telefonoC: string;

  @Output() pasarCliente = new EventEmitter();

  //variables que se muestran en el modal
  private nuevoCliente: string = 'Nuevo Cliente';
  private cancelar: string = 'Cancelar';
  private guardar: string = 'Guardar';
  private ocultar: boolean;
  private mostrarAlert = false;

  // objeto Clientes
  public cliente: Clientes;

  //metodo constructor
  constructor(
    private _clientesService: ClientesService,
    private alert: ClientesListaComponent
  ) {
    this.cliente = new Clientes(null, '', '', '', '', '', '', '', true);
  }

  //metodo que guarda una nuevo Cliente llamando al servicio 'clientesService'
  guardarCliente(modal) {
    this.pasarCliente.emit({ datos: this.cliente });
    this._clientesService.nuevoCliente(this.cliente).map(result => result).subscribe(
      result => {
        this.alert.listarClientess();
        if (result.text() == "true") {
          this.cliente = new Clientes(null, '', '', '', '', '', '', '', true);
          modal.hide();
        }else{
          this.mostrarAlert = true;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
    this.mostrarAlert = false;
  }
  mostrarModal() {
    if (this.telefonoC == "") {
      this.ocultar = true;
    } else {
      this.ocultar = false;
    }
    this.cliente = new Clientes(null, this.telefonoC, '', '', '', '', '', '', true);
    this.modal.show();
  }


  ngOnInit() {
  }

  saltar(event){
    if(event.keyCode == '13'){
    }
  }

}
