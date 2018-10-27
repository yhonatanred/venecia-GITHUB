import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'cantidad-pedido',
  templateUrl: './cantidadPedido.component.html'
})
export class CantidadPedido implements OnInit {
    //DECORA LA CLASE COMO UNA VISTA 'HIJO'
 @ViewChild('modalCantidad') modal:ModalDirective;
 @Output() pasarCantidad = new EventEmitter();

    public titulo: string;
    public cantidad: number;
    public alert: boolean;
    public mensaje: string;//variable que muestra el mensaje del alerta
    public fc: boolean;
        constructor(){
            this.titulo = 'CANTIDAD: ';
            this.alert = false;
            this.mensaje = "";
            this.fc = false;
        }
  ngOnInit() {

  }

  focusInput(){
      if(this.fc){
        document.getElementById("cantidad").focus();
      }else{
        document.getElementById("cantidad").blur();
      }      
  }

  showModal(){
      this.modal.show();
      this.fc = true;
      this.focusInput();
  }
  hideModal(){
      this.modal.hide();
      this.cantidad = undefined;
      this.mensaje = "";
      this.alert = false;
      this.fc = false;
  }

  validarCantidad(){
    if(this.cantidad != undefined){
        if(this.cantidad > 0){
          this.pasarCantidad.emit({ datos: this.cantidad });
          this.hideModal();
        }else{
          this.mensaje = "Ingrese una cantidad mayor a cero";
          this.alert = true;
        }
    }else{
        this.mensaje = "Rellene el campo";
        this.alert = true;
    }
  }

  eventInput(event){
      let enter = '13';
      if(event.keyCode == enter){
          this.validarCantidad();
      }
  }
  eventBtnAceptar(){
      this.validarCantidad();
  }

}