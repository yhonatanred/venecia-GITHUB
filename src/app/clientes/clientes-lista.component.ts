import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ClientesService } from './clientes.service';
import { Clientes } from './clientes';
import { Router, ActivatedRoute, Params } from '@angular/router';



@Component({
  selector: 'clientes-lista',
  templateUrl: './clientes-lista.component.html'
})
export class ClientesListaComponent implements OnInit {

  
  public clientes: Clientes[];
  public filterQuery = "";
  public rowsOnPage = 5;
  public sortBy = "nombre";
  public sortOrder = "asc";
  //variables a utilizar
  private idCliente: number;
  private clienteVerEditar: Clientes;

  private titulo:string;
  private opcion:string;
  private nombreBoton:string;
  private telefono = "";

  //metodo constructor
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _clientesService: ClientesService)
  {
    this.clienteVerEditar = new Clientes(null,'','','', '', '', '', '', true );
  }
  
  mostrarModal(modal){
    modal.mostrarModal();
  }


  listarClientess(){
		this._clientesService.listarClientes().subscribe(
      result => {
          this.clientes = result;
          console.log(this.clientes);
			},
			error => {
				console.log(<any>error);
			}
		); 
  }

  clientesDetalles(clientes, modal){
    this.clienteVerEditar = clientes;
    this.opcion = 'ver';
    this.titulo = 'Detalles cliente';
    this.nombreBoton = 'Modificar';
    modal.show();
    
  }

  clientesEditar(clientes, modal){
    this.clienteVerEditar = clientes;
    this.opcion = 'modificar';
    this.titulo = 'Modificar cliente';
    this.nombreBoton = 'Guardar';
    modal.show();
    
    //this.correcto = 'no';
  }

  guardarCliente(modal):void{ 
    this._clientesService.modificarCliente(this.clienteVerEditar).subscribe(
      result => {
        
        this.listarClientess();
            },
            error => {
                console.log(<any>error);
            }
        );
    modal.hide();
    //this.correcto = 'si';
  }

  confirmaEliminar(i, modalEliminar){
    this.idCliente = i;
    modalEliminar.show();
  }

  clientesEliminar( modalEliminar){
    this._clientesService.eliminarCliente(this.idCliente).subscribe(
      result => {
          
        this.listarClientess();
            },
            error => {
                console.log(<any>error);
            }
        );
    this.idCliente = null;
    modalEliminar.hide();
  }

  
  cancelar(modal){
    this.listarClientess();
    modal.hide();
  }
  ngOnInit() {
    console.log('productos-list.component.ts cargado.');
    this.listarClientess();
  }

}
