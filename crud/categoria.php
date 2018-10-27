<?php

// Configuración de cabeceras
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-xsrf-token");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include "conex.php";

		
//variables que reciben como parametro un json y luego lo decodifican para extraer la informacion
	$json = $_REQUEST['productJson'];
	$datos = json_decode($json);
	$accion = $datos->{'accion'};

	//VARIABLES QUE REPRESENTAN ACCIONES
	$crear = 'crear';
	$leer = 'leer';
	$actualizar = 'actualizar';
	$eliminar = 'eliminar';
	$buscar = 'buscar';

//EVALUA EL TIPO DE ACCION A REALIZAR
	if($accion==$crear){
		$nombre = $datos->{'nombre'};
		 nuevaCategoria($nombre);	
	}else if($accion==$leer){
		leerCategorias();
	}else if($accion==$actualizar){
		$nombreAct = $datos->{'id'};
		$nombreNuev = $datos->{'nombreNuev'};
		actualizarCategoria($nombreAct, $nombreNuev);
	}else if($accion==$eliminar){
		$id = $datos->{'id'};
		$desactivar = $datos->{'desactivar'};
		if($desactivar){
			desactivarCategoria($id);
		}else{
			$idCategoria = $datos->{'id'};
			eliminarCategoria($idCategoria);
		}
	}else if($accion == $buscar){
		$nombre = $datos->{'nombre'};
		 buscarCategoria($nombre);	
		}



	//CRUD DE CATEGORIAS

	//crear
	function nuevaCategoria($nombre){
		$activo = true;
		$query = "INSERT INTO Categorias(nombreCat, activo) VALUES('$nombre', $activo)";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		if($result){
			echo 'Nueva categoria creada';
		}
		else if(!$result){
			echo 'Error al insertar en la BD';
		}
		$link->close();		
	}
	
	//Leer
	function leerCategorias(){
		$activo = true;
		$query = "SELECT * FROM Categorias WHERE activo = $activo ORDER BY nombreCat ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$categoria = array("id"=>$row['idCategoria'], "nombre"=>$row['nombreCat'], "activo"=>$row['activo']);
			$arrayData[$i] = $categoria;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

	//busca una categoria
	function buscarCategoria($nombre){
		$activo = true;
		$query = "SELECT * FROM Categorias WHERE nombreCat like '%$nombre%' ORDER BY nombreCat ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$categoria = array("id"=>$row['idCategoria'], "nombre"=>$row['nombreCat'], "activo"=>$row['activo']);
			$arrayData[$i] = $categoria;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}


	//Actualizar
	function actualizarCategoria($id, $nombreNuevo){
		$activo = true;
		$query = "UPDATE Categorias SET nombreCat = '$nombreNuevo' where idCategoria=$id AND activo = $activo";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$link->close();
		//$array = array("respuesta"=>$result);
		echo json_encode($result);
	}


	//desactiva categoria
	function desactivarCategoria($idCategoria){
		$activo = 0;//false
		$query = "UPDATE Categorias SET activo = $activo WHERE idCategoria=$idCategoria";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$link->close();
		//$array = array("respuesta"=>$result);
		echo json_encode($result);
	}

	//Eliminar
	function eliminarCategoria($idCategoria){
		$query = "DELETE FROM Categorias WHERE idCategoria=$idCategoria";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$link->close();
		//$array = array("respuesta"=>$result);
		echo json_encode($result);
	}


?>