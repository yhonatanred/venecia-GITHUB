import { Component, OnInit } from '@angular/core';
import { PedidoService } from "app/pedidos/pedido.service";
import { MesasService } from "app/mesas/mesas.service";
import { UsuariosService } from "app/usuarios/usuarios.service";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClientesService } from "app/clientes/clientes.service";
import { MenuService } from "app/menu/menu.service";
import { ComandaService } from "app/comanda/comanda.service";
import { ProductosService } from "app/productos/productos.service";
import { Pedido } from "app/menu/pedido";
import { empty } from 'rxjs/observable/empty';
import { isEmpty } from 'rxjs/operator/isEmpty';
import { MetodoPagoService } from 'app/metodoPago/metodoPago.service';




@Component({
  // tslint:disable-next-line
  selector: 'pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit {

  //Rol
  public rol: any = {};
  public rolTipo:boolean = false;

  /************************
   * CONSTANTES
   ************************/
  public LLEVAR: string = 'L';
  public DOMICILIO: string = 'D';

  public enviar_pedido: any; //pasa a modal partir cuenta la mesa actual
  public enviar_pedidos: any; //pasa a modal partir cuenta la mesa actual
  public posPedido: number;//posicion dentro del vector 'pedidos' de la cuenta que el usuario visualiza
  public verInputMesas: boolean;
  public pedidos;//variable que me representa todos los pedidos extraidos desde los ficheros JSON generados en la carta(touch)
  public pedido_actual;//representa el pedido actual para enviarlo a 'metodoPago'
  public domicilios;
  public productos;
  //VARIABLES QUE ME REPRESENTAN LOS INPUTS DE INFORMACION BASICA
  public mesa: string;
  public mesas;
  public mesero: string;
  public meseros;//almacena los meseros que se encuentran en la BD
  public telefono: string;
  public nombreC: string;
  public direccion: string;
  public empresa: string;
  //VARIABLES QUE REPRESENTAN INFORMACION DE LA CUENTA
  public numFactura: string;
  public descuentoG: number;//descuento global
  public propina: number;
  public numArticulos: number;
  public subTotal: number;
  public total: number;
  public turno: number;
  public horaPedido: string;
  public tablaPepido;//variable que almacena los productos solicitados por una cuenta
  //public regCliente:boolean;
  public auditoria: boolean;//variable que me representa la visualizacion del modal 'auditoria' en caso de editar el precio del producto
  public justificacion: string;//variable que me representa la justificacion por la cual se cambia el precio de un producto
  public actualiza_pedido: string;//variable que manejo para añadir mas productos a un pedido
  public comandas: string[];//vector para almacenar el nombre de las comandas
  public hora: string;//representa la hora a la que fue solicitado un pedido
  public nuevoProducto;//variable para agregar un nuevo producto al pedido desde la tabla
  public codigosProductos: string[];
  public porcDescuentoGlobal: number;
  public verError: boolean;
  public tr: number;//lo inicializo cuando cargo todos los pedidos
  public trMenu: number;//tr para enviar al menu
  public justificacionG: string;//variable que me representa la justificacion del descuento global
  public cantidadNprod: number;//variable que captura la cantidad al solicitar un producto desde la tabla para un pedido
  public acomulado: number;
  public justificacionB: string;

  //05-07-2018 cambiar mesa comprueba
  public verAlerta:boolean;
  public mensajeAlerta:string;
  /***********************
   * CONSTANTES GLOBALES
   ************************/
  private MESERO: string = "mesero";
  private enter: number = 13;
  private campo = "precio";

  public cambioMesa:string;//variable que me representa la nueva mesa que asignaré a una cuenta
  public fc:boolean;//variable que me representa el foco al input de cambioMesa

  constructor(private pedidoService: PedidoService, private mesaService: MesasService,
    private usuariosService: UsuariosService, private route: ActivatedRoute, private clientesService: ClientesService,
    private menuService: MenuService, private comandaService: ComandaService, private productosService: ProductosService,
    private metodoPagoService: MetodoPagoService) {
    this.verInputMesas = false;
    this.mesero = "";
    this.meseros = [];
    this.telefono = "";
    this.nombreC = "";
    this.direccion = "";
    this.empresa = "";
    this.mesas = [];
    this.numFactura = "";
    this.descuentoG = 0;
    this.propina = 0;
    this.subTotal = 0;
    this.total = 0;
    this.turno = 0;
    this.pedidos = [];
    this.productos = [];
    this.domicilios = [];
    this.comandas = [];
    this.posPedido = -1;
    this.justificacionG = "";
    this.porcDescuentoGlobal = 0;
    //this.regCliente = false;
    this.auditoria = false;
    this.justificacion = "";
    this.actualiza_pedido = "NO";
    this.hora = "";
    this.codigosProductos = [];
    this.verError = false;
    this.tr = 0;
    this.trMenu = 0;
    this.cantidadNprod = 1;
    this.acomulado = 0;
    //inicializo variable con la estructura de un nuevo producto para un pedido
    let logeado = JSON.parse(sessionStorage.getItem('currentUser'));
    let user = logeado.user;     //obtiene el user del usuario logeado  
    this.nuevoProducto = {
      idProducto: "",
      nombreP: "",
      precioP: "",
      descuentoP: 0,
      gustos: [],
      cantidad: 0,
      comanda: "",
      usuario: user,
      editar: false,
      auditoria: "",
      numEdicion: 0,
      subCategoria: "",
      enviado: false,
      tr: 0
    };
    //obtengo la informacion que recibo como parametro en la URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.cargarPedidos();
      this.mesa = params.get('mesa');
      this.cargarPedidos();
    });
    this.cargarMeseros();
    this.justificacionB = "";
    this.cambioMesa = "";
    this.fc = false;

    //05-07-2018 inicializo las variables
    this.verAlerta = false;
    this.mensajeAlerta = "";
  }

  ngOnInit() {
    this.pedidos = [];
    this.domicilios = [];
    this.cargarPedidos();
    this.cargarComandas();
    this.cargarIds_de_Productos();
    this.rolUsuario();
  }

  cargarComandas() {
    this.comandaService.verComandas().subscribe(
      result => {
        this.comandas = result;
      }, error => {
        console.log(<any>error);
      }
    );
  }

  cargarIds_de_Productos() {
    this.productosService.obtenerIds_de_Productos().subscribe(
      result => {
        this.codigosProductos = result;
      }, error => {
        console.log(<any>error);
      }
    );
  }

  obtenerMesas() {
    this.mesaService.listarMesas().subscribe(
      result => {
        let m = [];
        let pos: number = 0;
        let ban: boolean = false;
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < this.pedidos.length; j++) {
            if (result[i].identificador == this.pedidos[j].mesa) {
              ban = true;
              break;
            }
          }
          if (!ban) {
            m[pos] = result[i].identificador;
            ++pos;
          } else {
            ban = false;
          }

        }
        this.mesas = m;
      }, error => {
        console.log(<any>error);
      }
    );
  }

  cargarPedidos() {
    this.pedidoService.obtenerPedidos().subscribe(
      result => {
        console.log("cargar pedidos: ", result);
        this.enviar_pedidos = result;
        let p = 0;
        let d = 0;
        let band = false;
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            if (this.mesa == result[i].mesa) {
              band = true;
            }
            if (result[i].mesa.charAt(0) != 'D') {
              this.pedidos[p] = result[i];
              ++p;
            } else {
              this.domicilios[d] = result[i];
              ++d;
            }
          }
          if (!band) {
            this.mesa = '-1';
          }

          if (this.mesa == '-1') {
            if (this.pedidos.length > 0) {
              this.mostrarPedido(0);
              this.hora = this.pedidos[this.posPedido].horaPedido;
            } else if (this.domicilios.length > 0) {
              this.mostrarDomicilio(0);
            }

          } else {
            let band = false;
            for (let i = 0; i < this.pedidos.length; i++) {
              if (this.mesa == this.pedidos[i].mesa) {
                this.mostrarPedido(i);
                band = true;
              }
            }//fin del for
            if (!band) {
              for (let i = 0; i < this.domicilios.length; i++) {
                if (this.mesa == this.domicilios[i].mesa) {
                  this.mostrarDomicilio(i);
                  band = true;
                }
              }
            }
          }

        }
        this.obtenerMesas();
        this.consecTr();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //METODO QUE ME CARGA LOS MESEROS
  cargarMeseros() {
    this.usuariosService.listarUsuarios().subscribe(
      result => {
        let r = ['MESERO'];
        let pos: number = 1;
        for (let i = 0; i < result.length; i++) {
          if (result[i].rol == this.MESERO) {
            r[pos] = result[i].nombre + ' ' + result[i].apellido;
            ++pos;
          }
        }
        this.meseros = r;
        this.mesero = this.meseros[0];
      }, error => {
        console.log(<any>error);
      }
    );
  }

  //METODO QUE ME BUSCA UN CLIENTE POR EL TELEFONO ********************************editado yhonatan 29-11-2017
  buscarCliente(telefono: string, modal) {
    this.clientesService.buscarCliente_X_tel(telefono).subscribe(
      result => {
        if (result.idCliente != -1) {
          this.telefono = result.telefonoC;
          this.nombreC = result.nombreCompleto;
          this.direccion = result.direccionC;
          this.empresa = result.empresa;
          this.guardaCambios();
        } else {
          modal.mostrarModal();
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }


  //muestra los datos en la vista principal de los pedidos
  mostrarPedido(pos: number) {
    this.posPedido = pos;
    let pedido = this.pedidos[pos];
    this.pedido_actual = pedido;
    this.porcDescuentoGlobal = this.pedido_actual.porcDescuento;
    this.enviar_pedido = this.pedido_actual;
    let infoBasica = pedido.infoBasica;
    this.mesero = infoBasica.mesero;
    this.telefono = infoBasica.telefono;
    this.nombreC = infoBasica.nombreC;
    this.direccion = infoBasica.direccion;
    this.empresa = infoBasica.empresa;
    this.mesa = pedido.mesa;
    this.hora = pedido.horaPedido;
    //carga variables del contenedor de info de la cuenta
    this.numFactura = pedido.numFactura;
    this.descuentoG = pedido.descuentoG;
    this.propina = pedido.propina;
    this.subTotal = pedido.subTotal;
    this.total = pedido.total;
    this.turno = pedido.turno;
    this.actualiza_pedido = "SI";
    this.productos = pedido.productos;
    this.hora = pedido.horaPedido;    
  }

  //me muestra en la vista principal los domicilios
  mostrarDomicilio(pos: number) {
    this.posPedido = pos;
    let domicilio = this.domicilios[pos];
    this.pedido_actual = domicilio;
    this.porcDescuentoGlobal = this.pedido_actual.porcDescuento;
    this.enviar_pedido = this.pedido_actual;
    let infoBasica = domicilio.infoBasica;
    this.mesero = infoBasica.mesero;
    this.telefono = infoBasica.telefono;
    this.nombreC = infoBasica.nombreC;
    this.direccion = infoBasica.direccion;
    this.empresa = infoBasica.empresa;
    this.mesa = domicilio.mesa;
    this.hora = domicilio.horaPedido;
    //carga variables del contenedor de info de la cuenta
    this.numFactura = domicilio.numFactura;
    this.descuentoG = domicilio.descuentoG;
    this.propina = domicilio.propina;
    this.subTotal = domicilio.subTotal;
    this.total = domicilio.total;
    this.turno = domicilio.turno;
    this.actualiza_pedido = "SI";
    this.productos = domicilio.productos;
  }

  //metodo que me calcula el valor total de un producto
  calcularVT(precio: number, descuento: number, cantidad: number): number {
    return this.redondear((precio - (precio * (descuento / 100))) * cantidad);
  }

  //metodo que valida si el pedido corresponde a una mesa, para llevar o false en caso de ser un domicilio
  validarMesa(mesa: string): boolean {
    if (mesa.charAt(0) != 'D') {
      return true;
    } else {
      return false;
    }
  }

  pagar() {
    if (this.mesa.charAt(0) != 'D') {
      this.pedido_actual = this.pedidos[this.posPedido];
    } else {
      this.pedido_actual = this.domicilios[this.posPedido];
      console.log("domicilio: ", this.pedido_actual);
    }
  }

  infoBasica() {
    let infoBasica =
      { mesero: this.mesero, telefono: this.telefono, nombreC: this.nombreC, direccion: this.direccion, empresa: this.empresa }
    return JSON.stringify(infoBasica);
  }

    //METODO PARA CREAR UN NUEVO PEDIDO y retorna true cuando tengo el numero de factura
  nuevoPedido() {
    
    this.limpiarTodo();    
    this.pedidoService.consultarNumFactura().subscribe(
        result => {
          //toma el consecutivo mayor de factura en la BD
          let nFacturaBD:number = 0;
          nFacturaBD = parseInt(result.numFactura);

          //if (nFacturaBD.toString().length < 5) {
            //this.numFactura = "00" +nFacturaBD;        
          //} else {
            //this.numFactura = "" +nFacturaBD 
          //}
          //TOMA EL CONSECUTIVO MAYOR DE FACTURA DE LOS PEDIDOS ABIERTOS
          this.actualiza_pedido = "NO";
          let nFactura: number = 0;

          if (this.pedidos.length > 0 || this.domicilios.length > 0) {
            if (this.pedidos.length > 0) {
              for (let i = 0; i < this.pedidos.length; i++) {
                let nFactura2 = parseInt(this.pedidos[i].numFactura);
                if (nFactura < nFactura2) {
                  nFactura = nFactura2;
                }
              }
            }
            if (this.domicilios.length > 0) {
              for (let i = 0; i < this.domicilios.length; i++) {
                let nFactura2 = parseInt(this.domicilios[i].numFactura);
                if (nFactura < nFactura2) {
                  nFactura = nFactura2;
                }
              }
            }
          }
          //ESCOGO EL MAYOR ENTRE LOS QUE HAY EN LA BD Y LOS PEDIDOS ABIERTOS
          if(nFactura < nFacturaBD){
            nFactura = (nFacturaBD-1);
          }
          if (nFactura.toString().length < 5) {
            this.numFactura = "00" + (nFactura + 1);        
          } else {
            this.numFactura = "" + (nFactura + 1);
          }
          
          this.abrirMesa();

        }, error => {
          console.log(<any>error);
        }
    );
    
  }

  limpiarTodo() {
    //this.mesa = "";
    this.mesero = this.meseros[0];
    this.telefono = "";
    this.nombreC = "";
    this.direccion = "";
    this.empresa = "";
    this.productos = [];
    this.propina = 0;
    this.descuentoG = 0;
    this.total = 0;
    // this.numFactura = "";
    this.subTotal = 0;
    this.pedido_actual = undefined;
    this.porcDescuentoGlobal = 0;
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minutese = minutes < 10 ? '0'+minutes : minutes;
    let h = hours + ':' + minutese + ' '+ ampm;
    this.hora = h;
  }

  inicializarEstados_productos() {
    for (let i = 0; i < this.productos.length; i++) {
      this.productos[i].editar = false;
    }
  }

  guardarEdicion() {
    this.pagar();
    console.log("guarda edicion --> pedido act: ",this.pedido_actual);

    this.inicializarEstados_productos();
    this.pedido_actual.productos = this.productos;
    this.pedido_actual.subTotal = 0;
    for (let i = 0; i < this.productos.length; i++) {
      this.pedido_actual.subTotal += this.calcularVT(this.productos[i].precioP, this.productos[i].descuentoP, this.productos[i].cantidad);
    }
    this.pedido_actual.total = (this.pedido_actual.subTotal - this.pedido_actual.descuentoG);


    this.pedidoService.reemplazarPedido(this.pedido_actual).subscribe((data)=>{
      this.cargarPedidos();
    },error=>{
      console.log(<any>error);
    });
  }

  estadoAuditoria(event) {
    let p = (<HTMLInputElement>document.getElementById("precioU")).value;

    console.log("precioU: ", p);
    /*if(event.keyCode != this.enter){
      this.auditoria = true;
    }    */
  }

  //retorna true si la cadena está vacia
  varificarCadena_vacia(cadena): boolean {
    let tam = 0;
    for (let i = 0; i < cadena.length; i++) {
      if (cadena.charAt(i) != ' ') {
        ++tam;
      }
    }
    if (tam > 0) {
      return false;
    } else {
      return true;
    }
  }

  limpiarNuevoProducto() {
    let logeado = JSON.parse(sessionStorage.getItem('currentUser'));
    let user = logeado.user;     //obtiene el user del usuario logeado  
    this.nuevoProducto = {
      idProducto: "",
      nombreP: "",
      precioP: "",
      descuentoP: 0,
      gustos: [],
      cantidad: 0,
      comanda: "",
      usuario: user,
      editar: false,
      auditoria: "",
      numEdicion: 0,
      subCategoria: "",
      enviado: false,
      tr: 0
    };
  }

  buscarProducto(idProducto, event) {
    if (event.keyCode == this.enter && !this.varificarCadena_vacia(this.nuevoProducto.idProducto)) {
      this.productosService.obtenerProductos_X_codigo(idProducto).subscribe(
        result => {
          if (result.length > 0) {
            let logeado = JSON.parse(sessionStorage.getItem('currentUser'));
            let user = logeado.user;     //obtiene el user del usuario logeado  
            this.nuevoProducto = {
              idProducto: result[0].codigo,
              nombreP: result[0].nombre,
              precioP: parseInt("" + result[0].precio),
              descuentoP: 0,
              gustos: [],
              cantidad: this.cantidadNprod,
              comanda: result[0].nombreComanda,
              usuario: user,
              editar: false,
              auditoria: "",
              numEdicion: 0,
              subCategoria: "",
              enviado: false,
              tr: this.tr
            };
            let date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            let minutese = minutes < 10 ? '0'+minutes : minutes;
            let hora = hours + ':' + minutese + ' '+ ampm;
            let subT = this.nuevoProducto.precioP * this.nuevoProducto.cantidad;
            this.subTotal += subT;
            //-------------------nuevo 02-01-2017 DARIO------------------
            this.calcularDescuentoG();
                  this.total = (this.subTotal - this.descuentoG);
            //--------------------------------------------------------
            let np = new Pedido([this.nuevoProducto], subT, 0, this.descuentoG, subT, this.mesa, JSON.parse(this.infoBasica()), 0, "" + hora, this.numFactura, false, this.porcDescuentoGlobal, "");
            this.menuService.actualizarPedido(np).subscribe((data) => {
              this.cantidadNprod = 1;
              this.limpiarNuevoProducto();
              this.cargarPedidos();             
            }, error => {
              console.log(<any>error);
            }
            );
            //this.limpiarNuevoProducto();
            //this.cargarPedidos();
          }          
          //aqui estaba la llamada al metodo cargarPedidos()
        }, error => {
          console.log(<any>error);
        }
      );
    }else{
      console.log("NO BUSCA: "+idProducto);
    }
  }

  calcPropina() {
    let p = this.redondear((this.total * 0.1));
    return p;
  }

  //METODO PARA CALCULAR EL DESCUENTO GLOBAL
  calcularDescuentoG(): number {
    //this.pagar();
    if (this.porcDescuentoGlobal != undefined) {
      this.descuentoG = this.subTotal * (this.porcDescuentoGlobal / 100);
      this.descuentoG = this.redondear(this.descuentoG);
    } else {
      if (this.pedido_actual != undefined) {
        this.descuentoG = this.pedido_actual.descuentoG;
      } else {
        this.descuentoG = 0;
      }

    }
    return this.descuentoG;
  }

  calculoModalDescuento(): number {
    let desc = this.descuentoG;
    if (this.porcDescuentoGlobal != undefined) {
      desc = this.subTotal * (this.porcDescuentoGlobal / 100);
      desc = this.redondear(this.descuentoG);
    } else {
      desc = 0;

    }
    return desc;
  }

  //METODO QUE ME REDONDEA A CIENTOS
  redondear(val: number): number {
    let n = val / 100;
    let r = Math.round(n);
    return (r * 100);
  }
  /***********************************
   * METODOS MANEJADORES DE EVENTOS
   **********************************/
  eventBtnVerPedido(pos: number) {
    this.verInputMesas = false;
    console.log("eventBtnVerPed -->"+this.total);
    this.mostrarPedido(pos);
  }

  eventBtnVerDomicilio(pos: number) {
    this.verInputMesas = false;
    this.mostrarDomicilio(pos);
  }
  //metodo para el boton domicilio
  eventBtnDomicilio() {
    this.nuevoDomicilio();
    //this.nuevoPedido();
  }

  nuevoDomicilio(){
    //this.limpiarTodo();
    this.verInputMesas = false;    
    this.pedidoService.consultarNumDomicilio().subscribe((result) => {
      this.mesa = result.consecDomicilio;
      if (this.domicilios.length > 0) {
        let m: number;
        let n = 0;
        let band: boolean = false;
        for (let i = 0; i < this.domicilios.length; i++) {
          if (this.domicilios[i].mesa.charAt(0) == this.DOMICILIO) {
            m = parseInt(this.domicilios[i].mesa.substr(1, 4));
            if (n < m) {
              n = m;
            }
            band = true;
          }
        }
        if (!band) {
          this.mesa = "D1";
        } else {
          ++n;
          let m = parseInt(this.mesa.substr(1, 4));
          if (m <= n) {
            this.mesa = 'D' + n;
          }
        }
      }
      this.nuevoPedido();
    }, error => {
      console.log(<any>error);
    }); 
  }

  //metodo para el boton llevar
  eventBtnLlevar() {
    this.ponerMesa(); 
   // this.nuevoPedido();
  }

  ponerMesa() {
    this.verInputMesas = false;    
    this.pedidoService.consultarNumLlevar().subscribe(
      result => {
        this.mesa = result.consecLlevar;
        if (this.pedidos.length > 0) {
          let m: number;
          let n = 0;
          let band: boolean = false;
          for (let i = 0; i < this.pedidos.length; i++) {
            if (this.pedidos[i].mesa.charAt(0) == this.LLEVAR) {
              m = parseInt(this.pedidos[i].mesa.substr(2, 4));
              if (n < m) {
                n = m;
              }
              band = true;
            }
          }
          if (band) {
            ++n;
            let m = parseInt(this.mesa.substr(2, 4));
            if (m <= n) {
              this.mesa = 'LL' + n;} 
          }else {
            if(this.mesa==""){
              this.mesa = "LL1";
            }
          }
        }
        this.nuevoPedido();
      }, error => {
        console.log(<any>error);
      }
    );

  }

  eventBtnPagar(modal) {
    modal.showModal();
    this.pagar();
  }

  eventVerMesas() {
    this.mesa = "";
    this.limpiarTodo();
    this.verInputMesas = true;
  }

  focusMesa() {
    //if(this.fc){
      //document.getElementById("cambiar").focus();
    //}else{
      //document.getElementById("cambiar").blur();
    //}
    document.getElementById("mesa").focus();
  }

  focusTelefono() {
    document.getElementById("telefono").focus();
  }

  //manejador de eventos para buscar un cliente
  eventBuscar_Cliente(event, modal) {
    if (event.keyCode == this.enter) {
      this.buscarCliente(this.telefono, modal);
    }
  }

  eventHabilitar_Edicion(pos: number, estado: boolean) {
    if (this.productos[pos].numEdicion < 1) {
      this.productos[pos].editar = !estado;
    }

  }

  eventGuardar_edicion(event, pos: number, modal) {
    let p = (<HTMLInputElement>document.getElementById("precioU")).value;
    let e = p.replace(".", "");//quita el formato del precio
    e = e.replace("'", "");//quita el formato del precio
    if (this.productos[pos].precioP == e) {
      this.auditoria = false;
    } else {
      this.auditoria = true;
    }
    if (event.keyCode == this.enter) {
      if (!this.auditoria) {
        this.guardarEdicion();
      } else {
        modal.id = pos;//almacena la posicion del producto en el id del modal
        modal.show();
      }
    }
  }

  //DARIO
  eventDescuento(event, pos: number, modal) {
    let d = (<HTMLInputElement>document.getElementById("descuentoP")).value;
    if (this.productos[pos].descuentoP == d) {
      this.auditoria = false;
    } else {
      this.auditoria = true;
    }
    if (event.keyCode == this.enter) {
      if (!this.auditoria) {
        this.guardarEdicion();
      } else {
        modal.id = pos;//almacena la posicion del producto en el id del modal
        modal.show();
      }
    }
  }

  eventJustificar(justificacion: string, modal) {
    if (!this.varificarCadena_vacia(justificacion)) {
      this.pagar();
      let pos = modal.id;//extrae la posicion del producto a traves del id del modal
      this.pedido_actual.productos[pos].auditoria = justificacion;
      this.auditoria = false;
      //guarda el nuevo precio
      let p = (<HTMLInputElement>document.getElementById("precioU")).value;
      let e = p.replace(".", "");//quita el formato del precio
      e = e.replace("'", "");//quita el formato del precio 
      this.productos[modal.id].precioP = e;
      //guarda el descuento
      let d = (<HTMLInputElement>document.getElementById("descuentoP")).value;
      this.productos[modal.id].auditoria = this.justificacion;
      this.productos[modal.id].descuentoP = d;
      this.productos[modal.id].numEdicion += 1;
      this.justificacion = "";
      this.guardarEdicion();
      modal.hide();
    } else {
      console.log("por favor rellee el campo");
    }
  }

  eventHideAuditoria(modal) {
    this.guardarEdicion();
    modal.hide();
  }

  //27-11-2017
  eventCuenta() {
    this.pagar();
    let date = new Date();
    let fecha = date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate();
    /*pedido: Pedido, fecha:string, tipoPago: string, entrega: number, cambio: number, vrTarjeta: number,
      vrEfectivo: number, tipoReporte: string */
    this.pedidoService.imprimirCuenta(this.pedido_actual, fecha, "", 0, 0, 0, 0, "cuenta").subscribe((data) => {
      console.log(data);
      let m = this.pedido_actual.mesa;
      if (m == this.DOMICILIO) {
        this.domicilios[this.posPedido].impCuenta = true;
        this.pedido_actual.impCuenta = true;
        this.reemplazarJson(this.pedido_actual);
      } else {
        //this.pedidos[this.posPedido].impCuenta = true;
        this.pedido_actual.impCuenta = true;
        this.reemplazarJson(this.pedido_actual);
      }
    }, error => {
      console.log(<any>error);
    });
  }

  //METODO QUE ME REEMPLAZA EL ARCHIVO JSON DEL SERVIDOR POR UN PEDIDO
  reemplazarJson(pedido: Pedido) {
    this.pedidoService.reemplazarPedido(pedido).subscribe((data) => {
    }, error => {
      console.log(<any>error);
    });
  }

  eventDescuentoGlobal(modal) {
    let desc = (this.descuentoG * 100) / this.total;
    this.porcDescuentoGlobal = Math.round(desc);
    if (this.porcDescuentoGlobal == 0) {
      this.porcDescuentoGlobal = undefined;
    }
    modal.show();
  }

  //METODOS MANEJADORES DE EVENTOS DEL MODAL DESCUENTO_GLOBAL
  eventCerrarDesc(modal) {
    this.porcDescuentoGlobal = undefined;
    modal.hide();
    this.verError = false;
  }

  eventAceptarDesc(modal, modalAud) {
    if (this.porcDescuentoGlobal == undefined) {
      this.verError = true;
    } else {
      modal.hide();
      this.verError = false;
      modalAud.show();
    }
  }

  guardarDescGlobal(modal) {
    if (!this.varificarCadena_vacia(this.justificacionG)) {
      this.pagar();
      this.total = (this.subTotal - this.descuentoG);
      this.pedido_actual.total = this.total;
      this.pedido_actual.descuentoG = this.descuentoG;
      this.pedido_actual.porcDescuento = this.porcDescuentoGlobal;
      this.pedido_actual.auditoriaG = this.justificacionG;
      this.pedidoService.reemplazarPedido(this.pedido_actual).subscribe((data) => {
        this.justificacionG = "";
      }, error => {
        console.log(<any>error);
      });
      modal.hide();
    }else{
      this.justificacionG = "";
    }
  }

  focusPorc() {
    document.getElementById("descuentoG").focus();
  }

  eventInpoutDesc(event, modal, modalAudGlobal) {
    let enter = '13';
    if (event.keyCode == enter) {
      this.eventAceptarDesc(modal, modalAudGlobal);
    }
  }

  //30-11-2017 dario
  consecTr() {
    this.pedidoService.consultarTr().subscribe(result => {
      if (result != null) {
        this.tr = parseInt("" + result.tr);
        this.trMenu = this.tr;
      }
      let band = false;
      let band2 = false;
      //recorre pedidos
      let tam = this.pedidos.length;
      for (let i = 0; i < tam; i++) {
        let tam2 = this.pedidos[i].productos.length;
        for (let j = 0; j < tam2; j++) {
          let tc = this.pedidos[i].productos[j].tr;
          if (this.tr <= tc) {
            this.tr = tc;
            this.trMenu = tc;
            band = true;
          }
          /*if (this.trMenu <= tc && this.pedidos[i].productos[j].enviado == true) {
            this.trMenu = tc;
            band2 = true;
          }*/
        }
      }//fin for
      //recorre domicilios
      tam = this.domicilios.length;
      for (let i = 0; i < tam; i++) {
        let tam2 = this.domicilios[i].productos.length;
        for (let j = 0; j < tam2; j++) {
          let tc = this.domicilios[i].productos[j].tr;
          if (this.tr <= tc) {
            this.tr = tc;
            this.trMenu = tc;
            band = true;
          }
          /*if (this.trMenu <= tc && this.domicilios[i].productos[j].enviado == true) {
            this.trMenu = tc;
            band2 = true;
          }*/
        }
      }//fin for 
      if (band) {
        ++this.tr;
        ++this.trMenu;
      }
      
    }, error => {
      console.log(<any>error);
    });

  }

  eventEnviar() {
    let logeado = JSON.parse(sessionStorage.getItem('currentUser'));
    let user = logeado.user;     //obtiene el user del usuario logeado  
    let tam = this.pedido_actual.productos.length;
    let productos = [];
    let j = 0;
    

    for (let i = 0; i < tam; i++) {
      if(!this.pedido_actual.productos[i].enviado){
        this.nuevoProducto = {
          idProducto: this.pedido_actual.productos[i].idProducto,
          nombreP: this.pedido_actual.productos[i].nombreP,
          precioP: parseInt("" +this.pedido_actual.productos[i].precioP),
          descuentoP: this.pedido_actual.productos[i].descuentoP,
          gustos: [],
          cantidad: this.pedido_actual.productos[i].cantidad,
          comanda: this.pedido_actual.productos[i].comanda,
          usuario: user,
          editar: this.pedido_actual.productos[i].editar,
          auditoria: this.pedido_actual.productos[i].auditoria,
          numEdicion: this.pedido_actual.productos[i].numEdicion,
          subCategoria: this.pedido_actual.productos[i].subCategoria,
          enviado: this.pedido_actual.productos[i].enviado,
          tr: this.pedido_actual.productos[i].tr
        };
        productos[j] = this.nuevoProducto;
        ++j;
        this.pedido_actual.productos[i].enviado = true;  
        
      }
    }
    this.pedidoService.reemplazarPedido(this.pedido_actual).subscribe((data) => {
      this.imprimir(productos);
    }, error => {
      console.log(<any>error);
    });
  }//fin del metodo

  ///yhonatan 29-11-2018 ******************************************
  mostrarModalCliente(modalCliente) {
    modalCliente.mostrarModal();
  }

  pasarCliente(event) {
    this.telefono = event.datos.telefonoC;
    this.nombreC = event.datos.nombreCompleto;
    this.direccion = event.datos.direccionC;
    this.empresa = event.datos.empresa;
    this.guardaCambios();
  }

  //dario
  //verifica si hay productos no enviados a comandas o no
  prodsNoEnviados(): boolean {
    let band = false;
    if (this.pedido_actual != undefined) {
      for (let i = 0; i < this.pedido_actual.productos.length; i++) {
        let env: boolean = this.pedido_actual.productos[i].enviado;
        if (!env) {
          band = true;
        }
      }//fin del for
    }

    return band;
  }

  //pone el focus en el input "codigo" para agregar un nuevo producto
  focusCodigo() {
    document.getElementById("nCodigo").focus();
  }

  eventInputMesa(event) {  
    if(event.keyCode == this.enter){
      if(!this.varificarCadena_vacia(this.mesa) ){
        this.verInputMesas = false;     
        this.focusCodigo();
        this.nuevoPedido();
      }
    }   
  }
  //metodo que me elimina un producto si aún no lo he enviado a la comanda
  eliminar(pos: number) {

      let aux = this.productos;
      this.productos = [];
      let j = 0;
      for (let i = 0; i < aux.length; i++) {
        if (i != pos) {
          this.productos[j] = aux[i];
          ++j;
        } else {
          let resta = this.calcularVT(aux[i].precioP, aux[i].descuentoP, aux[i].cantidad);
          this.pedido_actual.subTotal -= resta;
          this.pedido_actual.total -= resta;
          this.subTotal -= resta;
          this.total -= resta;
          
          this.pedidoService.reemplazarPedido(this.pedido_actual).subscribe((data) => {
          }, error => {
            console.log(<any>error);
          });
        }
      }
      this.pedido_actual.productos = this.productos;
      this.pedidoService.reemplazarPedido(this.pedido_actual).subscribe((data) => {
      }, error => {
        console.log(<any>error);
      });
  }

  cantidadProd(event, modalCantidad) {
    let mas = 43;//por defecto el codigo de '+' es 43
    if (mas == event.keyCode) {
      document.getElementById("nCodigo").blur();
      modalCantidad.showModal();
    }
  }

  pasarCantidad(event) {
    document.getElementById("nCodigo").focus();
    this.cantidadNprod = parseInt(event.datos);
  }

  eventAcomulado(modal) {
    let date = new Date();
    let fecha = date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate();
    this.pedidoService.ventasAcomuladas(fecha).subscribe(result => {
      this.acomulado = parseInt("" + result.ventas);
      this.acomulado = this.redondear(this.acomulado);
      modal.show();
    }, error => {
      console.log(<any>error);
    });
  }

  gustosString(gustos): string {
    let cadena: string = "";
    for (let i = 0; i < gustos.length; i++) {
      cadena += ", " + gustos[i].nombreG;
    }
    return cadena;
  }

  //MUESTRA LAS VENTAS POR FECHA
  verVentas(modal) {
    modal.showModal();
  }

  //scroll de mesas
  scrollMesas(x, y) {
    document.getElementById("scrollMesas").scrollBy(x, y);
  }

  validarMesas(): boolean {
    let valido: boolean = false;
    for (let i = 0; i < this.mesas.length; i++) {
      let m = "" + this.mesas[i];
      if (this.mesa.toLocaleUpperCase() == m.toLocaleUpperCase()) {
        valido = true;
      }
    }
    return valido;
  }

  mostrarFila_pedido(): boolean {
    let mostrar: boolean = false;
    if (this.mesa != '' && this.mesa != '-1') {
      mostrar = true;
      if (this.pedido_actual == undefined) {
        for (let i = 0; i < this.pedidos.length; i++) {
          if (this.pedidos[i].mesa.toLocaleUpperCase() == this.mesa.toLocaleUpperCase()) {
            mostrar = false;
            break;
          }
        }
      } else {
        mostrar = true;
      }
    }

    return mostrar;
  }

  guardaCambiosMayus() {
    this.mesa = this.mesa.toUpperCase();
    this.cambioMesa = this.cambioMesa.toUpperCase();
  }

  guardaCambios() {
    if (this.pedido_actual != undefined) {
      this.pedido_actual.infoBasica.mesero = this.mesero;
      this.pedido_actual.infoBasica.direccion = this.direccion;
      this.pedido_actual.infoBasica.empresa = this.empresa;
      this.pedido_actual.infoBasica.nombreC = this.nombreC;
      this.pedido_actual.infoBasica.telefono = this.telefono;
      this.pedidoService.reemplazarPedido(this.pedido_actual).subscribe((data) => {
      }, error => {
        console.log(<any>error);
      });
    }
  }

  verFacturas(facturas) {
    facturas.showModal();
  }

  partirCuenta(modal) {
    modal.showModal();
  }

  pasarMesas(event,modal) {
    this.pedidoService.reemplazarPedido(event.mesaActual).subscribe((data) => {
    }, error => {
      console.log(<any>error);
    });

    this.pedidoService.reemplazarPedido(event.mesaNueva).subscribe((data) => {
    }, error => {
      console.log(<any>error);
    });
    this.cargarPedidos();
    modal.hideModal();
    
  }

  mostrarFacturas(facturas){
    facturas.showModal();
  }

  eventEliminar(borrarModal, pos){
    if(!this.productos[pos].enviado){
      this.guardaBorrado(pos);
    }else{
      borrarModal.id = pos;
      borrarModal.show();
    }
  }

  eventCerrarModal_borrar(borrarModal){
    this.justificacionB = "";
    borrarModal.hide();
  }

  eventBorrar_producto(borrarModal){
    let pos:number = parseInt(borrarModal.id);  
    this.guardaBorrado(pos);  
    borrarModal.hide();
  }

  guardaBorrado(pos){
    //GUARDA EL PRODUCTO BORRADO EN LA BD
    let date = new Date();
    let fechaB = date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minutese = minutes < 10 ? '0'+minutes : minutes;
    let horaB = hours + ':' + minutese + ' '+ ampm;
    this.pedidoService.guardarBorrados(this.productos[pos], fechaB, horaB, this.justificacionB).subscribe(
      (data)=>{
        this.justificacionB = "";
        this.eliminar(pos);
      },error=>{
        console.log(<any>error);
      }
    );
  }

  //METODO QUE ME ABRE UNA MESA, ES DECIR; ME CREA UN PEDIDO VACIO
  abrirMesa(){
    let logeado = JSON.parse(sessionStorage.getItem('currentUser'));
    let user = logeado.user;     //obtiene el user del usuario logeado  
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minutese = minutes < 10 ? '0'+minutes : minutes;
    let hora = hours + ':' + minutese + ' '+ ampm;
    let subT = this.nuevoProducto.precioP * this.nuevoProducto.cantidad;
    let np = new Pedido([], 0, 0, 0, 0, this.mesa, JSON.parse(this.infoBasica()), 0, "" + hora, this.numFactura, false, 0, "");
    this.menuService.enviarPedidoNuevo(np).subscribe((data) => {
      this.cargarPedidos();     
    }, error => {
      console.log(<any>error);
    });
  }

  cambiarMesa(cambiarModal){
    //ME ELIMINAR EL JSON DEL PEDIDO ACTUAL PARA SU POSTERIOR ACTUALIZACION DE MESA
    let band: boolean = true;
    if (this.pedidos.length > 0) {
      for (let i = 0; i < this.pedidos.length; i++) {
        if (this.pedidos[i].mesa.toLocaleUpperCase() == this.cambioMesa.toLocaleUpperCase()) {
          band = false;
        }
      }
    }

    if(band){
      this.metodoPagoService.sacarPedido(this.pedido_actual.mesa).subscribe((data)=>{
        this.pedido_actual.mesa = this.cambioMesa;
        this.menuService.cambioMesa(this.pedido_actual).subscribe((data)=>{
          this.mesa = this.cambioMesa;     
          this.obtenerMesas();
          this.cambioMesa = "";
          this.fc = false;
          this.verAlerta = false;
          this.mensajeAlerta = ""; 
        },error=>{
          console.log(<any>error);
        });
        cambiarModal.hide();
      });   
    }else{
      this.mensajeAlerta = "La mesa ya existe.";
      this.verAlerta = true;
    } 
  }

  eventInputCambiar(cambiarModal, event){
    if(event.keyCode == '13'){
      this.cambiarMesa(cambiarModal);
    }
  }

  cerrarCambiarMesa(cambiarModal){
    this.mensajeAlerta = "";
    this.verAlerta = false;
    this.cambioMesa = "";
    this.fc = false;
    cambiarModal.hide();
  }

  eventCambio(cambiarModal){
    cambiarModal.show();
    this.fc = true;
  }

  //metodo que me pone el foco en el input de cambiar de mesa el pedido
  focusCambio(){
    if(this.fc){
      document.getElementById("cambiar").focus();
    }else{
      document.getElementById("cambiar").blur();
    }
  }
  
//METODO QUE ME RETORNA TRUE SI EL PEDIDO ACTUAL ES UNA MESA. SI ES LLEVAR O DOMICILIO RETORNA FALSE
  verBtnCambio(): boolean {
    if(this.pedido_actual != undefined){
      if (this.mesa.charAt(0) != 'D' && this.mesa.charAt(0) != 'L') {
        return true;
      } else {
        return false;
      }
    }else{
      return false;
    }
    
  }

   //19-12-2017
  //METODO QUE ME IMPRIME EN COMANDA UN PEDIDO
  imprimir(productos){
    console.log("tr en buscar: " + this.tr);
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minutese = minutes < 10 ? '0'+minutes : minutes;
    let hora = hours + ':' + minutese + ' '+ ampm;
    let subT = this.nuevoProducto.precioP * this.nuevoProducto.cantidad;
    let np = new Pedido(productos, subT, 0, 0, subT, this.mesa, JSON.parse(this.infoBasica()), 0, "" + hora, this.numFactura, false, 0, "");
    this.menuService.imprimir(np).subscribe((data)=>{
      this.limpiarNuevoProducto();
    },error=>{
      console.log(<any>error);
    });
  }

//20-01-2018
  public rolUsuario() {
    this.rol = JSON.parse(sessionStorage.getItem('currentUser'));
    if(this.rol.rol == 'mesero'){
      this.rolTipo = true;
    }else{
      this.rolTipo = false;
    }
  }

}//FIN DE LA CLASE