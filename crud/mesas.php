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
	$accion = $datos->{'opcion'};

	//VARIABLES QUE REPRESENTAN ACCIONES
	$crear = 'crear';
	$leer = 'leer';
	$leerid = 'leerid';
	$actualizar = 'actualizar';
	$eliminar = 'eliminar';

//EVALUA EL TIPO DE ACCION A REALIZAR
	if($accion==$crear)
	{
		$identificador = $datos->{'mesa'}->{'identificador'};
        nuevaMesa($identificador);	
	}
	else if($accion==$leer)
	{
		listarMesas();
	}
	else if($accion==$leerid)
	{
		$idMesa = $datos->{'idMesa'};
		listarMesaId($idMesa);
	}
	else if($accion==$actualizar)
	{
		$identificador = $datos->{'mesa'}->{'identificador'};
		$idMesa = $datos->{'mesa'}->{'idMesa'};
		actualizarMesa($idMesa,$identificador);
	}
	else if($accion==$eliminar)
	{
		$idMesa = $datos->{'idMesa'};
		desactivarMesa($idMesa);
	}

	//CRUD DE Mesas

	//crear Mesa
	function nuevaMesa($identificador){
		$activa = true;
		$query = "INSERT INTO mesas(identificador, activa) VALUES('$identificador', '$activa')";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		$link->close();		
		echo json_encode($result);	
	}
	
	//listar Mesas
	function listarMesas(){
		$activa = true;
		$query = "SELECT * FROM mesas WHERE activa='$activa'";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = $resultdb->fetch_assoc()){
			$arrayData[] = $row;
		}
		$link->close();//cierro conex
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

	//listar Mesas por id
	function listarMesaId($id){
		$activa = true;
		$query = "SELECT * FROM mesas WHERE idMesa='$id' and activa='$activa'";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		if ($resultdb->num_rows == 1) {
			$mesa = $resultdb->fetch_assoc();
		}
		$link->close();//cierro conex
		echo json_encode($mesa);//imprimo un JSON con los datos de la consulta
	}

	//actualizar mesa por id
	function actualizarMesa($id,$identificador){
		$activa = true;
		$query = "UPDATE mesas set identificador = '$identificador' where idMesa=$id AND activa = $activa";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$link->close();
		echo json_encode($result);
	}

	//desactivar Mesa
	function desactivarMesa($id){
		$activa = 0;
		$query = "UPDATE mesas SET activa = $activa WHERE idMesa=$id";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		$link->close();		
		echo json_encode($result);	
	}

?>