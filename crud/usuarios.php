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
	$ingresar = 'ingresar';

//EVALUA EL TIPO DE ACCION A REALIZAR
	if($accion==$crear)
	{
		$nombre = $datos->{'usuario'}->{'nombre'};
		$apellido = $datos->{'usuario'}->{'apellido'};
		$user = $datos->{'usuario'}->{'user'};
		$pass = $datos->{'usuario'}->{'pass'};
		$rol = $datos->{'usuario'}->{'rol'};
		nuevoUsuario($nombre,$apellido,$user,$pass,$rol);	
	}
	else if($accion==$leer)
	{
		listarUsuarios();
	}
	else if($accion==$leerid)
	{
		$idUsuario = $datos->{'idUsuario'};
		listarUsuariosId($idUsuario);
	}
	else if($accion==$actualizar)
	{
		$nombre = $datos->{'usuario'}->{'nombre'};
		$apellido = $datos->{'usuario'}->{'apellido'};
		$user = $datos->{'usuario'}->{'user'};
		$pass = $datos->{'usuario'}->{'pass'};
		$rol = $datos->{'usuario'}->{'rol'};
		$idUsuario = $datos->{'usuario'}->{'idUsuario'};
		actualizarUsuarios($idUsuario,$nombre,$apellido,$user,$pass,$rol);
	}
	else if($accion==$eliminar)
	{
		$idUsuario = $datos->{'idUsuario'};
		desactivarUsuarios($idUsuario);
	}else if($accion==$ingresar)
	{
		$user = $datos->{'user'};
		$password = $datos->{'password'};
		ingresar($user,$password);
	}

	//CRUD DE USUARIOS
	
	//funcion para ingresar
	
	function ingresar($user,$password){
		$activo = true;
		$query = "SELECT * FROM usuarios WHERE user='$user' and pass=$password and activo=1";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		if ($resultdb = mysqli_fetch_array($result) and $result->num_rows == 1) {
			$usuario = array('id'=>$resultdb['idUsuario'], "nombre"=>$resultdb['nombre'], "user"=>$resultdb['user'], 
				'rol'=>$resultdb['rol'], "token"=>"fake");
		}
		$link->close();		
		echo json_encode($usuario);	
	}

	//crear usuario
	function nuevoUsuario($nombre,$apellido,$user,$pass,$rol){
		$activo = true;
		$query = "INSERT INTO usuarios(nombre, apellido, user, pass, rol, activo) VALUES('$nombre','$apellido','$user','$pass','$rol', '$activo')";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		$link->close();		
		echo json_encode($result);	
	}
	
	//listar usuarios
	function listarUsuarios(){
		$activo = true;
		$query = "SELECT * FROM usuarios WHERE activo='$activo'";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = $resultdb->fetch_assoc()){
			$arrayData[] = $row;
		}
		$link->close();//cierro conex
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

	//listar usuarios por id
	function listarUsuariosId($id){
		$activo = true;
		$query = "SELECT * FROM usuarios WHERE idUsuario='$id' and activo='$activo'";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		if ($resultdb->num_rows == 1) {
			$usuario = $resultdb->fetch_assoc();
		}
		$link->close();//cierro conex
		echo json_encode($usuario);//imprimo un JSON con los datos de la consulta
	}

	//eliminar usuario por id
	function actualizarUsuarios($id,$nombre,$apellido,$user,$pass,$rol){
		$activo = true;
		$query = "UPDATE usuarios set nombre = '$nombre', apellido = '$apellido', user = '$user', pass='$pass', rol='$rol'  where idUsuario=$id AND activo = $activo";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$link->close();
		echo json_encode($result);
	}

	//desactivar usuario
	function desactivarUsuarios($id){
		$activo = 0;
		$query = "UPDATE usuarios SET activo = $activo WHERE idUsuario=$id";;
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		$link->close();		
		echo json_encode($result);	
	}

?>