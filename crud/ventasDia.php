<?php
		// Configuración de cabeceras
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-xsrf-token");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include "conex.php";

//variables que reciben como parametro un json y luego lo decodifican para extraer la informacion
$json = $_REQUEST['json'];
$datos = json_decode($json);
$accion = $datos->{'accion'};

$ver = 'verVentas';

if($accion == $ver){
	$fecha1 = $datos->{'fecha1'};
	$fecha2 = $datos->{'fecha2'};
	verVentas($fecha1, $fecha2);
}

//FUNCION QUE ME RETORNA UN JSON CON TODOS LOS DATOS DE LAS VENTAS DIARIAS(productos vendidos, metodos de pagos, descuentos)
//recibe como argumento la feha en formato: año-mes-dia
function verVentas($fecha1, $fecha2){
	$query = "SELECT Detalle.idProducto, Productos.nombreP, SUM(Detalle.cantidad) as cantidad, Productos.precioP, Detalle.descuentoP, 
				SUM((Detalle.cantidad * Detalle.precioP) * ((100-Detalle.descuentoP)/100)) as total FROM Factura, Detalle, Productos WHERE Factura.idFactura = Detalle.idFactura AND Detalle.idProducto = Productos.idProducto AND Factura.fechaF >= '$fecha1' AND Factura.fechaF <= '$fecha2' group by Productos.idProducto, Detalle.descuentoP, Detalle.precioP";
	$productos = array();
	$link = conectar(); //llama a la funcion conectar de conex.php
	$result = $link->query($query); //envia el query a la BD
	$i=0;
	while($row = mysqli_fetch_array($result)){
		$array = array('idProducto' => $row['idProducto'], 'nombreP'=> $row['nombreP'], 'cantidad'=> $row['cantidad'], 'precioP'=> $row['precioP'], 'descuentoP'=> $row['descuentoP'], 'total'=> $row['total']);
		$productos[$i] = $array;
		++$i;
	}
//consulta el total de cada metodo de pago
	$query = "SELECT metodo_pago.metodoP, SUM(Metodo_pago_Factura.valor) as suma FROM Factura, metodo_pago, Metodo_pago_Factura 
	WHERE Factura.idFactura = Metodo_pago_Factura.idFactura AND Metodo_pago_Factura.idMetodo_pago = metodo_pago.idMetodo_pago  
	AND Factura.fechaF >= '$fecha1' AND Factura.fechaF <= '$fecha2' group by metodo_pago.metodoP";
	$result = $link->query($query);
	$metodosP = array();
	$i = 0;
	while($row = mysqli_fetch_array($result)){
		$array = array('metodo'=> $row['metodoP'], 'suma'=> $row['suma']);
		$metodosP[$i] = $array;
		++$i;
	}
//consulta el total de las propinas
	$query = "SELECT SUM(propina) as propina, SUM(descuentoF) as descuentoG FROM Factura WHERE Factura.fechaF >= '$fecha1' AND Factura.fechaF <= '$fecha2'";
	$desc_prop = array();
	$result = $link->query($query);
	if($result->num_rows == 1){
		$row = $result->fetch_assoc();
		$desc_prop = array('propina'=> $row['propina'], 'descuentoG'=> $row['descuentoG']);
	}
//consulta el total de los domicilios
	$query = "SELECT SUM(Metodo_pago_Factura.valor) as domicilios FROM Factura, Metodo_pago_Factura 
				WHERE Factura.fechaF >= '$fecha1' AND Factura.fechaF <= '$fecha2' AND LEFT(Factura.mesa, 1) = 'D'
				 AND Metodo_pago_Factura.idFactura = Factura.idFactura";
	$domicilios = 0;
	$result = $link->query($query);
	if($result->num_rows == 1){
		$row = $result->fetch_assoc();
		$domicilios = $row['domicilios'];
	}
	//consulta el total de las devueltas
	$query = "SELECT SUM(devuelta) as devuelta FROM Factura WHERE fechaF >= '$fecha1' AND fechaF <= '$fecha2'";
	$devueltas = 0;
	$result = $link->query($query);
	if($result->num_rows == 1){
		$row = $result->fetch_assoc();
		$devueltas = $row['devuelta'];
	}

	

	$ventas = array('productos'=> $productos, 'metodosP'=> $metodosP, 'otros', 'domicilios'=> $domicilios, 'prop_desc'=> $desc_prop, 'devuelta'=>$devueltas);
	$link->close();
	echo json_encode($ventas);
}

?>