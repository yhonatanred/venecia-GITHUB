export class Pedido{
 constructor(

 public productos: Array<any>,//valores que almacena:
 public subTotal: number,
 public propina: number,
 public descuentoG: number,//atributo que me representa el descuento en pesos
 public total: number,
 public mesa: string,
 public infoBasica: Array<any>,
 public turno,
 public horaPedido,
 public numFactura :string,
 public impCuenta: boolean, 
 public porcDescuento: number,//13-12-2017 -- atributo que me representa el descuento en porcentaje
 public auditoriaG: string//13-12-2017
){}
}

