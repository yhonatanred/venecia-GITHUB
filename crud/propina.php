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

//ACCIONES
$verXrango = "verXrango";

if($accion == $verXrango){
	$fecha1 = $datos->{'fecha1'};
	$fecha2 = $datos->{'fecha2'};
	verPropinaXrango($fecha1, $fecha2);
}

//VER PROPINA POR RANGO DE FECHA
function verPropinaXrango($fecha1, $fecha2){
	$query = "SELECT fechaF, SUM(propina) as propina FROM Factura WHERE fechaF >= '$fecha1' AND fechaF <= '$fecha2' GROUP BY fechaF";
	$propinas = array();
	$link = conectar(); //llama a la funcion conectar de conex.php
	$result = $link->query($query); //envia el query a la BD
	$i=0;
	while($row = mysqli_fetch_array($result)){
		$array = array('fechaF' => $row['fechaF'], 'propina'=> $row['propina']);
		$propinas[$i] = $array;
		++$i;
	}
	$link->close();
	echo json_encode($propinas);
}
?>