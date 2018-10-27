import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import {Http} from '@angular/http';
import {SubCategoriaService} from './subcategoria.service';
import {CategoriaService} from '../categoria/categoria.service';
import {SubCategoria} from './subcategoria';
import {Categoria} from '../categoria/categoria';
import {CategoriaComponent} from '../categoria/categoria.component';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';

@Component({
  selector: 'subCategoria',
  templateUrl: './subcategoria.component.html',
  providers: [SubCategoriaService, CategoriaService]
})
export class SubCategoriaComponent implements OnInit{
  public nombre: string;//variable para capturar la nueva categoria a crear
  public subcategorias: SubCategoria[];//variable que almacena todas las categorias
  public primer: number;//variable que representa la primer posicion que mostrara la tabla 'categorias'
  public ultimo: number;//variable que representa la ultima prosicion que mostrara la taba 'categorias'
  public nuevNombre: string;
  public posNombreAct: number;//variable que almacena la posicion del nombre de la categoria en el vector 'categorias[]'
  public tamanioResult:number;//variable que guarda el tamaño del resultado a la BD.la cantidad de categorias 
  public buscar: string;
  public categorias: Categoria[];
  //variables para ventanas modales
  public subcategModal;
  public eliminarModal;
  public idCateg: number;
  public opcion;//variable que representa la opcion de eliminar subcategoria (Si - No)
  public color:string;
  public enter = 13;//valor que el navegador asigna por defecto a la tecla'enter'
  public nuevoColor:string;
  
  //metodo constructor
  constructor(
    private subcategoriaService: SubCategoriaService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private location: Location
  ){ 
    this.primer = 0;
    this.ultimo = 5;
    this.opcion={
      opc1 : "No",
      opc2 : "Si"
    };
    this.buscar = "";  
    this.route.params.subscribe( params => this.idCateg = params['id'] ); //obtiene el id recibido como parametro de la categoria
    this.nombre = "";
    this.color="";
    this.nuevoColor="";
   }

   //VALIDA QUE EL STRING INGRESADO CORRESPONDA A UN HEXADECIMAL
    validaColor(event, pop){
      if(event.keyCode != this.enter){
        if(event.code != 'KeyA' && event.code != 'KeyB' && event.code != 'KeyC' && event.code != 'KeyD'
        && event.code != 'KeyE' && event.code != 'KeyF' && event.key%1 != 0 ){//event.key%1 != 0 valida que sea un numero
          event.preventDefault(); 
        }else if(this.color.charAt(0) != '#'){
          this.color = '#';          
          console.log("correcto", event);
        }
      }else{
        this.eventoCrear(event, pop);
        console.log("llamada a nuevo producto");
      }
  }

  //VALIDA QUE EL STRING INGRESADO CORRESPONDA A UN HEXADECIMAL DEL COLOR A EDITAR
    validaColorEditar(event, modal){
      if(event.keyCode != this.enter){
        if(event.code != 'KeyA' && event.code != 'KeyB' && event.code != 'KeyC' && event.code != 'KeyD'
        && event.code != 'KeyE' && event.code != 'KeyF' && event.key%1 != 0 ){//event.key%1 != 0 valida que sea un numero
          event.preventDefault(); 
        }else if(this.color.charAt(0) != '#'){
          this.nuevoColor = '#';          
          console.log("correcto", event);
        }
      }else{
        this.eventoRenombrar(event, modal);
        console.log("llamada a nuevo producto");
      }
  }

  //metodo que guarda una nueva subcategoria llamando al servicio 'subcategoriaService'
guardarSubCateg(pop):void{ 
  if(this.nombre.length > 0){
    if(this.color.length > 6){
      var valida = true;
    this.subcategoriaService.obtenerSubCategoriasXcategoria(this.idCateg).subscribe(
        result => {     
          console.log("Validando entrada..."); 
          for(let i = 0; i < result.length; i++){            
            if(this.nombre.toUpperCase() == result[i].nombre.toUpperCase() && i != this.posNombreAct){
              valida = false;
            }
            }//termina for 
        if(valida){//si los datos son validos entra
          this.subcategoriaService.nuevaSubCategoria(this.nombre, this.idCateg, this.color).subscribe((data)=>{
          console.log('Datos enviados con exito', data);
          this.obtenerSubCategoriasXcategoria(this.primer, this.ultimo);
          this.nombre = "";  //limpia el campo al guardar la subcategoria
          this.color="";
          }, (error)=>{
            console.log('Error!!', error);
          });

        }else{
          alert("Ya existe una subcategoria con ese nombre");
          console.log("Ya existe una subcategoria con ese nombre");
          }                  
        },
          error =>{
            console.log(<any>error);
          }
      );
    }else{
      pop.show();
    } 
  }else{      
    alert("Por favor rellene el campo");    
  }

}





//metodo que obtiene las subcategorias, recibe como argumento un rango(desde-hasta)el primer elemento que se va a mostrar y el ultimo en mostrar
//primer: Posicion del primer elemento ---- ultimo: Posicion del ultimo numero a mostrar
obtenerSubCategorias(primer: number, ultimo:number):void{  
      this.subcategoriaService.obtenerSubCategorias().subscribe(
        result => {
            this.primer = primer;
            this.ultimo = ultimo;       
            this.subcategorias = result.slice(this.primer, this.ultimo);//obtengo los datos      
            this.tamanioResult = result.length;  
            
            console.log("exito obteniendo subcategorias");       
        },
          error =>{
            console.log(<any>error);
          }
      );
}//fin del metodo


//obtiene las subcategorias pertenecientes a una categoria
obtenerSubCategoriasXcategoria(primer: number, ultimo:number):void{  
 this.subcategoriaService.obtenerSubCategoriasXcategoria(this.idCateg).subscribe(
        result => { 
            this.primer = primer;
            this.ultimo = ultimo;      
            this.subcategorias = result.slice(this.primer, this.ultimo);//obtengo los datos      
            this.tamanioResult = result.length;  
            
            console.log("exito obteniendo subcategorias");       
        },
          error =>{
            console.log(<any>error);
          }
      );
}//fin del metodo

eventoObtenerSubcategoria(event){
  if(this.idCateg >= 0){
    this.obtenerSubCategoriasXcategoria(0, 5);
  }else{
    this.obtenerSubCategorias(0,5);
  }
}

buscarSubCategoria(nombre: string):void{  
      this.subcategoriaService.buscarSubCategoria(nombre).subscribe(
        result => {   
            this.subcategorias = result.slice(this.primer, this.ultimo);//obtengo los datos 
            this.tamanioResult = result.length;  
            console.log("buscando subcategorias");       
        },
          error =>{
            console.log(<any>error);
          }
      );
}//fin del metodo

buscarSubCategoriaXcategoria(nombre: string):void{  
  this.subcategoriaService.buscarSubCategoriaXcategoria(nombre, this.idCateg).subscribe(
        result => {               
            this.subcategorias = result.slice(this.primer, this.ultimo);//obtengo los datos 
            this.tamanioResult = result.length;  
            console.log("buscando Subcategorias");       
        },
          error =>{
            console.log(<any>error);
          }
      );
}//fin del metodo

//metodo para buscar una subcategoria
eventoBuscarSubCategoria(event){
  this.primer = 0;
   this.ultimo = 5;
  if(this.idCateg > 0){
    this.buscarSubCategoriaXcategoria(this.buscar);
  }else{
    this.buscarSubCategoria(this.buscar);
  }
}

actualizarSubCategoria(id:number, nombreNuevo:string, color:string){
  this.subcategoriaService.modificarSubCategorias(id, nombreNuevo, color).subscribe(
        result => {       
            console.log("respuesta: ", result); 
            this.obtenerSubCategoriasXcategoria(this.primer, this.ultimo);                  
        },
          error =>{
            console.log(<any>error);
          }
      ); 
}

//metodo que valida los datos antes de enviarlos a la BD
renombrarSubCategoria(modal){  
  if(this.nuevNombre.length > 0){
    if(this.nuevoColor.length > 6){
      var valida = true;
    this.subcategoriaService.obtenerSubCategoriasXcategoria(this.idCateg).subscribe(
        result => {     
          console.log("Validando entrada..."); 
          for(let i = 0; i < result.length; i++){            
            if(this.nuevNombre.toUpperCase() == result[i].nombre.toUpperCase() && i != this.posNombreAct){
              valida = false;
            }
            }//termina for 
        if(valida){//si los datos son validos entra
        modal.hide();
        let subcateg = this.subcategorias[this.posNombreAct];
        this.actualizarSubCategoria(subcateg.id, this.nuevNombre, this.nuevoColor);
        console.log("Nuevo nombre enviado");
        }else{
          alert("Ya existe una subcategoria con ese nombre");
          console.log("Ya existe una subcategoria con ese nombre");
          }                  
        },
          error =>{
            console.log(<any>error);
          }
      );
    } else{
      alert("Por favor ingrese minimo 6 caracteres en el color");
    } 
    
  }else{      
    alert("Por favor rellene el campo nombre");    
  }
}//fin del metodo



eliminarSubCategoria(modal){
  this.nombre = "";
  let id = this.subcategorias[this.posNombreAct].id;
  let desactiva: boolean;
  if(this.opcion.opc1 == "Si"){//si la opcion 1 es si, entonces no desactiva la categoria en la BD sino que la elimina completamente
    desactiva = false;
  }else if(this.opcion.opc1 == "No"){
    desactiva = true;
  }
  this.subcategoriaService.eliminarSubCategoria(id, desactiva).subscribe(
        result => {       
            console.log("respuesta: ", result); 
            this.obtenerSubCategoriasXcategoria(this.primer, this.ultimo);          
        },
          error =>{
            console.log(<any>error);
          }
      ); 
  modal.hide();//cierra el modal
  
}

modalEliminarSubCategoria(pos: number, modal){
  modal.show();
  this.posNombreAct = pos;
  this.nombre = this.subcategorias[this.posNombreAct].nombre; 
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
    this.renombrarSubCategoria(modal);    
    }
  }
  //evento para crear
eventoCrear(event, pop){
  if(event.keyCode == this.enter){
      this.guardarSubCateg(pop);
  }//fin del if principal
}
 
    

//ESTABLECE EL RANGO A MOSTRAR EN LA TABLA 'CATEGORIAS'

siguienteRango(){  
  let primer = this.ultimo;
  let ultimo = primer+5;
  if(primer >= 0 && ultimo >= primer && primer < this.tamanioResult){
    this.primer = primer;
    this.ultimo = ultimo;
    if(this.idCateg > 0){
      if(this.buscar.length > 0){
        this.buscarSubCategoriaXcategoria(this.buscar);
      }else{
        this.obtenerSubCategoriasXcategoria(this.primer, this.ultimo);
      }
      
    }else{
      if(this.buscar.length > 0){
        this.buscarSubCategoria(this.buscar);
      }else{
        this.obtenerSubCategorias(this.primer, this.ultimo);
      }      
    }//fin del else
    
  }//fin del if principal
}//fin del metodo

anteriorRango(){
  let primer = this.primer-5;
  let ultimo = primer+5;
  if(primer >= 0 && ultimo >= primer){
    this.primer = primer;
    this.ultimo = ultimo;
    if(this.idCateg > 0){
      if(this.buscar.length > 0){
        this.buscarSubCategoriaXcategoria(this.buscar);
      }else{
        this.obtenerSubCategoriasXcategoria(this.primer, this.ultimo);
      }
    }else{
      if(this.buscar.length > 0){
        this.buscarSubCategoria(this.buscar);
      }else{
        this.obtenerSubCategorias(this.primer, this.ultimo);
      } 
    }
  }
}


//obtiene todas las categorias para mostrarlas en la lista del encabezado de la tabla
obtenerCategorias(){
  this.categoriaService.obtenerCategorias().subscribe(
        result => {       
            this.categorias = result//obtengo los datos  
            console.log("exito obteniendo categorias");       
        },
          error =>{
            console.log(<any>error);
          }
      );
}




//limpia el campo del modal
limpiarModal(){
  this.nuevNombre = "";
}

//metodo para mostrar el nombre de la categoria a modificar en el campo del modal
muestraVarEnModal(pos: number){
  this.posNombreAct = pos;
  this.nuevNombre = this.subcategorias[this.posNombreAct].nombre;
  this.nuevoColor = this.subcategorias[this.posNombreAct].color;
}

consecutivo(pos: number):number{  
  return this.primer+pos;
}

atras(){
  this.location.back();
}

ngOnInit(): void{
  this.obtenerSubCategoriasXcategoria(this.primer, this.ultimo);
  this.obtenerCategorias();
  //this.buscarCategoria(this.nombre);
}

}
