<?php

		// Configuración de cabeceras
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-xsrf-token");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include "conex.php";

		
//variables que reciben como parametro un json y luego lo decodifican para extraer la informacion
	$json = $_REQUEST['gustosJson'];
	$datos = json_decode($json);
	$accion = $datos->{'accion'};

	//VARIABLES QUE REPRESENTAN ACCIONES
	$crear = 'crear';
	$leer = 'leer';
	$actualizar = 'actualizar';
	$eliminar = 'eliminar';
	$buscar = 'buscar';
	$buscarXprod = 'buscarXprod';

	if($accion==$leer){
		leerGustos();
	}else if($accion==$buscar){
		$idCateg = $datos->{'idCateg'};
		buscarGustos($idCateg);
	}else if($accion==$crear){
		$gusto = $datos->{'gusto'}->{'gusto'};
		$idCategoria = $datos->{'gusto'}->{'categoria'};
		crearGusto($gusto, $idCategoria);
	}else if($accion==$eliminar){
		$idGusto = $datos->{'idGusto'};
		eliminarGusto($idGusto);
	}else if($accion==$actualizar){
		$idGusto = $datos->{'idGusto'};
		$gusto = $datos->{'gusto'};
		actualizarGusto($idGusto, $gusto);
	}else if($accion==$buscarXprod){
		$idProducto = $datos->{'idProducto'};
		buscarGustosXproducto($idProducto);
	}


	function leerGustos(){
		$query = "SELECT * FROM Gustos  ORDER BY gusto ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$gusto = array("id"=>$row['idGusto'], "gusto"=>$row['gusto'], "idCategoria"=>$row['idCategoria']);
			$arrayData[$i] = $gusto;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}


//BUSCA GUSTOS POR CATEGORIAS
	function buscarGustos($idCateg){
		$query = "SELECT * FROM Gustos WHERE idCategoria = $idCateg ORDER BY gusto ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$gusto = array("id"=>$row['idGusto'], "gusto"=>$row['gusto'], "idCategoria"=>$row['idCategoria']);
			$arrayData[$i] = $gusto;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

//BUSCA GUSTOS POR PRODUCTOS
	function buscarGustosXproducto($idProducto){
		$query = "SELECT Gustos.idGusto, Gustos.gusto FROM Gustos_Productos, Gustos WHERE Gustos_Productos.idProducto = '$idProducto' AND Gustos_Productos.idGusto = Gustos.idGusto ORDER BY idGusto";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$gusto = array("id"=>$row['idGusto'], "gusto"=>$row['gusto']);
			$arrayData[$i] = $gusto;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

//CREA UN GUSTO NUEVO
	function crearGusto($gusto, $idCategoria){
		$query = "INSERT INTO Gustos(gusto, idCategoria) VALUES('$gusto', $idCategoria)";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		if($result){
			echo "Se almacenó un nuevo gusto en la BD";
		}else{
			echo "error al crear un nuevo gusto";
		}
		$link->close();
			
	}

	//ELIMINA UN GUSTO DE LA BD
	function eliminarGusto($idGusto){
		$query = "DELETE FROM Gustos WHERE idGusto=$idGusto";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		if($result){
			echo "Se eliminó un gusto de la BD";
		}else{
			echo "error al eliminar el gusto";
		}
		$link->close();
	}

	//ACTUALIZA UN GUSTO EN LA BD
	function actualizarGusto($idGusto, $gusto){
		$query = "UPDATE Gustos SET gusto='$gusto' WHERE idGusto=$idGusto";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		if($result){
			echo "Se actualizó un gusto de la BD";
		}else{
			echo "error al actualizar el gusto";
		}
		$link->close();
	}



?>
