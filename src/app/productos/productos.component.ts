import { Component, OnInit, ViewChild, ViewContainerRef, Input} from '@angular/core';
import {Http} from '@angular/http';
import { ProductosService } from "app/productos/productos.service";
import { Productos } from "./productos";
import { CategoriaService } from "app/categoria/categoria.service";
import { Categoria } from "app/categoria/categoria";
import { SubCategoriaService } from "app/subcategoria/subcategoria.service";
import { SubCategoria } from "app/subcategoria/subcategoria";


import { Gustos } from "app/gustos/gustos";
import { GustosService } from "app/gustos/gustos.service";
import { GustosComponent } from "app/gustos/gustos.component";
import { ComandaService } from "app/comanda/comanda.service";
import { Comanda } from "app/comanda/comanda";
import { ActivatedRoute, ParamMap } from '@angular/router';



@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {


  //tabla
  public filterQueryq = "";
  public rowsOnPage = 5;
  public sortBy = "";
  public sortOrder = "";

  public categSeleccion: string;//representa la categoria que seleccione en el select option
  public subCategSeleccion: string;//representa la Subcategoria que seleccione en el select option
  public nombreSubCateg;//almacena los nombre de las subcategorias en forma de vector
  public nombreCateg;//almacena los nombre de las categorias en forma de vector
  public productos;//almacena los productos retornados de la BD
  public categorias: Categoria[];  
  public subCategorias: SubCategoria[];  
  public codigo:string;
  public nombre:string;
  public precio: number;
  public color: string;
  public selectComanda: number;//representa la comanda que seleccione en la lista
  public gustos;//dejo la variable indefinida para poder asignar 'no' en caso de que no utilice 'gustos'
  public productos_gustos;//variable que almacena los ids de gustos y productos que estan relacionados en la BD
  public idCategoria:number;
  public comandas: Comanda[];
  public modal;//variable que representa el modal de los gustos  
  //VARIABLES PARA EL MANEJADOR DE EVENTOS
  public enter = 13;//valor que el navegador asigna por defecto a la tecla'enter'
  public tabular = 9;//codigo del tab 
  public verAlerta:boolean;
  //variables para los mensajes de alerta
  public verError:boolean;
  public verAdvertencia:boolean;
  public mensaje:string;//variable que representa el mensaje que muestra en los alertas
  public buscar: string;

  constructor(private productosService: ProductosService, private categoriaService: CategoriaService,  private subCategoriaService: SubCategoriaService, private gustosService: GustosService,
    private comandaService: ComandaService, private route: ActivatedRoute){ 
    this.codigo = "";
    this.nombre = "";
    this.buscar = "";
    this.categorias=[];
    this.subCategorias=[];
    this.color = "";
    this.selectComanda = -1;
    this.categSeleccion = "";
    this.subCategSeleccion = "";
    this.productos_gustos=[];
    this.idCategoria=-1;
    this.gustos=null;
    this.verAlerta=false;
    this.modal=null;
    this.verError=false;
    this.mensaje="";
    this.verAdvertencia=false;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.buscar = params.get('subCategoria');      
    }); 
    
  }

  ngOnInit() {
    this.cargarDetallesProd();
    this.cargarCategorias();    
    this.cargarComandas();
    this.eventBuscarProducto();
  }


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
        this.eventNuevoProd(event, pop); 
        console.log("llamada a nuevo producto");
      }
    
    
  }

  //METODOS QUE LLAMAN AL SERVICIO
  guardarProducto(producto: Productos, gustos){
    if(gustos==null){
      this.productosService.nuevoProducto(producto).subscribe((data) => {
      this.limpiarCampos();
      this.cargarDetallesProd();
      this.mensaje="se almacenó un nuevo producto a la base de datos.";
      this.verAlerta=true;
      console.log("Nuevo producto registrado!!!");
      },
      error =>{
        console.log("Error al guardar el producto");
      });
    }else{
      this.productosService.nuevoProducto_gustos(producto, gustos).subscribe((data) => {
        this.limpiarCampos();
        this.cargarDetallesProd();
        this.mensaje="se almacenó un nuevo producto a la base de datos.";
        this.verAlerta=true;
        console.log("Nuevo producto registrado!!!");
        },
        error =>{
          console.log("Error al guardar el producto");
        });
    }
   
  }//fin del metodo 'guardarProducto'

  actualizarProducto(producto:Productos, gustos, activo:boolean, idAnterior:number){
    if(gustos==null){
      this.productosService.actualizarProducto(producto, activo, idAnterior).subscribe((data) => {
      console.log(data);
      this.cargarDetallesProd();
      console.log("Producto modificado!!!");
      },
      error =>{
        console.log("Error al guardar el producto");        
      });
    }else{
      this.productosService.actualizarProducto_con_gustos(producto, activo, idAnterior, gustos).subscribe((data)=>{
      console.log(data);
      this.cargarDetallesProd();
      this.limpiarCampos();
      this.mensaje = "Se modificó un producto!!!";
      this.verAlerta = true;
      },
      error =>{
        console.log(<any>error);
      }
    );
    }
  }

  /*************************************************
   **METODOS DE CARGA DE DATOS DESDE LOS SERVICIOS**
   *************************************************/

  cargarCategorias(){
    this.categoriaService.obtenerCategorias().subscribe(
        result => {       
            this.categorias = result;//obtengo los datos
            this.nombreCateg = [];
            for(let i = 0; i < this.categorias.length; i++){
              this.nombreCateg[i] = this.categorias[i].nombre;
            }
            console.log("exito obteniendo categorias"); 
            console.log("nombre categorias:  ", this.nombreCateg);  
        },
          error =>{
            console.log(<any>error);
          }
      );
  }

  //carga las subCategorias de la BD
  cargarSubCategorias(idCateg: number){
    this.subCategoriaService.obtenerSubCategoriasXcategoria(idCateg).subscribe(
        result => {       
            this.subCategorias = result;//obtengo los datos
            this.nombreSubCateg = [];
            for(let i = 0; i < this.subCategorias.length; i++){
              this.nombreSubCateg[i] = this.subCategorias[i].nombre;
            }
            console.log("exito obteniendo subcategorias"); 
            console.log("nombre categorias:  ", this.nombreSubCateg);  
        },
          error =>{
            console.log(<any>error);
          }
      );
  }

  //METODO QUE CARGA LOS PRODUCTOS
  cargarDetallesProd(){
    //obtiene todos los pructos con sus respectivos detalles para mostrarlos en tabla
    this.productosService.obtenerDetallesP().subscribe(
      result=>{
        this.productos=result;
        console.log("Obteniendo los productos...");
      },
      error=>{
        console.log(<any>error);
        console.log("array productos: ", this.productos);
      }
    );
    //obtiene los ids de productos que tienen gustos
    this.productosService.obtenerGustos_de_Productos().subscribe(
      result=>{
        this.productos_gustos=result;
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  cargarComandas(){
    this.comandaService.verComandas().subscribe(
      result => {       
            this.comandas = result;//obtengo los datos     
        },
          error =>{
            console.log(<any>error);
          }
    );
  }

  //retorna el id de la categoria que seleccionó el usuario,
  //recibe como argumento el nombre de la categoria
  obtieneIdCateg(categ: string): number{
    let idCateg:number = -1;
    for(let i=0; i < this.categorias.length; i++){
      if(this.categorias[i].nombre == categ){
        idCateg = this.categorias[i].id;
        break;
      }
    }
    return idCateg;
  }
  //obtiene el id de la nueva categoria 
  idCategMod(pos:number): number{
    let idCateg:number = -1;
    for(let i=0; i < this.categorias.length; i++){
      if(this.categorias[i].nombre == this.productos[pos].categoria){
        idCateg = this.categorias[i].id;
        break;
      }
    }
    return idCateg;
  }

  //retorna el id de la subcategoria que seleccionó el usuario
  obtieneIdSubCateg(): number{
    let idSubCateg:number = -1;
    for(let i=0; i < this.subCategorias.length; i++){
      if(this.subCategorias[i].nombre == this.subCategSeleccion){
        idSubCateg = this.subCategorias[i].id;
        break;
      }
    }
    return idSubCateg;
  }
  //obtiene el id de la nueva subcategoria 
  idSubCategMod(pos:number): number{
    let idSubCateg:number = -1;
    for(let i=0; i < this.subCategorias.length; i++){
      if(this.subCategorias[i].nombre == this.productos[pos].subCategoria){
        idSubCateg = this.subCategorias[i].id;
        break;
      }
    }
    return idSubCateg;
  }

  //metodo que limpia las variables de 'nuevo producto'
  limpiarCampos(){
    this.codigo = '';
    this.categSeleccion='';
    this.subCategSeleccion='';
    this.nombre='';
    this.precio=null;
    this.gustos=null;
    this.selectComanda=-1;
    this.color='';
    this.modal=null;
  }
  

  

  /************************************
   * MANEJADOR DE EVENTOS PARA CREAR***
   * UN NUEVO PRODUCTO  ***************
   ************************************/
//retorna un vector con los ids de los gustos que seleccionó el usuario
  eventNuevoProd(event, pop){
    //verifica que el evento sea un 'ENTER'
    if(event.keyCode == this.enter){
      let idCateg:number = this.obtieneIdCateg(this.categSeleccion);
      let idSubCateg:number = this.obtieneIdSubCateg();
      if(this.modal != null){
        this.gustos = this.modal.obtenerSeleccionados();
        if(this.gustos.length == 0){
            this.gustos=null;
        } 
      }
   
      if(this.color.length < 6){
        pop.show();
        //VALIDA QUE LOS CAMPOS ESTÉN LLENOS
      }else if(this.codigo.length != 0 && this.nombre.length != 0 && this.precio != null && this.color.length != 0 &&
        this.selectComanda != -1 && this.categSeleccion.length > 0 && this.subCategSeleccion.length > 0){
          
            if(this.validarInfo(this.codigo, this.nombre, this.categSeleccion, this.subCategSeleccion, this.precio,
              this.color, -1)==true){
              let producto = new Productos(this.codigo, this.nombre, this.precio, this.color, this.selectComanda, idSubCateg);
              this.guardarProducto(producto, this.gustos);
              document.getElementById("codigo").focus();
              this.verAlerta=false;
              this.verError=false;
              this.verAdvertencia=false;
            }//fin del if de validacion  

        }else{
          this.mensaje="Por favor rellene todos los campos";
          this.verAdvertencia=true;
          this.verError=false;
          console.log("hay un campo vacio!!!");
        }   
    }//fin del if principal 
  }//fin del metodo


  openSubCategorias() {
    let idCateg:number = this.obtieneIdCateg(this.categSeleccion);
    this.cargarSubCategorias(idCateg);
  }

  //EVENTO DE GUSTOS
  //argumentos: Tipo de evento, modal, nombre de la categoria
  eventGustos(event, modal, categ:string, idProd){
    //console.log("categoria: "+categ);
    if(event.keyCode == this.enter){
      this.idCategoria = this.obtieneIdCateg(categ);//this.categSeleccion
      //SI EL MODAL ES NULO(es decir; no se ha abierto) ENTONCES LO CARGA CON GUSTOS SIN CHECKEAR
      if(this.modal==null){
        this.modal = modal;
        let gustS = [];
        let pos = 0;
        for(let i=0; i < this.productos_gustos.length; i++){
          if(idProd == this.productos_gustos[i].idProducto){
            gustS[pos] = this.productos_gustos[i].idGusto;
            ++pos;
          }
        }
        modal.showModal(this.idCategoria, gustS, categ);
      }else{
        if(categ == this.modal.getNombCateg()){
          this.modal = modal;
          this.modal.getModal().show();
        }else{
          this.modal = modal;
        let gustS = [];
        let pos = 0;
        for(let i=0; i < this.productos_gustos.length; i++){
          if(idProd == this.productos_gustos[i].idProducto){
            gustS[pos] = this.productos_gustos[i].idGusto;
            ++pos;
          }
        }
        modal.showModal(this.idCategoria, gustS, categ);
        }
        
      }      
          
    }else if(event.keyCode != this.tabular){//si es diferente de tabular y enter entonces previene el evento/ lo detiene
      event.preventDefault(); 
    }   
  }
/*
  productos_con_gustos(modal, idProducto:number){   
    if(this.productos_gustos.length>0){       
      for(let j=0; j < this.productos_gustos.length; j++){        
        for(let i=0; i < modal.getGustosSeleccion().length; i++){
          let objTupla = modal.getGustosSeleccion();
          if(objTupla[i].gustos.id == this.productos_gustos[j].idGusto && idProducto == this.productos_gustos[j].idProducto){
            modal.getGustosSeleccion().seleccion = true;
          }
        }
      }
    }
  }*/


   /*******************************************************************
  ***MANEJADORES DE EVENTOS SOBRE LAS FILAS PARA EDITAR UN PRODUCTO****
  *********************************************************************/
  eventoHabilitaEditar(pos:number, editar:boolean){
    if(!editar){
      this.productos[pos].editar = !editar;
      let idCateg:number = this.idCategMod(pos);
      this.cargarSubCategorias(idCateg);
      this.modal=null;
    }
  }

  //maneja el estado del producto(activo / inactivo)
  eventEstadoProducto(pos){
    this.productosService.cambiarEstado(this.productos[pos].idAnterior, this.productos[pos].activo).subscribe((data)=>{
      console.log(data);
    },
    error=>{
      console.log(<any>error);
    }
    );   
  }

  //este evento guarda una edicion al dar 'enter' en cualquier campo o 'activar - desactivar' un producto
  eventoGuardaEdicion(event, pop, pos){
    console.log(event);
     console.log("Codigo: ", this.productos[pos].codigo);
    //verifica que el evento sea un 'ENTER'
    let idCateg:number = this.idCategMod(pos);
    this.cargarSubCategorias(idCateg);
    if(event.keyCode == this.enter){
      let idSubCateg:number = this.idSubCategMod(pos);      
      if(this.modal != null){
        this.gustos = this.modal.obtenerSeleccionados();
      }
   console.log("gustos edicion: ", this.gustos);
      if(this.productos[pos].color.length < 6){
        pop.show();
        //VALIDA QUE LOS CAMPOS ESTÉN LLENOS
      }else if(this.productos[pos].codigo.length != 0 && this.productos[pos].nombre.length != 0 && this.productos[pos].precio != null && this.productos[pos].color.length != 0 &&
        this.productos[pos].comanda != -1 && this.productos[pos].categoria.length > 0 && this.productos[pos].subCategoria.length > 0){
          
            if(this.validarInfo(this.productos[pos].codigo, this.productos[pos].nombre, 
              this.productos[pos].categoria, this.productos[pos].subCategoria, this.productos[pos].precio,
            this.productos[pos].color, pos)==true){
              let producto = new Productos(this.productos[pos].codigo, this.productos[pos].nombre, this.productos[pos].precio, 
                this.productos[pos].color, this.productos[pos].idComanda, idSubCateg);

              this.actualizarProducto(producto, this.gustos, !this.productos[pos].activo, this.productos[pos].idAnterior);
              this.verAlerta=false;
              this.verError=false;
              this.verAdvertencia=false;
            }//fin del if de validacion  

        }else{
          this.mensaje="Por favor rellene todos los campos";
          this.verAdvertencia=true;
          this.verError=false;
          console.log("hay un campo vacio!!!");
        }   
    }//fin del if principal 
   // actualizarProducto(producto:Productos, gustos, activo:boolean, idAnterior:number);
  }





/************************************************
 * VALIDA LA INFORMACIÓN QUE EL USUARIO INGRESÓ
 ************************************************/
//argumentos:codigoProducto, nombreProducto, CategoriaProducto, SubCategoriaProducto, PrecioProducto, 
//colorProducto, Posicion de la tabla desde donde se realiza la operacion (creacion/modificacion)
validarInfo(codigo:string, nombre:string, categoria:string, subCategoria:string, precio:number,
            color:string, pos:number):boolean{
  let valido=true;
  //valida que no exista el codigo
  let banCodigo=false;
  for(let i=0; i < this.productos.length; i++){
    if(this.productos[i].codigo == codigo && i != pos){
      banCodigo=true;
    }
  }
  //valida que la categoria exista
  let bandCateg=false;
  for(let i=0; i < this.nombreCateg.length; i++){
    if(this.nombreCateg[i] == categoria){
      bandCateg=true;
    }
  }
  //valida que la subcategoria exista
  let bandSubCateg=false;
  if(bandCateg){//si la categoria existe entonces valida la subcategoria    
    for(let i=0; i < subCategoria.length; i++){
      if(this.nombreSubCateg[i] == subCategoria){
        bandSubCateg=true;
      }
    }  
     //valida que no exista el producto en la misma categoria - subcategoria
    if(!banCodigo && bandSubCateg){
      for(let i=0; i < this.productos.length; i++){
        if(this.productos[i].categoria == categoria && this.productos[i].subCategoria == subCategoria
          && this.productos[i].nombre == nombre && i != pos){
            //mensaje que ya existe
            this.mensaje="El producto ya existe en la misma familia categoria-subcategoria";
            this.verError=true;
            console.log("El producto ya existe en la misma familia categoria/subcategoria");
            valido=false;
          }
      }
    }
  }//fin del if de calidacion de subcategoria

  //console.log(codigo);
  if(banCodigo){
    valido=false;
    this.mensaje="Ya existe un producto con el codigo ingresado";
    this.verError=true;
    this.verAdvertencia=false;
    console.log("ya existe un producto con ese codigo");
  }else if(!bandCateg){
    valido=false;
    this.mensaje="La categoria ingresada no existe";
    this.verError=true;
    this.verAdvertencia=false;
    console.log("La categoria ingresada no existe");
  }else if(!bandSubCateg){
    valido=false;
    this.mensaje="La subCategoria ingresada no existe";
    this.verError=true;
    this.verAdvertencia=false;
    console.log("La subcategoria ingresada no existe");
  }

  return valido; 
}

//20-11-2017
eventBuscarProducto(){
  this.productosService.buscarProducto(this.buscar).subscribe(
    result=>{
      this.productos = result;
    },error=>{
      console.log(<any>error);
    }
  );
}




}
