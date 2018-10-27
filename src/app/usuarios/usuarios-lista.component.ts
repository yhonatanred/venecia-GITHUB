import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from './usuarios';
import { Router, ActivatedRoute, Params } from '@angular/router';



@Component({
  selector: 'usuarios-lista',
  templateUrl: './usuarios-lista.component.html'
})
export class UsuariosListaComponent implements OnInit {

  
  public usuarios: Usuarios[];
  public filterQuery = "";
  public rowsOnPage = 5;
  public sortBy = "nombre";
  public sortOrder = "asc";
  public prueba;
  //variables a utilizar
  private idUsuario: number;
  private administrador: string = 'administrador';
  private cajero: string = 'cajero';
  private mesero: string = 'mesero';

  private usuarioVerEditar;

  private titulo:string;
  private opcion:string;
  private nombreBoton:string;

  //usuario Que inicio Sesion
  private user: any ={};

  //metodo constructor
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuariosService: UsuariosService)
  {  }

  usuarioInicio(){
    this.user = JSON.parse(sessionStorage.getItem('currentUser')); 
  }
  
  listarUsuarioss(){
		this._usuariosService.listarUsuarios().subscribe(
      result => {
          this.usuarios = result;
          console.log(this.usuarios);
			},
			error => {
				console.log(<any>error);
			}
		); 
  }

  usuariosDetalles(usuario, modal){
    this.usuarioVerEditar = usuario;
    this.opcion = 'ver';
    this.titulo = 'Detalles Usuario';
    this.nombreBoton = 'Modificar';
    modal.show();
    
  }

  usuariosEditar(usuario, modal){
    this.usuarioVerEditar = usuario;
    this.opcion = 'modificar';
    this.titulo = 'Modificar Usuario';
    this.nombreBoton = 'Guardar';
    modal.show();
  }

  guardarUsuario(modal):void{ 
    this._usuariosService.modificarUsuario(this.usuarioVerEditar).subscribe(
      result => {
        
        this.listarUsuarioss();
            },
            error => {
                console.log(<any>error);
            }
        );
    modal.hide();
    //this.correcto = 'si';
  }

  confirmaEliminar(i, modalEliminar){
    this.idUsuario = i;
    modalEliminar.show();
  }

  usuariosEliminar( modalEliminar){
    this._usuariosService.eliminarUsuario(this.idUsuario).subscribe(
      result => {
          
        this.listarUsuarioss();
            },
            error => {
                console.log(<any>error);
            }
        );
    this.idUsuario = null;
    modalEliminar.hide();
  }
  cancelar(modal){
    this.listarUsuarioss();
    modal.hide();
  }

  ngOnInit() {
    console.log('productos-list.component.ts cargado.');
    this.usuarioInicio();
    this.listarUsuarioss();
  }

}
