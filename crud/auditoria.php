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

$descuentoGlobal = 'descuentoGlobal';
$descuentosProd = 'descuentosProductos';
$guardarBorrado = 'guardarBorrado';
$obtEnviadosB = 'obtenerEnviadosBorrados';
$obtNoEnviadosB = 'obtenerNoEnviadosBorrados';

if($accion == $descuentoGlobal){
	$fecha1 = $datos->{'fecha1'};
	$fecha2 = $datos->{'fecha2'};
	descuentosGlobales($fecha1, $fecha2);
}else if($accion == $descuentosProd){
	$fecha1 = $datos->{'fecha1'};
	$fecha2 = $datos->{'fecha2'};
	descuentosProductos($fecha1, $fecha2);
}else if($accion == $guardarBorrado){
	$producto = $datos->{'producto'};
	$fecha = $datos->{'fecha'};
	$hora = $datos->{'hora'};
	$justificacion = $datos->{'justificacion'};
	guardarBorrados($producto, $fecha, $hora, $justificacion);
}else if($accion == $obtEnviadosB){
	$fecha1 = $datos->{'fecha1'};
	$fecha2 = $datos->{'fecha2'};
	obtenerEnviados_borrados($fecha1, $fecha2);
}else if($accion == $obtNoEnviadosB){
	$fecha1 = $datos->{'fecha1'};
	$fecha2 = $datos->{'fecha2'};
	obtenerNoEnviados_borrados($fecha1, $fecha2);
}
	
	//FUNCION QUE ME RETORNA LAS FACTURAS CON DESCUENTOS GLOBALES
	function descuentosGlobales($fecha1, $fecha2){
		$query = "SELECT Factura.consecFactura, Factura.fechaF, Factura.nombreCompleto, Factura.descuentoF, (Factura.entrega - Factura.devuelta) as total, 
				Auditorias.justificacion FROM Factura, Auditorias WHERE Factura.fechaf >= '$fecha1' AND Factura.fechaf <= '$fecha2'   AND Factura.Auditorias_idAuditoria = Auditorias.idAuditoria
				AND Factura.descuentoF > 0";
		$descuentosG = array();
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		$i=0;
		while($row = mysqli_fetch_array($result)){
			$array = array('consecFactura'=>$row['consecFactura'], 'fechaF'=>$row['fechaF'], 'nombreCompleto'=>$row['nombreCompleto'], 'descuento'=>$row['descuentoF'], 'total'=>$row['total'], 'justificacion'=>$row['justificacion']);
			$descuentosG[$i] = $array;
			++$i;
		}
		$link->close();
		echo json_encode($descuentosG);
	}

//FUNCION QUE ME RETORNA LOS PRODUCTOS CON DESCUENTOS
	function descuentosProductos($fecha1, $fecha2){
		$query = "SELECT Detalle.tr, Factura.consecFactura, Factura.fechaF, Factura.nombreCompleto, (((Detalle.descuentoP*Detalle.precioP)/100) * Detalle.cantidad) as descuentoP,  Detalle.precioP,  Auditorias.justificacion, Detalle.cantidad FROM Factura, Auditorias, Detalle WHERE Factura.fechaf >= '$fecha1' AND
			 Factura.fechaf <= '$fecha2' AND Detalle.Auditorias_idAuditoria = Auditorias.idAuditoria AND Detalle.descuentoP > 0
			  AND Factura.idFactura = Detalle.idFactura";
		$descuentosP = array();
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		$i=0;
		while($row = mysqli_fetch_array($result)){
			$total = ($row['precioP'] * $row['cantidad']) - $row['descuentoP'];
			$array = array('tr'=>$row['tr'],'consecFactura'=>$row['consecFactura'], 'fechaF'=>$row['fechaF'], 'nombreCompleto'=>$row['nombreCompleto'], 'descuento'=>$row['descuentoP'], 'justificacion'=>$row['justificacion'], 'precioP'=>$row['precioP'], 'total'=>$total);
			$descuentosP[$i] = $array;
			++$i;
		}

//BLOQUE PARA OBTENER LOS PRODUCTOS QUE FUERON CAMBIADOS DE PRECIOS
		$query2 = "SELECT Detalle.tr, Factura.consecFactura, Factura.fechaF, Factura.nombreCompleto, ((Detalle.descuentoP*Detalle.precioP)/100) as descuentoP,  Detalle.precioP, Productos.precioP as valorU,  Auditorias.justificacion, Detalle.cantidad FROM Factura, Auditorias, Detalle, Productos 
			WHERE Factura.fechaf >= '$fecha1' AND Factura.fechaf <= '$fecha2' AND Detalle.Auditorias_idAuditoria = Auditorias.idAuditoria 
			AND Detalle.precioP != Productos.precioP AND Detalle.idProducto = Productos.idProducto AND Factura.idFactura = Detalle.idFactura";
		$result2 = $link->query($query2); //envia el query a la BD
		while($row = mysqli_fetch_array($result2)){
			$total = ($row['precioP'] * $row['cantidad']) - $row['descuentoP'];
			$array = array('tr'=>$row['tr'],'consecFactura'=>$row['consecFactura'], 'fechaF'=>$row['fechaF'], 'nombreCompleto'=>$row['nombreCompleto'], 'descuento'=>$row['descuentoP'], 'justificacion'=>$row['justificacion'], 'precioP'=>$row['valorU'], 'total'=>$total);
			$descuentosP[$i] = $array;
			++$i;
		}
		$link->close();
		echo json_encode($descuentosP);
	}

//FUNCION QUE ME OBTIENE LOS PRODUCTOS QUE FUERON ENVIADOS A COMANDA Y LUEGO FUERON BORRADOS
	function obtenerEnviados_borrados($fecha1, $fecha2){
		$query = "SELECT Borrados.tr, Borrados.fecha, Productos.nombreP, Borrados.precioP, Borrados.hora, Auditorias.justificacion
				 FROM Borrados, Auditorias, Productos WHERE Borrados.fecha >= '$fecha1' AND Borrados.fecha <= '$fecha2' 
				 AND Borrados.idProducto = Productos.idProducto AND Borrados.idAuditoria = Auditorias.idAuditoria AND Borrados.enviado = 1";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		$borrados = array();
		$i = 0;
		while($row = mysqli_fetch_array($result)){
			$productos = array('tr'=>$row['tr'], 'fecha'=>$row['fecha'], 'nombreP'=>$row['nombreP'], 'precioP'=>$row['precioP'], 'hora'=>$row['hora'], 'justificacion'=>$row['justificacion']);
			$borrados[$i] = $productos;
			++$i;
		}
		$link->close();
		echo json_encode($borrados);

	}

	//FUNCION QUE ME OBTIENE LOS PRODUCTOS BORRADOS QUE NO FUERON ENVIADOS A COMANDAS
	function obtenerNoEnviados_borrados($fecha1, $fecha2){
		$query = "SELECT Borrados.tr, Borrados.fecha, Productos.nombreP, Borrados.precioP, Borrados.hora
				 FROM Borrados, Productos WHERE Borrados.fecha >= '$fecha1' AND Borrados.fecha <= '$fecha2' 
				 AND Borrados.idProducto = Productos.idProducto AND Borrados.enviado = 0";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		$borrados = array();
		$i = 0;
		while($row = mysqli_fetch_array($result)){
			$productos = array('tr'=>$row['tr'], 'fecha'=>$row['fecha'], 'nombreP'=>$row['nombreP'], 'precioP'=>$row['precioP'], 'hora'=>$row['hora']);
			$borrados[$i] = $productos;
			++$i;
		}
		$link->close();
		echo json_encode($borrados);
	}

	//FUNCION QUE ME GUARDA LOS PRODUCTOS QUE HAN SIDO BORRADOS
	function guardarBorrados($producto, $fecha, $hora, $justificacion){
		$link = conectar(); //llama a la funcion conectar de conex.php
		$enviado = $producto->{'enviado'};
		if($enviado){
			$queryAud = "INSERT INTO Auditorias(justificacion) VALUES('$justificacion')";			
			$result = $link->query($queryAud);
			if($result){

				$queryAud = "SELECT MAX(idAuditoria) as idAuditoria FROM Auditorias";
				$result = $link->query($queryAud);
				if($result->num_rows == 1){
					$row = $result->fetch_assoc();
					$idAuditoria = $row['idAuditoria'];

					$cantidad = $producto->{'cantidad'};
					$descuentoP = $producto->{'descuentoP'};
					$tr = $producto->{'tr'};
					$precioP = $producto->{'precioP'};				
					$idProducto = $producto->{'idProducto'};
					$query = "INSERT INTO Borrados(cantidad, descuentoP, tr, precioP, enviado, fecha, hora, idAuditoria, idProducto) VALUES($cantidad, $descuentoP, $tr, $precioP, $enviado, '$fecha', '$hora', $idAuditoria, '$idProducto')";
					$resultB = $link->query($query);
					if(!$resultB){
						echo "ERROR al insertar en borrados BD";
						echo "enviado --> ".$query;
					}else{
						echo "borrado inserado!!!";
					}
					
				}

			
		}else{
			echo "error al insertar la auditoria";
		}
		}else{
				$cantidad = $producto->{'cantidad'};
				$descuentoP = $producto->{'descuentoP'};
				$tr = $producto->{'tr'};
				$precioP = $producto->{'precioP'};				
				$idProducto = $producto->{'idProducto'};
				$enviado = 0;
				$query = "INSERT INTO Borrados(cantidad, descuentoP, tr, precioP, enviado, fecha, hora, idProducto) VALUES($cantidad, $descuentoP, $tr, $precioP, $enviado, '$fecha', '$hora', '$idProducto')";
				$resultB = $link->query($query);
				if(!$resultB){
					echo "ERROR al insertar en borrados BD";
					echo "enviado --> ".$query;
				}else{
					echo "borrado inserado!!!";
				}
			}

		$link->close();

	}


?>