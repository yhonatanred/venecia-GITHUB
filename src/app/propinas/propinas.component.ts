import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ModalDirective } from "ngx-bootstrap/modal";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PropinasService } from 'app/propinas/propinas.service';

@Component({
  selector: 'propinas',
  templateUrl: './propinas.component.html'
})
export class PropinasComponent implements OnInit {

    //DECORA LA CLASE COMO UNA VISTA 'HIJO'
  @ViewChild('propinasModal') modal: ModalDirective;

    public fecha: Date[];
    public datos;
    public total: number;
    //atributos para la fecha
    datepickerModel: Date;
    bsConfig:any ={
      containerClass: "theme-dark-blue"
    }
    constructor(private propinasService: PropinasService){
        this.fecha = [new Date(), new Date()];
        this.datos = [];
        this.total = 0;
    }
    ngOnInit(){
        this.buscar();
    }

    showModal(){
        this.modal.show();
    }

    hideModal(){        
        this.modal.hide();
        this.limpiarTodo();
    }

    limpiarTodo(){
        this.fecha = [new Date(), new Date()];
        this.datos = [];
        this.total = 0;
    }
    buscar(){
        this.datos = [];
        this.total = 0;
        let fecha1 = ""+this.fecha[0].getFullYear()+"-"+(this.fecha[0].getMonth()+1)+"-"+this.fecha[0].getDate();
        let fecha2 = ""+this.fecha[1].getFullYear()+"-"+(this.fecha[1].getMonth()+1)+"-"+this.fecha[1].getDate();        
        this.propinasService.obtenerPropinas_rango(fecha1, fecha2).subscribe(result=>{
            this.datos = result;
            for(let i = 0; i < result.length; i++){
                this.total += parseInt(""+result[i].propina);
            }
        },error=>{
            console.log(<any>error);
        });
        
    }
    

}