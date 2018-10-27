import { Component, OnInit, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import { Gustos } from "app/gustos/gustos";
import { GustosService } from "app/gustos/gustos.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { GustosTuplaSeleccion } from "app/gustos/gustos.tuplaSeleccion";


@Component({
  selector: 'modal-gustos',
  templateUrl: './gustos.component.html',
  styleUrls: ['./gustos.component.css']
})
export class GustosComponent implements OnInit {
//DECORA LA CLASE COMO UNA VISTA 'HIJO'
 @ViewChild('gustosModal') modal:ModalDirective;

  public gustos: Gustos[];
  public infoInValida:boolean;
  //VARIABLES PARA EL MANEJADOR DE EVENTOS
  public enter = 13;//valor que el navegador asigna por defecto a la tecla'enter'
  public bajar = 40;//valor que el navegador asigna por defecto a la tecla 'bajar' (flecha abajo)
  public gustosSeleccion: GustosTuplaSeleccion[];
  public vista;//variable que captura el tipo de vista de los gustos, incluye 'configuracion'
  public vistaCateg;//variable que captura la vista por categorias de los gustos
  public nuevoGusto:string;  
  public idCateg:number;//id de la categoria que asocia el gusto a crear
  public nombCateg:string;//nombre de la categoria a mostrar los gustos
  public producto;//producto al que se le va agregar el gusto
  public alertnGusto:string;
  public alertaCrearG:boolean;
  public editarGusto:boolean;
  public idGustoEdit:number;
  //atributo que representa el padre del componente, es decir desde donde se está invocando
  public padre;
  public idProducto;//representa el id del producto el cual se van a mostrar los gustos en caso de invocar el presente componente con los gustos de un producto

  /*METODO CONSTRUCTOR */
  constructor(private gustosService: GustosService) {   
    this.infoInValida=false;
    this.gustos=[];
    this.gustosSeleccion=[];
    this.vista=-1;
    this.idGustoEdit=-1;
    this.alertaCrearG = false;
    this.nuevoGusto = "";
    this.editarGusto=false;
    this.nombCateg="";
    this.vistaCateg=-1;
    this.padre = null;
    this.idProducto = -1;
  }
 

  ngOnInit() { }

  //METODOS CONSULTORES
 
  getGustos(): Gustos[]{
    return this.gustos;
  } 
  getGustosSeleccion():GustosTuplaSeleccion[]{
    return this.gustosSeleccion;
  }
  getModal():ModalDirective{
    return this.modal;
  }
  getNombCateg():string{  
    return this.nombCateg;
  }


  inicializaChecks(producto){
    let pos = 0;    
    this.gustosSeleccion = [];
    for(let i=0; i < this.gustos.length; i++){
      if(producto[pos] == this.gustos[i].id){
        let seleccion = new GustosTuplaSeleccion(this.gustos[i], true);
        this.gustosSeleccion[i] = seleccion;
        ++pos;        
      }else{
        let seleccion = new GustosTuplaSeleccion(this.gustos[i], false);
        this.gustosSeleccion[i] = seleccion;
        console.log("no entra: "+producto[pos]+" != "+this.gustos[i].id);
      }
      
    }
  }

  //metodo que retorna el id de los gustos que se seleccionaron con el checkbox
  obtenerSeleccionados(): number[]{
    let idGustos:number[]=[];//almacena el id de los gustos que se seleccionaron en el checkbox
    for(let i=0; i < this.gustosSeleccion.length; i++){
      if(this.gustosSeleccion[i].seleccion){
        idGustos[i] = this.gustosSeleccion[i].gustos.id;
      }
    }
    return idGustos;
  }

  //metodo que carga TODOS los gustos
  cargarTodos_gustos(){
    this.gustosService.obtenerGustos().subscribe(
      result=>{
        this.gustos = result;
        this.inicializaChecks(this.producto);
        this.vistaCateg=-1;
        console.log("exito obteniendo los gustos"); 
        console.log("nombre gustos:  ", this.gustos);
      },
      error=>{
        console.log(<any>error);
      }
    );
  }
  
//METODO QUE CARGA TODO LOS GUSTOS DE LA CATEGORIA SELECCIONADA
  cargarGustos(idCategoria: number, producto){   
    this.gustosService.obtenerGustosXcateg(idCategoria).subscribe(
        result => {       
            this.gustos = result;//obtengo los datos            
            this.inicializaChecks(producto);
            this.vistaCateg=this.idCateg;
            console.log("exito obteniendo los gustos"); 
            console.log("nombre gustos:  ", this.gustos);  
        },
          error =>{
            console.log(<any>error);
          }
      );
  }

  cargarGustosXproducto(idProducto, gustos){
    this.gustosService.obtenerGustosXproducto(idProducto).subscribe(
        result => {       
            this.gustos = result;//obtengo los datos
            this.inicializaChecks(gustos);
            console.log("exito obteniendo los gustos"); 
            console.log("nombre gustos:  ", this.gustos);
            if(this.gustos.length > 0){
              this.modal.show();
            }else{
              let nombreG = [];
              this.padre.estructurarObjeto(nombreG);
            }   
        },
          error =>{
            console.log(<any>error);
          }
      );
  }

  validarNuevoGusto():boolean{
    let band = true;
    for(let i=0; i < this.gustos.length; i++){
      if(this.gustos[i].gusto == this.nuevoGusto){
        band = false;
        break;
      }
    }
    return band;
  }

  //metodo que valida el gusto a editar, recibe como argumento la posicion del gusto a editar en el vector
  validarEditGusto():boolean{
    let band = true;
    for(let i=0; i < this.gustos.length; i++){
      if(this.gustos[i].gusto == this.nuevoGusto && this.gustos[i].id != this.idGustoEdit){
        band = false;
        break;
      }
    }
    return band;
  }

  //METODO QUE GUARDA UN NUEVO GUSTO
  crearGusto(){
    let nGusto = new Gustos(-1, this.nuevoGusto, this.idCateg);//se crea con id -1 porque esta variable no se tendrá en cuenta en la BD
    this.gustosService.crearGusto(nGusto).subscribe((data)=>{
      if(this.vista == -1){
      this.cargarTodos_gustos();
    }else if(this.vista == this.idCateg){
      this.cargarGustos(this.idCateg, this.producto);
    }
     },
    error=>{
      console.log("error al crear un gusto");
      console.log(<any>error);
    });
  }

  eliminarGusto(idGusto:number, idCategoria){
    this.gustosService.eliminarGusto(idGusto).subscribe((data)=>{
      if(this.vistaCateg != idCategoria){
      this.cargarTodos_gustos();
    }else if(this.idCateg == this.idCateg){
      let gust = [];
      this.cargarGustos(this.idCateg, gust);
      this.vista = -2;
    }
      
    },
    error=>{
      console.log("error al eliminar un gusto");
      console.log(<any>error);
    }
    );
  }

  actualizarGusto(idGusto:number){
    this.gustosService.actualizarGusto(idGusto, this.nuevoGusto).subscribe((data)=>{
      if(this.vistaCateg != this.idCateg){
      this.cargarTodos_gustos();
    }else if(this.idCateg == this.idCateg){
      this.cargarGustos(this.idCateg, this.producto);;
      this.vista = -2;
    }      
    },
    error=>{
      console.log("Error al actualizar el gusto");
      console.log(<any>error);
    }
  );
  }

  showModal(idCategoria: number, producto, categoria:string) {
    this.idCateg = idCategoria;
    this.producto=producto;
    this.nombCateg=categoria;
    this.vista=this.idCateg;
    this.cargarGustos(this.idCateg, this.producto);
    this.modal.show();
    }

    showModalXprod(idProducto:string, gustos){
      this.nombCateg="Gustos";
      this.idProducto = idProducto;
      this.cargarGustosXproducto(this.idProducto, gustos);           
    }

    //cierra el modal principal de gustos
  hideModal(){
    this.inicializaChecks([-1]);//envia como argumento '-1' para no checkear ningun gusto
    this.infoInValida=false;
    if(this.idProducto != -1){
        let nombreG = [];
        this.padre.estructurarObjeto(nombreG);
      }
    this.modal.hide();
  }

  //abre el modal para crear un nuevo gusto
  showModalnGusto(modal){
    this.editarGusto=false;
    modal.show();
  }

  //cierra el modal de crear un nuevo gusto
  hideModalnGusto(modal){
    this.alertaCrearG=false;
    this.alertnGusto="";
    this.nuevoGusto="";
    modal.hide();
  }

  //abre el modal para editar un gusto
  showModalEdit(modal, idGusto, gusto:string){
    this.editarGusto=true;
    this.nuevoGusto = gusto;
    this.idGustoEdit=idGusto;
    modal.show();
  }

  //cierra el modal de editar un gusto
  hideModalEdit(modal){
    this.editarGusto=false;
    this.alertaCrearG=false;
    this.alertnGusto="";
    this.nuevoGusto="";
    modal.hide();

  }


  obtenerNombre_de_seleccionados(): string[]{
    let p = this.obtenerSeleccionados();
    let nombreG = [];
    let pos = 0;
        for(let i=0; i < this.gustos.length; i++){
          if(this.gustos[i].id == p[i]){
            nombreG[pos] = { 
              idGusto: this.gustos[i].id,
              nombreG: this.gustos[i].gusto};
              ++pos;
          }
        }
    return nombreG;
  }

  

  /************************
   **MANEJADOR DE EVENTOS**
   ************************/
  //guarda los gustos que se seleccionaron
  eventGuardaGustos(){  
     console.log("gustos: ", this.gustosSeleccion); 
    let band = false;
    for(let i=0; i < this.gustosSeleccion.length; i++){
      if(this.gustosSeleccion[i].seleccion){
        band=true;
        break;
      }
    }//fin del for
    if(band){
      console.log("save: ", this.gustosSeleccion);
      this.infoInValida=false;
      //llama los metodos del padre para asignarle los gustos que se seleccionaron
      if(this.idProducto != -1){
        console.log("idProducto: "+this.idProducto);
        let nombreG = this.obtenerNombre_de_seleccionados();
        this.padre.estructurarObjeto(nombreG);
      }
      this.modal.hide();
    }else{
      this.hideModal();      
     //this.infoInValida=true;
    }
    //this.limpiarVariables();
  }



  //manejador de eventos del input de crear gusto
  eventInputCrearGusto(event, modal){
    if(event.keyCode==this.enter){
       if(this.nuevoGusto.length > 0){
      if(this.validarNuevoGusto()){
        this.crearGusto();  
        this.hideModalnGusto(modal);
      }else{
        this.alertnGusto="El gusto ya existe";
        this.alertaCrearG=true;
      }      
    }else{
      this.alertnGusto="Por favor rellene el campo";
      this.alertaCrearG=true;
    }
    }else{ }
  }

  //evento para crear un nuevo gusto
  eventCrearGusto(modal){
    if(this.nuevoGusto.length > 0){
      if(this.validarNuevoGusto()){
        this.crearGusto();  
        this.hideModalnGusto(modal);
      }else{
        this.alertnGusto="El gusto ya existe";
        this.alertaCrearG=true;
      }      
    }else{
      this.alertnGusto="Por favor rellene el campo";
      this.alertaCrearG=true;
    }
  }

  //evento del botón 'trash' para eliminar un gusto
  eventEliminarGusto(idGusto:number, idCategoria:number){
    this.eliminarGusto(idGusto, idCategoria);    
  }

  //evento del input para editar un gusto
  eventInputEditarGusto(event, modal){
    if(event.keyCode == this.enter){
      if(this.nuevoGusto.length > 0){
      if(this.validarEditGusto()){
        this.actualizarGusto(this.idGustoEdit);
        this.hideModalEdit(modal);
      }else{
        this.alertnGusto="El gusto ya existe";
        this.alertaCrearG=true;
      }      
    }else{
      this.alertnGusto="Por favor rellene el campo";
      this.alertaCrearG=true;
    }
    }
  }

  //evento para editar un gusto
  eventEditarGusto(modal){
    if(this.nuevoGusto.length > 0){
      if(this.validarEditGusto()){
        this.actualizarGusto(this.idGustoEdit);
        this.hideModalEdit(modal);
      }else{
        this.alertnGusto="El gusto ya existe";
        this.alertaCrearG=true;
      }      
    }else{
      this.alertnGusto="Por favor rellene el campo";
      this.alertaCrearG=true;
    }    
  }

  //MANEJADOR DE EVENTOS DEL SELECT
  eventChangeCateg(){
    if(this.vista == -1){
      this.cargarTodos_gustos();
    }else if(this.vista == this.idCateg){
      this.cargarGustos(this.idCateg, this.producto);
    }
  }

  //03-02-2018
  limpiarVariables(){
    this.infoInValida=false;
    this.gustos=[];
    this.gustosSeleccion=[];
    this.vista=-1;
    this.idGustoEdit=-1;
    this.alertaCrearG = false;
    this.nuevoGusto = "";
    this.editarGusto=false;
    this.nombCateg="";
    this.vistaCateg=-1;
    this.padre = null;
    this.idProducto = -1;
  }
  
 
}//FIN DE LA CLASE
