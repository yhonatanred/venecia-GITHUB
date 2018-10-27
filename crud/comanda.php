<?php
		// Configuración de cabeceras
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-xsrf-token");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include "conex.php";

		
//variables que reciben como parametro un json y luego lo decodifican para extraer la informacion
	$json = $_REQUEST['comandaJson'];
	$datos = json_decode($json);
	$accion = $datos->{'accion'};

	//VARIABLES QUE REPRESENTAN ACCIONES
	$crear = 'crear';
	$leer = 'leer';
	$actualizar = 'actualizar';
	$eliminar = 'eliminar';
	$buscar = 'buscar';

	if($accion==$leer){
		verComandas();
	}else if($accion==$crear){
		$nombre= $datos{'nombre'};
		nuevaComanda($nombre);

	}


//CRUD DE COMANDA

	//crear
	function nuevaComanda($nombre){
		//agrega un nuevo producto a la BD
		$activo = true;
		$query = "INSERT INTO Comandas(nombreComanda) VALUES('$nombre')";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		if($result){
			echo 'Nueva comanda';
		}
		else if(!$result){
			echo 'Error al insertar una comanda en la BD';
		}

		$link->close();		
	}

	function verComandas(){
		//agrega un nuevo producto a la BD
		$query = "SELECT * FROM Comandas";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$comandas = array("id"=>$row['idComanda'], "nombre"=>$row['nombreComanda']);
			$arrayData[$i] = $comandas;
			$i++;
		}

		$link->close();
		echo json_encode($arrayData);
	}
	
?>