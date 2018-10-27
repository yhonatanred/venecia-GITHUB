import { Component, OnInit, ViewChild } from '@angular/core';
import {Http} from '@angular/http';
import {CategoriaService} from './categoria.service';
import {Categoria} from './categoria';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';


@Component({
  selector: 'categoria',
  templateUrl: './categoria.component.html',
  providers: [CategoriaService]
})
export class CategoriaComponent implements OnInit{
  public nombre: string;//variable para capturar la nueva categoria a crear
  public categorias: Categoria[];//variable que almacena todas las categorias
  public primer: number;//variable que representa la primer posicion que mostrara la tabla 'categorias'
  public ultimo: number;//variable que representa la ultima prosicion que mostrara la taba 'categorias'
  public nuevNombre: string;
  public posNombreAct: number;//variable que almacena la posicion del nombre de la categoria en el vector 'categorias[]'
  public tamanioResult:number;//variable que guarda el tamaño del resultado a la BD.la cantidad de categorias 
  public buscar: string;
  //variables para ventanas modales
  public categModal;
  public eliminarModal;

  public opcion;//variable que representa la opcion de eliminar categoria (Si - No)
  
  //metodo constructor
  constructor(
    private categoriaService: CategoriaService
  ){ 
    this.primer = 0;
    this.ultimo = 5;
    this.opcion={
      opc1 : "No",
      opc2 : "Si"
    };
    this.buscar = "";
    this.nombre="";
   }

  //metodo que guarda una nueva categoria llamando al servicio 'categoriaService'
guardarCateg():void{ 

  if(this.nombre.length > 0){
    var valida = true;
    this.categoriaService.obtenerCategorias().subscribe(
        result => {     
          console.log("Validando entrada..."); 
          for(let i = 0; i < result.length; i++){            
            if(this.nombre.toUpperCase() == result[i].nombre.toUpperCase() && i != this.posNombreAct){
              valida = false;
            }
            }//termina for 
        if(valida){//si los datos son validos entra

          this.categoriaService.nuevaCategoria(this.nombre).subscribe((data)=>{
          console.log('Datos enviados con exito', data);
          this.obtenerCategorias(this.primer, this.ultimo);
          this.nombre = "";  //limpia el campo al guardar la categoria
          }, (error)=>{
            console.log('Error!!', error);
          });

        }else{
          alert("Ya existe una categoria con ese nombre");
          console.log("Ya existe una categoria con ese nombre");
          }                  
        },
          error =>{
            console.log(<any>error);
          }
      );
  }else{      
    alert("Por favor rellene el campo");    
  }



}


//metodo que obtiene las categorias, recibe como argumento un rango(desde-hasta)el primer elemento que se va a mostrar y el ultimo en mostrar
//primer: Posicion del primer elemento ---- ultimo: Posicion del ultimo numero a mostrar
obtenerCategorias(primer: number, ultimo:number):void{  
      this.categoriaService.obtenerCategorias().subscribe(
        result => {       
            this.categorias = result.slice(this.primer, this.ultimo)//obtengo los datos      
            this.tamanioResult = result.length;  
            /*if(this.categorias.length == 0){
              this.primer = this.primer-6;
              this.ultimo = this.primer +5;
            }*/
            console.log("exito obteniendo categorias");       
        },
          error =>{
            console.log(<any>error);
          }
      );
}//fin del metodo

buscarCategoria(nombre: string):void{  
      this.categoriaService.buscarCategoria(nombre).subscribe(
        result => {               
            this.categorias = result.slice(this.primer, this.ultimo)//obtengo los datos 
            this.tamanioResult = result.length;  
            console.log("buscando categorias");       
        },
          error =>{
            console.log(<any>error);
          }
      );
}//fin del metodo

eventoBuscarCateg(){
this.primer = 0;
this.ultimo = 5;
this.buscarCategoria(this.nombre);
}

actualizarCategoria(id:number, nombreNuevo:string){
  this.categoriaService.modificarCategorias(id, nombreNuevo).subscribe(
        result => {       
            console.log("respuesta: ", result); 
            this.obtenerCategorias(this.primer, this.ultimo);                  
        },
          error =>{
            console.log(<any>error);
          }
      ); 
}

//metodo que valida los datos antes de enviarlos a la BD
renombrarCategoria(modal){  
  if(this.nuevNombre.length > 0){
    let valida = true;
      for(let i = 0; i < this.categorias.length; i++){
          if(this.nuevNombre.toUpperCase() == this.categorias[i].nombre.toUpperCase() && i != this.posNombreAct){
              valida = false;
          }
      }
    if(valida){
      modal.hide();
       let categ = this.categorias[this.posNombreAct];
      this.actualizarCategoria(categ.id, this.nuevNombre);
      console.log("Nuevo nombre enviado");
    }else{
      alert("Ya existe una categoria con ese nombre");
      console.log("Ya existe una categoria con ese nombre");
    }
    
  }else{      
    alert("Por favor rellene el campo"); 
    
  }
}


eliminarCategoria(modal){
  this.nombre = "";
  let id = this.categorias[this.posNombreAct].id;
  let desactiva: boolean;
  if(this.opcion.opc1 == "Si"){//si la opcion 1 es si, entonces no desactiva la categoria en la BD sino que la elimina completamente
    desactiva = false;
    this.categoriaService.eliminarCategoria(id, desactiva).subscribe(
      result => {       
          console.log("respuesta: ", result); 
          this.obtenerCategorias(this.primer, this.ultimo);          
      },
        error =>{
          console.log(<any>error);
        }
    ); 
  }else if(this.opcion.opc1 == "No"){
    this.cerrarModalEliminar(modal);
    //desactiva = true;
  }  
  modal.hide();//cierra el modal
}

modalEliminarCategoria(pos: number, modal){
  modal.show();
  this.posNombreAct = pos;
  this.nombre = this.categorias[this.posNombreAct].nombre; 
}

cerrarModalEliminar(modal){
  this.nombre = "";
  modal.hide();
}

cambiarOpcion(){
  if(this.opcion.opc2 == "Si"){
      this.opcion.opc1 = "Si";
      this.opcion.opc2 = "No";
  }else if(this.opcion.opc2 == "No"){
    this.opcion.opc1 = "No";
    this.opcion.opc2 = "Si";
  }
}

//evento para renombrar
eventoRenombrar(event, modal){
  if(event['key'] == 'Enter'){
    this.renombrarCategoria(modal);    
    }
  }
  //evento para crear
eventoCrear(event){
  if(event['key'] == 'Enter'){
    this.guardarCateg();  
    }
  }
 
    

//ESTABLECE EL RANGO A MOSTRAR EN LA TABLA 'CATEGORIAS'

siguienteRango(){  
  let primer = this.ultimo;
  let ultimo = primer+5;
  if(primer >= 0 && ultimo >= primer && primer < this.tamanioResult){
    this.primer = primer;
    this.ultimo = ultimo;
    if(this.buscar.length > 0){
      this.buscarCategoria(this.buscar);
    }else{
      this.obtenerCategorias(this.primer, this.ultimo);
    }
    
  }//fin del  if
}
anteriorRango(){
  let primer = this.primer-5;
  let ultimo = primer+5;
  if(primer >= 0 && ultimo >= primer){
    this.primer = primer;
    this.ultimo = ultimo;
    if(this.buscar.length > 0){
      this.buscarCategoria(this.buscar);
    }else{
      this.obtenerCategorias(this.primer, this.ultimo);
    }
  }//fin del if externo
}



//limpia el campo del modal
limpiarModal(){
  this.nuevNombre = "";
}

//metodo para mostrar el nombre de la categoria a modificar en el campo del modal
muestraVarEnModal(pos: number){
  this.posNombreAct = pos;
  this.nuevNombre = this.categorias[this.posNombreAct].nombre;
}

consecutivo(pos: number):number{  
  return this.primer+pos;
}



ngOnInit(): void{
  this.obtenerCategorias(this.primer, this.ultimo);
  //this.buscarCategoria(this.nombre);
}




}
