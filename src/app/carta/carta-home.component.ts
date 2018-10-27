import { Component, OnInit, Input } from '@angular/core';

//datos desde otros componentes

import { CategoriaService } from '../categoria/categoria.service';
import { Categoria } from '../categoria/categoria';
import { SubCategoriaService } from '../subcategoria/subcategoria.service';
import { SubCategoria } from '../subcategoria/subcategoria';
import { ProductosService } from '../productos/productos.service';
import { Productos } from '../productos/productos';
import { MenuComponent } from '../menu/menu.component';
import { GustosComponent } from "../gustos/gustos.component";

@Component({
  selector: 'carta-home',
  templateUrl: './carta-home.component.html',
  styleUrls: ['carta-home.component.css'],
  //providers: [CategoriaService, ProductosService, SubCategoriaService] dario
})
export class CartaHomeComponent implements OnInit {
  public titulo: string;
  public categorias: Categoria[];
  public subCategorias: SubCategoria[];
  public productos;
  public modalG;//variable que representa el modal de gustos
  public objPos: number;//variable que representa la posicion del objeto que se va a enviar a menú, es decir del producto alojado en el vector 'productos'
  //26-11-2017 atributo que me representa el nombre de la sucategoria en la que estoy visualizando los productos
public nombreSC: string;
  @Input() cantidad: number;//variable que me representa la cantidad de un producto cuando lo selecciono

  constructor(
    private menuComponet: MenuComponent,
    private categoriaService: CategoriaService,
    private subCategoriaService: SubCategoriaService,
    private productosService: ProductosService
  ) {
    this.titulo = 'mesas';
    this.modalG = null;
    this.objPos = -1;
    this.nombreSC = "";
  }
  ngOnInit() {
    this.listarCategorias();
  }

  listarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe(
      result => {
        this.categorias = result;//obtengo los datos
        console.log(this.categorias);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

 

  scrollCategoria(x, y) {
    document.getElementById("scrollCategoria").scrollBy(x, y);
   }
   
 scrollSubCategoria(x, y) {
  document.getElementById("scrollSubCategoria").scrollBy(x, y);
}
  

  listarSubCategorias(idCategoria) { 
      this.subCategoriaService.obtenerSubCategoriasXcategoria(idCategoria).subscribe(
             result => {      
                 this.subCategorias = result;//obtengo los datos
                 this.productos=null;
                 console.log(this.subCategorias);    
             },
               error =>{
                 console.log(<any>error);
               }
           );
  }

  listarProductos(idSubCategoria, nombreSubcateg){
    this.nombreSC = nombreSubcateg;
    console.log(idSubCategoria);
    this.productosService.obtenerProductosId(idSubCategoria).subscribe(
      result=>{
        this.productos=result;
        console.log("Obteniendo los productos...", this.productos);
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  enviarProducto(producto){
      this.menuComponet.recibeProducto(producto);
  }

  mostrarGustos(producto, modal, pos:number){
    this.modalG = modal;
    this.modalG.padre = this;//envía la referencia de este componente al modal para que pueda referenciar a su padre
    this.objPos = pos;
    this.modalG.showModalXprod(producto.codigo, []);
  }

  //estructura la informacion y llama el metodo 'enviarProducto'
  estructurarObjeto(gustos){
    console.log("gustos seleccionados: ", gustos);
    let prod = this.productos[this.objPos];
    if(this.cantidad == 0){
      this.cantidad=1;
      }
      let logeado = JSON.parse(sessionStorage.getItem('currentUser'));
      let user = logeado.user;     //obtiene el user del usuario logeado   
    //estructura el objeto
    let objProducto = {
      idProducto: prod.codigo,
      nombreP : prod.nombre+""+this.gustosString(gustos),
      precioP: parseInt(prod.precio),
      descuentoP: 0,
      gustos: gustos,
      cantidad: this.cantidad,
      comanda: prod.nombreComanda,
      usuario: user,
      editar: false,
      auditoria: "",
      numEdicion: 0,
      subCategoria: this.nombreSC,
      enviado: true,
      tr: 0 
    };
    this.enviarProducto(objProducto);
    
  }

  //03-02-2018
gustosString(gustos): string {
  let cadena: string = "";
  for (let i = 0; i < gustos.length; i++) {
    cadena += ", " + gustos[i].nombreG;
  }
  return cadena;
}


}
