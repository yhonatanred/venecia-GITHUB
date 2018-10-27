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

$cerrar = 'cerrarCaja';
if($accion == $cerrar){
	cerrarCaja();
}

function cerrarCaja(){
	$link = conectar(); //llama a la funcion conectar de conex.php
	$infoCierre = array();
	//query para obtener la info basica del negocio
	$queryNegocio = "SELECT nombre, subnombre, nit FROM Negocio";	
	$info = array();
	$resultN = $link->query($queryNegocio); //envia el query a la BD
	if($resultN->num_rows == 1){
		$row = $resultN->fetch_assoc();
		$info = array('nombre'=>$row['nombre'], 'subnombre'=>$row['subnombre'], 'nit'=>$row['nit']);
	}

	//query para informacion de los consecutivos de facturas
	$queryFacturas = "SELECT MAX(consecFactura) as factFinal, MIN(consecFactura) as factInicial, COUNT(*) as cantidadFacturas FROM Factura WHERE cuadre = 0";
	$facturas = array();
	$resultF = $link->query($queryFacturas); //envia el query a la BD
	if($resultF->num_rows == 1){
		$row = $resultF->fetch_assoc();
		$facturas = array('facturaFinal'=>$row['factFinal'], 'facturaInicial'=>$row['factInicial'], 'total'=>$row['cantidadFacturas']);
	}

	//QUERY PARA OBTENER LAS VENTAS SIN DESCUENTOS
	$queryVentas = "SELECT SUM(Detalle.cantidad * Detalle.precioP) as ventas FROM Detalle, Factura 
					WHERE Factura.cuadre = 0 AND Factura.idFactura = Detalle.idFactura";
	$ventas = array();
	$resultV = $link->query($queryVentas); //envia el query a la BD
	if($resultV->num_rows == 1){
		$row = $resultV->fetch_assoc();
		$ventas = array('ventas'=>$row['ventas']);
	}

	//QUERY PARA OBTENER LOS DESCUENTO GLOBALES EN PESOS
	$queryDescG = "SELECT SUM(descuentoF) as descuentosGlobal FROM Factura WHERE cuadre = 0";
	$descuentoG = array();
	$resultG = $link->query($queryDescG); //envia el query a la BD
	if($resultG->num_rows == 1){
		$row = $resultG->fetch_assoc();
		$descuentoG = array('descuentoG'=>$row['descuentosGlobal']);
	}

	//QUERY PARA OBTENER LOS DESCUENTOS POR PRODUCTOS EN PESOS
	$queryDescP = "SELECT SUM((Detalle.descuentoP*Detalle.precioP)/100) as descuentoP FROM Factura, Detalle WHERE Factura.cuadre = 0 
					AND Factura.idFactura = Detalle.idFactura";
	$descuentoP = array();
	$resultP = $link->query($queryDescP); //envia el query a la BD
	if($resultP->num_rows == 1){
		$row = $resultP->fetch_assoc();
		$descuentoP = array('descuentoP'=>$row['descuentoP']);
	}

	//QUERY PARA OBTENER LA PROPINA/ SERBVICIO ADICIONAL
	$queryPropina = "SELECT SUM(propina) as propina FROM Factura WHERE cuadre = 0";
	$propina = 0;
	$resultProp = $link->query($queryPropina); //envia el query a la BD
	if($resultProp->num_rows == 1){
		$row = $resultProp->fetch_assoc();
		$propina = $row['propina'];
	}

	//QUERY PARA OBTENER EL TOTAL DE LOS DOMICILIOS
	$queryDomi = "SELECT SUM(entrega - devuelta) as domicilios FROM Factura WHERE LEFT(Factura.mesa, 1) = 'D' AND Factura.cuadre = 0";
	$domicilios = 0;
	$resultDomi = $link->query($queryDomi);
	if($resultDomi->num_rows == 1){
		$row = $resultDomi->fetch_assoc();
		$domicilios = $row['domicilios'];
	}

	//QUERY PARA OBTENER EL EFECTIVO
	$queryEfectivo = "SELECT SUM(Factura.entrega - Factura.devuelta) as efectivo FROM Factura, Metodo_pago_Factura, Metodo_pago WHERE 
						Metodo_pago_Factura.idFactura = Factura.idFactura AND Metodo_pago_Factura.idMetodo_pago = Metodo_pago.idMetodo_pago
						 AND Metodo_pago.metodoP = 'EFECTIVO'";
	$efectivo = 0;
	$resultEfect = $link->query($queryEfectivo);
	if($resultEfect->num_rows == 1){
		$row = $resultEfect->fetch_assoc();
		$efectivo = $row['efectivo'];
	}

	//QUERY PARA OBTENER EL VALOR PAGADO EN TARJETAS
	$queryTarjeta = "SELECT SUM(Factura.entrega - Factura.devuelta) as tarjeta FROM Factura, Metodo_pago_Factura, Metodo_pago WHERE 
						Metodo_pago_Factura.idFactura = Factura.idFactura AND Metodo_pago_Factura.idMetodo_pago = Metodo_pago.idMetodo_pago
						 AND Metodo_pago.metodoP = 'TARJETA'";
	$tarjeta = 0;
	$resultTarj = $link->query($queryTarjeta);
	if($resultTarj->num_rows == 1){
		$row = $resultTarj->fetch_assoc();
		$tarjeta = $row['tarjeta'];
	}

	//QUERY PARA OBTENER EL VALOR VENDIDO A CREDITO
	$queryCredito = "SELECT SUM(Factura.entrega - Factura.devuelta) as credito FROM Factura, Metodo_pago_Factura, Metodo_pago WHERE 
						Metodo_pago_Factura.idFactura = Factura.idFactura AND Metodo_pago_Factura.idMetodo_pago = Metodo_pago.idMetodo_pago
						 AND Metodo_pago.metodoP = 'CREDITO'";
	$credito = 0;
	$resultCred = $link->query($queryCredito);
	if($resultCred->num_rows == 1){
		$row = $resultCred->fetch_assoc();
		$credito = $row['credito'];
	}

	//CALCULO LOS DESCUENTOS TOTALES
	$descProd = $descuentoP['descuentoP'];
	$descGlob = $descuentoG['descuentoG'];
	$descTotal = ( $descProd + $descGlob );
	//CALCULO DE VENTA NETA
	$ventaNeta = ($ventas['ventas'] - $descTotal);
	//CALCULO EL TOTAL
	$total = ( $ventaNeta + $propina );

	$queryCuadrar = "UPDATE Factura SET cuadre = 1";
	$resultCuadrar = $link->query($queryCuadrar);
	if($resultCuadrar){
		echo "cuadre realizado";
	}else{
		echo "error al cuadrar caja en BD";
	}


//array que almacena toda la informacion de la zeta
	$infoCierre = array('infoNegocio'=>$info, 'facturas'=>$facturas, 'venta'=>$ventas, 'descuentos'=>$descTotal, 'ventaNeta'=>$ventaNeta, 'propina'=>$propina, 'domicilios'=>$domicilios, 'total'=>$total, 'efectivo'=>$efectivo, 'tarjeta'=>$tarjeta, 'creditos'=>$credito);


	$link->close();
	$arrayDatos = json_encode($infoCierre);
	header("Location: factura_z.php?facturaZJson=$arrayDatos");
}

?>