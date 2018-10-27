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
	$leerXcat = 'leerXcateg';
	$actualizar = 'actualizar';
	$eliminar = 'eliminar';
	$buscar = 'buscar';
	$buscarXcat = 'buscarXcateg';
	//yhonatn 25-10-2017
	$leerId = 'leerId';

//EVALUA EL TIPO DE ACCION A REALIZAR
	if($accion==$crear){
		$nombre = $datos->{'nombre'};
		$id = $datos->{'idCategoria'};
		$color = $datos->{'color'};
		 nuevaSubCategoria($nombre, $id, $color);		
		
	}else if($accion==$leer){
		leerSubCategorias();
	}else if($accion==$actualizar){
		$nombreAct = $datos->{'id'};
		$nombreNuev = $datos->{'nombreNuev'};
		$color = $datos->{'color'};
		actualizarSubCategoria($nombreAct, $nombreNuev, $color);
	}else if($accion==$eliminar){
		$id = $datos->{'id'};
		$desactivar = $datos->{'desactivar'};
		if($desactivar){
			desactivarSubCategoria($id);
		}else{
			eliminarSubCategoria($id);
			}		
	}else if($accion == $buscar){
		$nombre = $datos->{'nombre'};
		 buscarSubCategoria($nombre);	
	}else if($accion == $buscarXcat){
			$nombre = $datos->{'nombre'};
			$idCat = $datos->{'idCategoria'};
		 	buscarSubCategoriaXcategoria($nombre, $idCat);	
	}else if($accion == $leerXcat){
		$idCat = $datos->{'idCategoria'};
		leerSubCategoriasXcategoria($idCat);
	}//yhonatan 25-10-2017
	else if($accion == $leerId){
		$idSubcategoria = $datos->{'idSubcategoria'};
		leerSubCategoriaId($idSubcategoria);
	}




	//CRUD DE SUBCATEGORIAS

	//crear
	function nuevaSubCategoria($nombre, $idCategoria, $color){
		$activo = true;
		$query = "INSERT INTO SubCategorias(nombreSC, idCategoria, activo, color) VALUES('$nombre', $idCategoria, $activo,    '$color')";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		if($result){
			echo 'Nueva subCategoria creada';
		}
		else if(!$result){
			echo 'Error al insertar en la BD';
		}
		$link->close();		
	}
	
	//Leer
	function leerSubCategorias(){
		$activo = true;
		$query = "SELECT * FROM SubCategorias WHERE activo = $activo ORDER BY nombreSC ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$subcategoria = array("id"=>$row['idSubCategoria'], "nombre"=>$row['nombreSC'], "activo"=>$row['activo'], "color"=>$row['color']);
			$arrayData[$i] = $subcategoria;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

	//Leer
	function leerSubCategoriasXcategoria($idCategoria){
		$activo = true;
		$query = "SELECT * FROM SubCategorias WHERE activo = $activo AND idCategoria=$idCategoria ORDER BY nombreSC ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$subcategoria = array("id"=>$row['idSubCategoria'], "nombre"=>$row['nombreSC'], "activo"=>$row['activo'], "color"=>$row['color']);
			$arrayData[$i] = $subcategoria;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

	//busca una subcategoria por nombre
	function buscarSubCategoria($nombre){
		$activo = true;
		$query = "SELECT * FROM SubCategorias WHERE nombreSC like '%$nombre%' AND activo=$activo ORDER BY nombreSC ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$subcategoria = array("id"=>$row['idSubCategoria'], "nombre"=>$row['nombreSC'], "activo"=>$row['activo'], "color"=>$row['color']);
			$arrayData[$i] = $subcategoria;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

	//busca subcategorias por categoria a la cual pertenece
	function buscarSubCategoriaXcategoria($nombre, $idCat){
		$activo = true;
		$query = "SELECT * FROM SubCategorias WHERE nombreSC LIKE '%$nombre%' AND idCategoria=$idCat AND activo=$activo ORDER BY nombreSC ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$subcategoria = array("id"=>$row['idSubCategoria'], "nombre"=>$row['nombreSC'], "activo"=>$row['activo'], "color"=>$row['color']);
			$arrayData[$i] = $subcategoria;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}


	//Actualizar
	function actualizarSubCategoria($id, $nombreNuevo, $color){
		$activo = true;
		$query = "UPDATE SubCategorias SET nombreSC = '$nombreNuevo', color='$color' where idSubCategoria=$id AND
		 activo = $activo";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$link->close();
		//$array = array("respuesta"=>$result);
		echo json_encode($result);
	}


	//desactiva subcategoria
	function desactivarSubCategoria($idSubCategoria){
		$activo = 0;//false
		$query = "UPDATE SubCategorias SET activo = $activo WHERE idSubCategoria=$idSubCategoria";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$link->close();
		//$array = array("respuesta"=>$result);
		echo json_encode($result);
	}

	//Eliminar
	function eliminarSubCategoria($idSubCategoria){
		$query = "DELETE FROM SubCategorias WHERE idSubCategoria=$idSubCategoria";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$link->close();
		//$array = array("respuesta"=>$result);
		echo json_encode($result);
	}

	//yhonatan 25-10-2017
	function leerSubCategoriaId($idSubcategoria){
		$activo = true;
		$query = "SELECT * FROM SubCategorias WHERE idSubCategoria='$idSubcategoria' and activo='$activo'";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		if ($resultdb->num_rows == 1) {
			$subca = $resultdb->fetch_assoc();
		}
		$link->close();//cierro conex
		echo json_encode($subca);//imprimo un JSON con los datos de la consulta
	}


?>