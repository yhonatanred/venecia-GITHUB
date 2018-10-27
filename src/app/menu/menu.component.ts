import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
//datos desde otros componentes

import { CategoriaService } from '../categoria/categoria.service';
import { Categoria } from '../categoria/categoria';
//import { CartaHomeComponent } from '../carta/carta-home.component'; dario
import { ProductosService } from '../productos/productos.service';
import { Productos } from '../productos/productos';
import { SubCategoriaService } from 'app/subcategoria/subcategoria.service';
import { Pedido } from "app/menu/pedido";
import { GustosComponent } from "app/gustos/gustos.component";
import { MenuService } from "app/menu/menu.service";
import { CartaHomeComponent } from 'app/carta/carta-home.component';

@Component({
 selector: 'menu-component',
 templateUrl: './menu.component.html',
 styleUrls: ['menu.component.css'],
 providers: [CategoriaService, ProductosService, SubCategoriaService] 
})
export class MenuComponent implements OnInit {
//cantidad yhonatan
public cantidad: number;

 public titulo: string;
 public SubCategoria;
 public producto: Productos;
 public productos: Array<any>;
 public pedido: Pedido;
 public pos: number;
 public actualizarPedido;//variable que me indica si se va agregar mas productos a un pedido ya existente
 /****************************************************
  * VARIABLE QUE ME REPRESENTA 
  *EL TIPO DE RESPUESTA QUE DEBO
  *RECIBIR DEL PARAMETRO 'actualizar' DE LA URL
  *******************************************************/
  public respActualizar: string = "SI";
  //variable para almacenar la informacion de 'editar' un producto
  public editarProduct: string;
  public tr:number;//CONSECUTIVO UNICO DE CADA PRODUCTO

  public cargaNoEnviados: boolean = false;//variable que se activa cuando existe productos no enviados en el archivo JSON

  //VARIABLES AUXILIARES PARA EL MANEJO DEL TR
  public arrayTR: number[];//variable para almacenar los tr de los productos que no han sido enviados
  public auxTR: number;//variable auxiliar para almacenar temporalmente al tr principal (variable tr)

 constructor(
  private categoriaService: CategoriaService,
  private productosService: ProductosService,
  private subCategoriaService: SubCategoriaService,
  private route: ActivatedRoute,
  private menuService: MenuService
 ) {
     //cantidad yhonatan
    this.cantidad = 0;
  this.editarProduct = "";
  this.titulo = 'mesas';  
  this.productos = new Array;
  this.pos = -1;
  let infoBasica;
  let mesa;
  let numFactura;
  let turno;
  //obtengo la informacion que recibo comparametro en la URL
    this.route.paramMap.subscribe((params: ParamMap) => {
        infoBasica = JSON.parse(params.get('infoBasica'));
        mesa = params.get('mesa');
        numFactura = params.get('numFactura');
        turno = params.get('turno');
        this.actualizarPedido =  params.get('actualizar');
        this.tr = parseInt(params.get('tr'));//consecutivo unico de cada producto
      });   
    this.auxTR = this.tr; 
  this.pedido = new Pedido([] , 0, 0, 0, 0, mesa, infoBasica, turno, '', numFactura, false, -1, "");
console.log("recibe: ", this.pedido); 
}

 ngOnInit() {
     this.NoBack();
     this.cargarNoEnviados();
 }
 
 //carga los pedidos que aún no han sido enviados
 cargarNoEnviados(){
     this.menuService.buscarNoEnviados(this.pedido.mesa).subscribe(result=>{
        let tam = result.length;
        this.arrayTR = [tam];
        for(let i = 0; i < tam; i++){
            this.recibeProducto(result[i]);
            this.arrayTR[i] = result[i].tr;
            console.log("cargarEnviados: ",  result[i].tr);
        }
        console.log("arrayTR: ", this.arrayTR);
        if(tam > 0){
            this.cargaNoEnviados = true; 
        }
     },error=>{
         console.log(<any>error);
     });
 }

 //cantidADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD  yhonatan    
    reiniciar(){
      this.cantidad = 0;
    }

    validar():boolean{
      let cadena = ''+this.cantidad;
      if(cadena.length >= 16){
        return false;
      }else{
        return true;
      }
    }
    /*************************
     * METODOS MANEJADORES
     * DE EVENTOS
     *************************/
    
    eventCantidad(cant: number){
        if(cant != 0.5){
        if(this.validar()){
            let cadena: string = this.cantidad+''+cant;
            this.cantidad = parseFloat(cadena);
        }  
        }else{
        if(this.validar())
            this.cantidad += cant;
        }
     
    }

    //dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddD

 scrollWind(x, y) {
  document.getElementById("global").scrollBy(x, y);
 }
 
 NoBack(){
    history.go(1)
    }


 recibeProducto(producto) {
  this.producto = producto;  
  console.log("recibe producto: ", this.producto);
  this.productos.push(this.producto);
  this.pedido.productos = this.productos;
  //redondea directamnete el valor del producto 26-06-2018 yhonatan
  this.pedido.subTotal += this.redondea(producto.precioP * producto.cantidad);
  this.pedido.total = this.pedido.subTotal;
  console.log(this.productos);
  console.log("contenedor pedido: ", this.pedido);
  console.log("total: "+this.pedido.total+" subtotal: "+this.pedido.subTotal);
  this.cantidad = 0;
  
 }

 //metodo que me selecciona una fila
 seleccion(idProducto, pos){
     console.log("seleccion: "+idProducto);
     let check = document.getElementById('check'+pos) ; //.style.backgroundColor;// = "#ffffff";
     for(let i=0; i < this.productos.length; i++){
         if(i != pos){
             let check2 = document.getElementById('check'+i);
             check2.setAttribute("checked", "false");
             document.getElementById(''+i).style.backgroundColor = "#e4e5e6";
         }
     }    
     let estado = check.getAttribute("checked");     
     if(estado == 'true'){
         check.setAttribute("checked", 'false');
          let estado2 = check.getAttribute("checked");
          document.getElementById(''+pos).style.backgroundColor = "#e4e5e6";
         console.log("estado true: ", estado2);
     }else{
         check.setAttribute("checked", 'true');
         document.getElementById(pos).style.backgroundColor = "#53a7ea";
        console.log("estado false ", check.getAttribute("checked"));
     }
     
 }

borrar(pos){
    let prod = this.productos.splice(pos, 1);//argumentos: posicion donde inicia a borrar y cantidad de elementos a borrar
    this.pedido.productos = this.productos;
    this.pedido.subTotal -=  this.redondea(prod[0].precioP * prod[0].cantidad);
    this.pedido.total =  this.pedido.subTotal;
    //si borra los productos que se agregaron desde la pantalla principal (tabla pedidos 'productos no enviados')
    if(prod[0].tr > 0){
        let tam = this.productos.length;
        let tam2 = this.arrayTR.length;
        for(let i = 0; i < tam; i++){            
            if((i+1) <= tam2){
                this.productos[i].tr = this.arrayTR[i];
            }else{
                break;
            }            
        }
    }
}

modificarGustos(pos, modal){
    let idsGusto = [];
    let gustos = this.productos[pos].gustos;
    this.pos = pos;
    let x = 0;
    for(let i=0; i < gustos.length; i++){
        console.log("gusto --> "+ gustos[i]);
        idsGusto[i] = gustos[i].idGusto;     
    }
    modal.padre = this;
    modal.showModalXprod(this.productos[pos].idProducto, idsGusto);
    console.log("gustos: ", idsGusto);

}

estructurarObjeto(nombresG){
    this.productos[this.pos].gustos = nombresG;
    console.log(this.productos[this.pos].gustos);
}

 

//metodo que me muestra el modal para seleccionar la cantidad
 //7cantidad(modalCantidad){
    //modalCantidad.show();
 //}

 //metodo que me retorna la cantidad de articulos que enviaré como pedido
cantidadArt():number{
    let cant: number = 0;
    let prod = this.pedido.productos;
    for(let i=0; i < prod.length; i++){
        cant += prod[i].cantidad;
    }
    return cant;
}


enviar(){
    if(this.pedido.productos.length > 0){
        this.ponerTr();
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        let minutese = minutes < 10 ? '0'+minutes : minutes;
        let hora = hours + ':' + minutese + ' '+ ampm;
        this.pedido.horaPedido = hora;
        if(this.actualizarPedido == this.respActualizar){
            this.menuService.actualizarPedido(this.pedido).subscribe(
                (data)=>{
                    console.log("desde menu actualiza ",data);
                    this.menuService.imprimir(this.pedido).subscribe(
                        (d)=>{
                            console.log(d);
                        },er=>{
                            console.log(<any>er);
                        }
                    );
                },error=>{
                    console.log(<any>error);
                }
            );
        }else{
            this.menuService.enviarPedido(this.pedido).subscribe(
            (data)=>{
    
            },error=>{
                console.log(<any>error);
            }
        );
        }
    }else{
        this.pedido.mesa = '-1';
        console.log("mesaaaa::: "+this.pedido.mesa);
    }
    
}//FIN DEL METODO

ponerTr(){
    let tam = this.pedido.productos.length;
    let band: boolean = false;
    for(let i = 0; i < tam; i++){        
        if(this.cargaNoEnviados){            
            if(i == 0 && this.pedido.productos[i].tr == 0){
                band = true;               
            }
        }

        if(this.pedido.productos[i].tr == 0){
            let tam2 = this.arrayTR.length;
            if((i+1) <= tam2 && band==true){
                this.pedido.productos[i].tr = this.arrayTR[i];
            }else{
                console.log("tr menu --> "+this.tr);
                this.pedido.productos[i].tr = this.tr;
                ++this.tr;
            }
            
        }
        
    }
}

 /***********************
  * METODOS MANEJADORES
  * DE EVENTOS
  ***********************/
eventBorrar(){
    let band = false;
    for(let i=0; i < this.productos.length; i++){
        let check = document.getElementById('check'+i) ; 
        let estado = check.getAttribute("checked");
        if(estado == 'true'){
            this.borrar(i);
            band = true;
            break;
        }
    }
    if(!band){
        console.log("Por favor seleccione el producto a eliminar");
    }      
}

eventEditar(pos: number){
    this.productos[pos].editar = true;
}

eventInputEditar(event, pos:number){
    let enter = '13';
    if(event.keyCode == enter){
        this.productos[pos].editar = false;
    }
}

eventGustos(modal){
    modal.show();
    /*
    let band = false;
    for(let i=0; i < this.productos.length; i++){
        let check = document.getElementById('check'+i) ; 
        let estado = check.getAttribute("checked");
        if(estado == 'true'){
            this.modificarGustos(i, modal);
            band = true;
            break;
        }
    }
    if(!band){
        console.log("Por favor seleccione un producto");
    }
    */
}

  //eventCantidad(modalCantidad){
    //  this.cantidad(modalCantidad);
  //}

//03-02-2018
gustosString(gustos): string {
    let cadena: string = "";
    for (let i = 0; i < gustos.length; i++) {
      cadena += ", " + gustos[i].nombreG;
    }
    return cadena;
}

//METODO QUE ME REDONDEA A CIENTOS  20-05-2018
redondea(val: number): number {
    let n = val / 100;
    let r = Math.round(n);
    return (r * 100);
}

//metodo que me calcula el valor total de un producto
calcularValorProducto(precio: number, cantidad: number): number {
    return this.redondea(precio  * cantidad);
  }


}
