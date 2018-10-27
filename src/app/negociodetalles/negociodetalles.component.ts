import { Component, OnInit, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import { NegocioDetallesService } from 'app/negociodetalles/negociodetalles.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'negociodetalles',
  templateUrl: './negociodetalles.component.html'
})
export class NegocioDetallesComponent implements OnInit {

  public datos: any = {};
  public mostrarAlert:boolean = false;
  

  /*METODO CONSTRUCTOR */
  constructor(
    private _negocioDetallesService: NegocioDetallesService) { 
      
  }

  ngOnInit() {  
    this.cargaDetalles();
  }

  cargaDetalles(){
    this._negocioDetallesService.listarDetalles().subscribe(
      result => {
          this.datos = result;
          console.log(this.datos);
			},
			error => {
				console.log(<any>error);
			}
		); 
  }

 
}//FIN DE LA CLASE
