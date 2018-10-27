import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { UsuariosService } from './usuarios.service';
import { UsuariosListaComponent } from "./usuarios-lista.component";


@Component({
  selector: 'usuarios-nuevo',
  templateUrl: './usuarios-nuevo.component.html'
})
export class UsuariosNuevoComponent implements OnInit {

  //variables que se muestran en el modal
  private nuevoUsuario: string = 'Nuevo Usuario';
  private usuario: string = 'Usuario';
  private rol: string = 'Rol';
  private administrador: string = 'administrador';
  private cajero: string = 'cajero';
  private mesero: string = 'mesero';
  private cancelar: string = 'Cancelar';
  private guardar: string = 'Guardar';

  // objeto Usuarios
  public u: any = {};
  public mostrarAlert:boolean = false;

  //metodo constructor
  constructor(
    private _usuariosService: UsuariosService,
    private alert: UsuariosListaComponent
  ) {
  }

  //metodo que guarda una nuevo Usuario llamando al servicio 'UsuariosService'
  guardarUsuario(modal) {
    this._usuariosService.nuevoUsuario(this.u).subscribe(
      result => {

        this.alert.listarUsuarioss();
        if (result.text() == "true") {
          this.u = {};
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
    this.u = {};
    this.u.rol = 'administrador';
    modal.show();
  }

  ngOnInit() {
  }

}
