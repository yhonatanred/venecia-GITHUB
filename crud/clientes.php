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
	$leer_X_tel = 'leer_X_tel';

//EVALUA EL TIPO DE ACCION A REALIZAR
	if($accion==$crear)
	{
		$nombreCompleto = $datos->{'cliente'}->{'nombreCompleto'};
		$telefonoC = $datos->{'cliente'}->{'telefonoC'};
		$direccionC = $datos->{'cliente'}->{'direccionC'};
		$empresa = $datos->{'cliente'}->{'empresa'};
        $telefonoEmpresa = $datos->{'cliente'}->{'telefonoEmpresa'};
        $cedula = $datos->{'cliente'}->{'cedula'};
        $ciudad = $datos->{'cliente'}->{'ciudad'};
        nuevoCliente($nombreCompleto,$telefonoC,$direccionC,$empresa,$telefonoEmpresa,$cedula,$ciudad);	
	}
	else if($accion==$leer)
	{
		listarClientes();
	}
	else if($accion==$leerid)
	{
		$idCliente = $datos->{'idCliente'};
		listarClientesId($idCliente);
	}
	else if($accion==$actualizar)
	{
		$nombreCompleto = $datos->{'cliente'}->{'nombreCompleto'};
		$telefonoC = $datos->{'cliente'}->{'telefonoC'};
		$direccionC = $datos->{'cliente'}->{'direccionC'};
		$empresa = $datos->{'cliente'}->{'empresa'};
        $telefonoEmpresa = $datos->{'cliente'}->{'telefonoEmpresa'};
        $cedula = $datos->{'cliente'}->{'cedula'};
        $ciudad = $datos->{'cliente'}->{'ciudad'};
		$idCliente = $datos->{'cliente'}->{'idCliente'};
		actualizarClientes($idCliente,$nombreCompleto,$telefonoC,$direccionC,$empresa,$telefonoEmpresa,$cedula,$ciudad);
	}
	else if($accion==$eliminar)
	{
		$idCliente = $datos->{'idCliente'};
		desactivarClientes($idCliente);
	}else if($accion == $leer_X_tel)
	{
		$telefono = $datos->{'telefono'};
		buscarCliente_X_telefono($telefono);
	}

	//CRUD DE ClienteS

	//crear cliente
	function nuevoCliente($nombreCompleto,$telefonoC,$direccionC,$empresa,$telefonoEmpresa,$cedula,$ciudad){
		$activo = true;
		$query = "INSERT INTO clientes(nombreCompleto, telefonoC, direccionC, empresa, telefonoEmpresa, cedula, ciudad, activo) VALUES('$nombreCompleto','$telefonoC','$direccionC','$empresa','$telefonoEmpresa','$cedula','$ciudad', '$activo')";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		$link->close();		
		echo json_encode($result);	
	}
	
	//listar Clientes
	function listarClientes(){
		$activo = true;
		$query = "SELECT * FROM clientes WHERE activo='$activo'";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = $resultdb->fetch_assoc()){
			$arrayData[] = $row;
		}
		$link->close();//cierro conex
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

	//listar Clientes por id
	function listarClientesId($id){
		$activo = true;
		$query = "SELECT * FROM clientes WHERE idCliente='$id' and activo='$activo'";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		if ($resultdb->num_rows == 1) {
			$cliente = $resultdb->fetch_assoc();
		}
		$link->close();//cierro conex
		echo json_encode($cliente);//imprimo un JSON con los datos de la consulta
	}

	//eliminar cliente por id
	function actualizarClientes($id,$nombreCompleto,$telefonoC,$direccionC,$empresa,$telefonoEmpresa,$cedula,$ciudad){
		$activo = true;
		$query = "UPDATE clientes set nombreCompleto = '$nombreCompleto', telefonoC = '$telefonoC', direccionC = '$direccionC', empresa='$empresa', telefonoEmpresa='$telefonoEmpresa', cedula='$cedula', ciudad='$ciudad'  where idCliente=$id AND activo = $activo";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$link->close();
		echo json_encode($result);
	}

	//desactivar cliente
	function desactivarClientes($id){
		$activo = 0;
		$query = "UPDATE clientes SET activo = $activo WHERE idCliente=$id";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		$link->close();		
		echo json_encode($result);	
	}
	
	/*******************************
	*DARIO: BUSCA UN CLIENTE POR
	*SU NUMERO TELEFONICO
	*******************************/
	function buscarCliente_X_telefono($telefono){
		$activo = true;
		$query = "SELECT * FROM Clientes WHERE (telefonoC = '$telefono' OR telefonoEmpresa = '$telefono') AND activo = $activo";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		if ($resultdb->num_rows == 1) {
			$cliente = $resultdb->fetch_assoc();
		}else{
			$cliente = array('idCliente'=>-1);
		}
		$link->close();//cierro conex
		echo json_encode($cliente);//imprimo un JSON con los datos de la consulta
	}

?>