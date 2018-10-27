import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { MesasService } from './mesas.service';
import { Mesas } from './mesas';
import { Router, ActivatedRoute, Params } from '@angular/router';



@Component({
  selector: 'mesas-lista',
  templateUrl: './mesas-lista.component.html'
})
export class MesasListaComponent implements OnInit {

  
  public mesas: Mesas[];
  public filterQueryq = "";
  public rowsOnPage = 5;
  public sortBy = "identificador";
  public sortOrder = "asc";
  //variables a utilizar
  private idMesa: number;
  private mesaVerEditar;

  private titulo:string;
  private opcion:string;
  private nombreBoton:string;

  //metodo constructor
  constructor(
    private _mesasService: MesasService)
  {
  }
  
  listarMesass(){
		this._mesasService.listarMesas().subscribe(
      result => {
          this.mesas = result;
          console.log(this.mesas);
			},
			error => {
				console.log(<any>error);
			}
		); 
  }


  mesasDetalles(id:number, modal){
    this.idMesa = id;
    this.mesaVerEditar = this.mesas[this.idMesa];
    this.opcion = 'ver';
    this.titulo = 'Detalles mesa';
    this.nombreBoton = 'Modificar';
    modal.show();
    
  }

  mesasEditar(id:number, modal){
    let p=this.mesas[id].identificador
    this.mesaVerEditar = p;
    this.opcion = 'modificar';
    this.titulo = 'Modificar mesa';
    this.nombreBoton = 'Guardar';
    modal.show();
    
    //this.correcto = 'no';
  }

  guardarMesa(modal):void{ 
    this._mesasService.modificarMesa(this.mesaVerEditar).subscribe(
      result => {
        
        this.listarMesass();
            },
            error => {
                console.log(<any>error);
            }
        );
    modal.hide();
    //this.correcto = 'si';
  }

  confirmaEliminar(i, modalEliminar){
    this.idMesa = i;
    modalEliminar.show();
  }

  mesasEliminar( modalEliminar){
    this._mesasService.eliminarMesa(this.idMesa).subscribe(
      result => {
          
        this.listarMesass();
            },
            error => {
                console.log(<any>error);
            }
        );
    this.idMesa = null;
    modalEliminar.hide();
  }

  
  cancelar(modal){
    this.listarMesass();
    modal.hide();
  }

  ngOnInit() {
    console.log('productos-list.component.ts cargado.');
    this.listarMesass();
  }

}
