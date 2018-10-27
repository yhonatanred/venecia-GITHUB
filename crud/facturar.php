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

$pagar = 'pagar';
$metodos = 'metodos';
$imprimir = 'imprimir';
$acomulado = 'acomulado';
$buscarFact_X_num = 'buscarFact_X_num';
$buscarFact_X_dato = 'buscarFact_X_dato';
$actualizar_info = 'actualizarInfo';

if($accion==$pagar){
	$pedido = $datos->{'pedido'};
	$fecha = $datos->{'fecha'};
	$idUsuario = $datos->{'idUsuario'};
	$tipoPago = $datos->{'tipoPago'};
	$entrega = $datos->{'entrega'};
	$devuelta = $datos->{'devuelta'};
	$val1 = $datos->{'vrTarjeta'};
	$val2= $datos->{'vrEfectivo'};
	guardar_factura($pedido, $fecha, $idUsuario, $tipoPago, $entrega, $devuelta, $val1, $val2);
}else if($accion==$metodos){
	obtenerMetodos_de_pago();
}else if($accion == $imprimir){
	$pedido = $datos->{'pedido'};
	$fecha = $datos->{'fecha'};
	$tipoPago = $datos->{'tipoPago'};
	$entrega = $datos->{'entrega'};
	$cambio = $datos->{'cambio'};
	$vrTarjeta = $datos->{'vrTarjeta'};
	$vrEfectivo = $datos->{'vrEfectivo'};
	$tipoReporte = $datos->{'tipoReporte'};
	imprimirFactura($pedido, $fecha, $tipoPago, $entrega, $cambio, $vrTarjeta, $vrEfectivo, $tipoReporte);
}else if($accion == $acomulado){
	$fecha = $datos->{'fecha'};
	acomulado($fecha);
}else if($accion == $buscarFact_X_num){
	$numFact = $datos->{'numFact'};
	buscarFactura_X_numero($numFact);
}else if($accion == $actualizar_info){
	$infoFactura = $datos->{'infoFactura'};
	$pagoAnterior = $datos->{'pagoAnterior'};
	$pagoActual = $datos->{'pagoActual'};
	$valor1 = $datos->{'valor1'};
	$valor2 = $datos->{'valor2'};
	$devuelta = $datos->{'devuelta'};
	$propina = $datos->{'propina'};
	actualizarInfo_factura($infoFactura, $pagoAnterior, $pagoActual, $valor1, $valor2, $devuelta, $propina);
}else if($accion == $buscarFact_X_dato){
	$dato = $datos->{'dato'};
	$buscarPor = $datos->{'buscarPor'};
	buscarFac_X_dato($dato, $buscarPor);
}

function guardar_factura($pedido, $fecha, $idUsuario, $tipoPago, $entrega, $devuelta, $val1, $val2){
	$consecFactura = $pedido->{'numFactura'};
	$hora = $pedido->{'horaPedido'};
	$propina = $pedido->{'propina'};
	$mesa = $pedido->{'mesa'};
	$productos = $pedido->{'productos'};
	$descuentoF = $pedido->{'descuentoG'};
	$infoBasica = $pedido->{'infoBasica'};
	$mesero = $infoBasica->{'mesero'};
	$telefono = $infoBasica->{'telefono'};
	$nombre = $infoBasica->{'nombreC'};
	$direccion = $infoBasica->{'direccion'};
	$empresa = $infoBasica->{'empresa'};
	$idNegocio = 1;//FILA UNICA DE LA TABLA INFONEGOCIO
	//variable que me almacena la auditoria
	$auditGlobal = $pedido->{'auditoriaG'};

	$link = conectar(); //llama a la funcion conectar de conex.php
	/*****************************************************************************************************************
	*******************BLOQUE PARA GUARDAR LA INFORMACION EN LA TABLA 'FACTURA'***************************************
	******************************************************************************************************************/
	$query = "";
	if(empty($auditGlobal) ){
		$cuadre = 0;//false
		$query = "INSERT INTO Factura(consecFactura, fechaF, horaF, propina, mesero, mesa, descuentoF, nombreCompleto, telefonoC, direccionC, empresa, entrega, devuelta, idUsuario, idNegocio, cuadre) VALUES( $consecFactura, '$fecha', '$hora', $propina, '$mesero', '$mesa',  $descuentoF, '$nombre', '$telefono', '$direccion', '$empresa', $entrega, $devuelta, $idUsuario,  $idNegocio, $cuadre)";
	}else{		
		$queryAud = "INSERT INTO Auditorias(justificacion) VALUES ('$auditGlobal')";
		$resultAud = $link->query($queryAud); //envia el query a la BD
		if($resultAud){
			$queryAud = "SELECT MAX(idAuditoria) as idAuditoria FROM Auditorias";
			$resultAud = $link->query($queryAud); //envia el query a la BD
			if($resultAud->num_rows == 1){
				$row = $resultAud->fetch_assoc();
				$idAuditoria = $row['idAuditoria'];
				$cuadre = 0;//false
				$query = "INSERT INTO Factura(consecFactura, fechaF, horaF, propina, mesero, mesa, descuentoF, nombreCompleto, telefonoC, direccionC, empresa, entrega, devuelta, idUsuario, idNegocio, Auditorias_idAuditoria, cuadre) VALUES( $consecFactura, '$fecha', '$hora', $propina, '$mesero', '$mesa',  $descuentoF, '$nombre', '$telefono', '$direccion', '$empresa', $entrega, $devuelta, $idUsuario,  $idNegocio, $idAuditoria, $cuadre)";
			}else{
				echo "no ubo resultado del id de la auditoria ingresada";
			}
			
		}else{
			echo "error al ingresar auditoria global";
		}
	}//FIN DEL IF-ELSE PRINCIPAL

/***************************************************************************************************
************BLOQUE PARA GUARDAR LOS PRODUCTOS EN LA TABLA 'DETALLE'*********************************
****************************************************************************************************/
	
	$result = $link->query($query); //envia el query a la BD
	$idFactura = 0;
	if($result){
		echo "informacion ingresada en la tabla factura";
		$query_idFactura = "SELECT MAX(idFactura) as idFactura FROM Factura";
		$result = $link->query($query_idFactura); //envia el query a la BD
		if($result->num_rows == 1){
			$row = $result->fetch_assoc();
			$idFactura = $row['idFactura'];
			$tam = count($productos);
			for($i=0; $i < $tam; $i++){
				$cantidad =  $productos[$i]->{'cantidad'};
				$idProducto = $productos[$i]->{'idProducto'};
				$precioProd = $productos[$i]->{'precioP'};
				$descuentoP =  $productos[$i]->{'descuentoP'};
				$tr = $productos[$i]->{'tr'};
				$auditoriaP = $productos[$i]->{'auditoria'};
				if(empty($auditoriaP)){
					$query2 = "INSERT INTO Detalle(cantidad, idFactura, idProducto, descuentoP, tr, precioP) VALUES ($cantidad, $idFactura, '$idProducto', $descuentoP, $tr, $precioProd)";
				}else{
					$queryAud = "INSERT INTO Auditorias(justificacion) VALUES ('$auditoriaP')";
					$resultAud = $link->query($queryAud); //envia el query a la BD
					if($resultAud){
						$queryAud = "SELECT MAX(idAuditoria) as idAuditoria FROM Auditorias";
						$resultAud = $link->query($queryAud); //envia el query a la BD
						if($resultAud->num_rows == 1){
							$row = $resultAud->fetch_assoc();
							$idAuditoria = $row['idAuditoria'];
							$query2 = "INSERT INTO Detalle(cantidad, idFactura, idProducto, descuentoP, tr, precioP, Auditorias_idAuditoria) VALUES ($cantidad, $idFactura, '$idProducto', $descuentoP, $tr, $precioProd, $idAuditoria)";
						}else{
							echo "error al obtener el id de la auditoria ingresada";
						}
					}
				}

				
				
				$result = $link->query($query2); //envia el query a la BD
				if($result){
					echo "datos entregados a detalles";
				}else{
					echo "fallo: ".$query2;
				}
			} 				
		}else{
			echo "Error al encontrar el id de la factura";
		} 
	}
	else if(!$result){
		echo 'Error al insertar en la BD: ';
		echo ' query: '.$query;
	}
	$efect = 'EFECTIVO';
	$tarj = 'TARJETA';
	$cred = 'CREDITO';
	$mix = 'MIXTO';
	if($tipoPago == $efect || $tipoPago == $tarj || $tipoPago == $cred){
		$query = "INSERT INTO Metodo_pago_Factura(idMetodo_pago, idFactura, valor) VALUES ( (SELECT idMetodo_pago FROM Metodo_Pago WHERE metodoP = '$tipoPago'), $idFactura, $entrega)";
		$result = $link->query($query);
		if($result){
			echo "metodo de pago insertado satisfactoriamente!!!";
		}else{
			echo "error al insertar metodo de pago1".$query;
		}
	}else if($tipoPago == $mix){
		$query1= "INSERT INTO Metodo_pago_Factura(idMetodo_pago, idFactura, valor) VALUES ( (SELECT idMetodo_pago FROM Metodo_Pago WHERE metodoP = '$efect'), $idFactura, $val2)";
		$result = $link->query($query1);
		if($result){
			echo "metodo de pago MIXTO efect insertado satisfactoriamente!!!";
		}else{
			echo "error al insertar metodo de pago mixto1".$query2;
		}
		$query2 = "INSERT INTO Metodo_pago_Factura(idMetodo_pago, idFactura, valor) VALUES ( (SELECT idMetodo_pago FROM Metodo_Pago WHERE metodoP = '$tarj'), $idFactura, $val1)";
		$result = $link->query($query2);
		if($result){
			echo "metodo de pago MIXTO tarj insertado satisfactoriamente!!!";
		}else{
			echo "error al insertar metodo de pago mixto2".$query2;
		}
	}
	$link->close();		
	//echo json_encode($result);	
	
}

function imprimirFactura($pedido, $fecha, $tipoPago, $entrega, $cambio, $vrTarjeta, $vrEfectivo, $tipoReporte){
	$resolucion = "";
	$desde ="";
	$hasta = "";
	$regimen = "";
	$nombreEmpresa = "";
	$nitEmpresa = "";
	$direccion = "";
	$subnombre = "";
	$mensaje = "";
	$slogan = "";
	$query = "SELECT * FROM Negocio";
	$link = conectar(); //llama a la funcion conectar de conex.php
	$result = $link->query($query); //envia el query a la BD
	while($row = mysqli_fetch_array($result)){
		$resolucion =  $row['resolucion'];
		$desde =  $row['desde'];
		$hasta =  $row['hasta'];
		$regimen =  $row['regimen'];
		$nombreEmpresa =  $row['nombre'];
		$nitEmpresa =  $row['nit'];
		$direccion =  $row['direccion'];
		$subnombre =  $row['subnombre'];
		$mensaje =  $row['mensaje'];
		$slogan =  $row['slogan'];
	}
	$link->close();
	//echo "reporte: ".$tipoReporte;

/*	$datos = array("tipoReporte" => $tipoReporte, 'resolucion'=> $resolucion, 'desde'=> $desde, 'hasta'=> $hasta, 'regimen'=> $regimen, 'nombreEmp'=> $nombreEmpresa, 'nitEmp'=> $nitEmpresa, 'direccionEmp'=> $direccion, 'subNombre'=> $subnombre, 'mensaje'=> $mensaje, 'slogan'=> $slogan, 'tipoPago'=> $tipoPago, 'entrega'=> $entrega, 'cambio'=> $cambio, 'vrTarjeta'=> $vrTarjeta, 'vrEfectivo'=> $vrEfectivo, 'fecha'=> $fecha, 'pedido'=> $pedido);
	*/
	$c = preg_replace('/#/', 'N°', $direccion);
	$datos = array("tipoReporte" => $tipoReporte, 'resolucion'=> $resolucion, 'desde'=> $desde, 'hasta'=> $hasta, 'regimen'=> $regimen, 'nombreEmp'=> $nombreEmpresa, 'nitEmp'=> $nitEmpresa, 'direccionEmp'=> $c, 'subNombre'=> $subnombre, 'mensaje'=> $mensaje, 'slogan'=> $slogan, 'tipoPago'=> $tipoPago, 'entrega'=> $entrega, 'cambio'=> $cambio, 'vrTarjeta'=> $vrTarjeta, 'vrEfectivo'=> $vrEfectivo, 'fecha'=> $fecha, 'pedido'=> $pedido);
	//echo $c;
	$json = json_encode($datos);
	header("Location: factura_caja.php?facturaJson=$json");
	//$.post( "tst.php", $facturaJson );
	//echo "hora pedido: ".$pedido->{'horaPedido'};
}

function obtenerMetodos_de_pago(){
	$activo = true;
	$query = "SELECT * FROM Metodo_pago WHERE activo=$activo";
	$link = conectar(); //llama a la funcion conectar de conex.php
	$result = $link->query($query); //envia el query a la BD		
	$i = 0;
	$arrayData = array();//creo un array para almacenar los datos de la consulta 
	while($row = mysqli_fetch_array($result)){
		$metodos = array("idMetodo_pago"=>$row['idMetodo_pago'], "metodoP"=>$row['metodoP']);
		$arrayData[$i] = $metodos;
		$i++;
	}
	$link->close();
	echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
}

//RETORNA EL ACOMULADO DE VENTAS DEL DÍA
function acomulado($fecha){
	//CONSULTO LAS VENTAS
	$queryVentas = "SELECT  SUM( (Detalle.cantidad * Detalle.precioP) - ((Detalle.descuentoP * Detalle.precioP)/100)) as ventas FROM Detalle, Factura WHERE Factura.fechaF = '$fecha' AND Detalle.idFactura = Factura.idFactura AND Factura.cuadre = 0";
	$link = conectar(); //llama a la funcion conectar de conex.php
	$resultVentas = $link->query($queryVentas); //envia el query a la BD		
	$ventas = 0;
	while($row = mysqli_fetch_array($resultVentas)){
		$ventas += $row['ventas']; 
	}
	//CONSULTO LAS PROPINAS
	$queryPropina = "SELECT SUM(Factura.propina) as propinas FROM Factura WHERE Factura.fechaF = '$fecha' AND Factura.cuadre = 0";
	$resultPropinas = $link->query($queryPropina); //envia el query a la BD
	while($row = mysqli_fetch_array($resultPropinas)){
		$ventas += $row['propinas']; 
	}
	//CONSULTO LOS DESCUENTOS GLOBALES
	$queryDescuentosF = "SELECT SUM(Factura.descuentoF) as descuentos FROM Factura WHERE Factura.fechaF = '$fecha' AND Factura.cuadre = 0";
	$resultDescuentos = $link->query($queryDescuentosF); //envia el query a la BD
	while($row = mysqli_fetch_array($resultDescuentos)){
		$ventas -= $row['descuentos']; 
	}
	$link->close();
	$array = array("ventas"=> $ventas);
	echo json_encode($array);//imprimo un JSON con los datos de la consulta
}

function buscarFactura_X_numero($numFactura){
	//QUERY PARA LA INFO BASICA
	$query = "SELECT Factura.consecFactura, Factura.fechaF, Factura.horaF, Factura.propina, Factura.mesero, Factura.mesa,
				Factura.descuentoF, Factura.nombreCompleto, Factura.telefonoC, Factura.direccionC, Factura.empresa, Factura.entrega,
				Factura.devuelta, Usuarios.user FROM Factura, Usuarios WHERE 
				Factura.consecFactura = $numFactura AND Factura.idusuario = Usuarios.idUsuario ";
	$factura = array('infoFactura'=>'', 'metodosPago'=>'', 'productos'=>'');//VARIABLE QUE ALMACENARÁ TODA LA INFO DE LA FACTURA BUSCADA
	$i = 0;
	$link = conectar(); //llama a la funcion conectar de conex.php
	$result = $link->query($query); //envia el query a la BD
	$cajero = "";
	if($result->num_rows == 1){
		$row = $result->fetch_assoc();
		$infoFactura = array('numFactura'=> $row['consecFactura'], 'fechaF'=> $row['fechaF'], 'horaF'=> $row['horaF'], 'propina'=> $row['propina'], 'mesero'=> $row['mesero'], 'mesa'=> $row['mesa'], 'descuentoF'=> $row['descuentoF'], 'nombreCompleto'=> $row['nombreCompleto'], 'telefonoC'=> $row['telefonoC'], 'direccionC'=> $row['direccionC'], 'empresa'=> $row['empresa'], 'entrega'=> $row['entrega'], 'devuelta'=> $row['devuelta'], 'cajero'=> $row['user']);
		$cajero = $row['user'];
		$factura['infoFactura'] = $infoFactura;
		//$factura[$i] = $infoFactura;
		++$i;

	}
//QUERY PARA CONSULTAR LOS METODOS DE PAGO
	$query2 = "SELECT Metodo_pago.metodoP, Metodo_pago_Factura.valor FROM Metodo_pago, metodo_pago_factura, Factura 
				WHERE Metodo_pago_Factura.idFactura = Factura.idFactura AND Factura.consecFactura =  $numFactura AND 
				Metodo_pago_Factura.idMetodo_pago = Metodo_pago.idMetodo_pago";
	$result2 = $link->query($query2);
	$metodoPago = array();
	$j = 0;
	while($row = mysqli_fetch_array($result2)){		
		$metodo = array('metodo'=>$row['metodoP'], 'valor'=>$row['valor']);
		$metodoPago[$j] = $metodo;
		++$j;
	}
	$factura['metodosPago'] = $metodoPago;
	//$factura[$i] = $metodoPago;
	++$i;
//QUERY PARA CONSULTAR LOS PRODUCTOS DE LA FACTURA
	$query3 = "SELECT Detalle.cantidad, Detalle.descuentoP, Detalle.precioP, Productos.nombreP, Detalle.tr FROM Detalle, Factura, Productos
				WHERE Factura.consecFactura = $numFactura AND Factura.idFactura = Detalle.idFactura AND Productos.idProducto = Detalle.idProducto";
	$result3 = $link->query($query3);
	$productos = array();
	$j = 0;
	while($row = mysqli_fetch_array($result3)){
		$gusto = array();
		$prod = array('cantidad'=>$row['cantidad'], 'descuentoP'=>$row['descuentoP'], 'precioP'=>$row['precioP'], 'nombreP'=>$row['nombreP'], 'tr'=>$row['tr'], 'gustos'=>$gusto, 'usuario'=>$cajero);
		$productos[$j] = $prod;
		++$j;
	}
	$factura['productos'] = $productos;
	//$factura[$i] = $productos;
	$link->close();
	//$array = array("factura"=> $factura);
	echo json_encode($factura);//imprimo un JSON con los datos de la consulta


}

//10-12-2017 METODO QUE MODIFICA LA INFORMACION BASICA DE UNA FACTURA EN LA BD
//valor1: efectivo o tarjeta si no es mixto, valor2: tarjeta en mixto
function actualizarInfo_factura($infoFactura, $pagoAnterior, $pagoActual, $valor1, $valor2, $devuelta, $propina){
	$nombre = $infoFactura->{'nombre'};
	$telefono = $infoFactura->{'telefono'};
	$direccion = $infoFactura->{'direccion'};
	$empresa = $infoFactura->{'empresa'};
	$entrega = $infoFactura->{'entrega'};
	$devuelta = $infoFactura->{'devuelta'};
	$consecFactura = $infoFactura->{'consecFactura'};
	$link = conectar(); //llama a la funcion conectar de conex.php
	$query1 = "UPDATE Factura SET nombreCompleto = '$nombre', telefonoC = '$telefono', direccionC = '$direccion', empresa = '$empresa', entrega = $entrega, devuelta = $devuelta, propina = $propina WHERE consecFactura = $consecFactura";
	$result = $link->query($query1);
		if($result){
			echo "se actualizo la tabla factura satisfactoriamente!!!!";
			$mix = 'MIXTO';
			$bandera = false;
			if($pagoAnterior == $mix){
				$queryDelete = "DELETE FROM Metodo_pago_Factura WHERE idMetodo_pago = (SELECT idMetodo_pago FROM Metodo_pago WHERE metodoP = 'EFECTIVO') AND idFactura = (SELECT idFactura FROM Factura WHERE consecFactura = $consecFactura)";
				$resultDelete = $link->query($queryDelete);
				if($resultDelete){
					$queryDelete = "DELETE FROM Metodo_pago_Factura WHERE idMetodo_pago = (SELECT idMetodo_pago FROM Metodo_pago WHERE metodoP = 'TARJETA') AND idFactura = (SELECT idFactura FROM Factura WHERE consecFactura = $consecFactura)";
					$resultDelete = $link->query($queryDelete);
				if($resultDelete){
					$bandera = true;
				}
				}else{
					echo "error al eliminar en metodo_pago_factura";
				}
			}else{
				$queryDelete = "DELETE FROM Metodo_pago_Factura WHERE idMetodo_pago = (SELECT idMetodo_pago FROM Metodo_pago WHERE metodoP = '$pagoAnterior') AND idFactura = (SELECT idFactura FROM Factura WHERE consecFactura = $consecFactura)";
				$resultDelete = $link->query($queryDelete);
				if($resultDelete){
					$bandera = true;
				}else{
					echo "error al eliminar metodo pago no mixto";
				}
			}
//INSERTA SI LA BANDERA ESTÁ ENCENDIDA

			if($bandera){
				if($pagoActual == $mix){
				$query1 = "INSERT INTO Metodo_pago_Factura(idMetodo_pago, idFactura, valor) VALUES( (SELECT idMetodo_pago FROM Metodo_pago WHERE metodoP = 'EFECTIVO'), (SELECT idFactura FROM Factura WHERE consecFactura = $consecFactura), $valor1 )";
				$result1 = $link->query($query1);
				if($result1){
					echo "inserttó mixto1 satisfactoriamente!!!";
					$query2 = "INSERT INTO Metodo_pago_Factura(idMetodo_pago, idFactura, valor) VALUES( (SELECT idMetodo_pago FROM Metodo_pago WHERE metodoP = 'TARJETA'), (SELECT idFactura FROM Factura WHERE consecFactura = $consecFactura), $valor2 )";
					$result2 = $link->query($query2);
					if($result2){
						echo "insertó satisfactoriamente mixto2";
					}else{
						echo "error al insertar mixto2";
					}
				}else{
					echo "error al insertar mixto1";
				}
				}else{
				$query1 = "INSERT INTO Metodo_pago_Factura(idMetodo_pago, idFactura, valor) VALUES( (SELECT idMetodo_pago FROM Metodo_pago WHERE metodoP = '$pagoActual'), (SELECT idFactura FROM Factura WHERE consecFactura = $consecFactura), $valor1 )";
				$result1 = $link->query($query1);
				if($result1){
					echo "insertó metodo pago satisfactoriamente!!!";
				}else{
					echo "error al insertar metodo pago";
				}
				}
			}
			

}else{
	echo "no se pudo actualizar factura".$query1;
}
$link->close();
}

//METODO PARA BUSCAR FACTURAS POR FECHA O CLIENTE(nombre del cliente o telefono)
//ARGUMENTOS: dato: nombre, telefono o fecha.  BuscarPor: cliente o fecha
function buscarFac_X_dato($dato, $buscarPor){
	$cliente = "cliente";
	$fecha = "fecha";
	$query = "";
	$facturas = array();
	if($buscarPor == $cliente){
		$query = "SELECT consecFactura, fechaF, nombreCompleto, telefonoC, (entrega - devuelta) as total FROM Factura WHERE nombreCompleto LIKE '%$dato%' OR 
					telefonoC LIKE '%$dato%'"; 
	}else if($buscarPor == $fecha){
		$query = "SELECT consecFactura, fechaF, nombreCompleto, telefonoC, (entrega - devuelta) as total FROM Factura WHERE fechaF >= '$dato[0]' AND fechaF <= '$dato[1]'";
	}
	$link = conectar(); //llama a la funcion conectar de conex.php
	$result = $link->query($query); //envia el query a la BD
	$i = 0;
	while($row = mysqli_fetch_array($result)){
		$fact = array('numFactura'=>$row['consecFactura'], 'fecha'=>$row['fechaF'], 'cliente'=>$row['nombreCompleto'], 'telefono'=>$row['telefonoC'], 'total'=>$row['total']);
		$facturas[$i] = $fact;
		++$i;
	}
	$link->close();
	//$array = array("factura"=> $factura);
	echo json_encode($facturas);//imprimo un JSON con los datos de la consulta

}


/*
			if($pagoActual != $mix){
				$query2 = "UPDATE Metodo_pago_Factura SET idMetodo_pago = (SELECT idMetodo_pago FROM Metodo_pago WHERE metodoP = '$pagoActual'),
						valor = $valor1 WHERE idMetodo_pago = (SELECT idMetodo_pago FROM Metodo_pago WHERE metodoP = '$pagoAnterior') AND 
						idFactura = (SELECT idFactura FROM Factura WHERE consecFactura = $consecFactura)";	
				$result2 = $link->query($query2);
				if($result2){
					echo "Se actualizó el metodo de pago satisfactoriamente!!!";
				}else{
					echo "error al actualizar el metodo de pago";
				}		
			}else{
				$query2 = "UPDATE Metodo_pago_Factura SET idMetodo_pago = (SELECT idMetodo_pago FROM Metodo_pago WHERE metodoP = '$pagoActual'),
						valor = $valor1 WHERE idMetodo_pago = (SELECT idMetodo_pago FROM Metodo_pago WHERE metodoP = '$pagoAnterior') AND 
						idFactura = (SELECT idFactura FROM Factura WHERE consecFactura = $consecFactura)";	
				$result2 = $link->query($query2);
				if($result2){
					echo "Se actualizó el metodo de pago satisfactoriamente!!!";
				}else{
					echo "error al actualizar el metodo de pago";
				}
			}	
			
			
		}else{
			echo "error al actualizar la tabla factura".$query;
		}
		*/



?>