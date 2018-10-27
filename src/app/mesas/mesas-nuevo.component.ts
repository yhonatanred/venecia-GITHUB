import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { MesasService } from './mesas.service';
import { Mesas } from './mesas';
import { MesasListaComponent } from "./mesas-lista.component";


@Component({
  selector: 'mesas-nuevo',
  templateUrl: './mesas-nuevo.component.html'
})
export class MesasNuevoComponent implements OnInit {

  //variables que se muestran en el modal
  private nuevaMesa: string = 'Nueva Mesa';
  private cancelar: string = 'Cancelar';
  private guardar: string = 'Guardar';

  // objeto Mesas
  public mesa: Mesas;

  //mostrar alerta
  public mostrarAlert: boolean = false;

  //metodo constructor
  constructor(
    private _mesasService: MesasService,
    private alert: MesasListaComponent
  ) {
    this.mesa = new Mesas(null, '', true);
  }

  //metodo que guarda una nueva Mesa llamando al servicio 'MesasService'
  guardarMesa(modal) {
    this._mesasService.nuevaMesa(this.mesa).subscribe(
      result => {

        this.alert.listarMesass();
        if (result.text() == "true") {
          this.mesa = new Mesas(null, '', true);
          modal.hide();
        } else {
          this.mostrarAlert = true;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
    this.mostrarAlert = false;
  }
  mostrarModal(modal) {
    this.mesa = new Mesas(null, '', true);
    modal.show();
  }

  ngOnInit() {
  }

}
