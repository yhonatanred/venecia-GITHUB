<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-xsrf-token");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

include "../conex.php";

	$json = $_REQUEST['pedidoJson'];
	$datos = json_decode($json);
	$accion = $datos->{'accion'};

	$cargar = 'cargar';
	$generar = 'generar';
	$actualizar = 'actualizar';
	$numFactura = "numFactura";
	$pagar = "pagar";
	$domicilio = "consecDomicilio";
	$llevar = "llevar";
	$reemplazar = "reemplazar";
	$buscaNoEnv = "buscarNoEnviados";
	$imprimir = 'imprimir';

	if($accion == $cargar){
		cargarPedidos();
	}else if($accion == $generar){
		$pedido = $datos->{'pedido'};
		$mesa = $pedido->{'mesa'};
		generarPedido($pedido, $mesa, $tr);
	}else if($accion == $actualizar){
		$pedido = $datos->{'pedido'};
		$productos = $pedido->{'productos'};
		$mesa = $pedido->{'mesa'};
		$total = $pedido->{'total'};
		$subTotal = $pedido->{'subTotal'};
		$descuentoG = $pedido->{'descuentoG'};
		$porcDescuento = $pedido->{'porcDescuento'};
		actualizarPedido($productos, $mesa, $total, $subTotal, $pedido, $descuentoG, $porcDescuento);
	}else if($accion == $numFactura){
		consultarConsecutivo();
	}else if($accion == $pagar){
		$mesa = $datos->{'mesa'};
		sacarPedido($mesa);
	}else if($accion == $domicilio){
		consultarConsecDomicilio();
	}else if($accion == $llevar){
		consultarConsecLlevar();
	}else if($accion == $reemplazar){
		$pedido = $datos->{'pedido'};
		$productos = $pedido->{'productos'};
		$mesa = $pedido->{'mesa'};
		$total = $pedido->{'total'};
		$subTotal = $pedido->{'subTotal'};
		$descuentoG = $pedido->{'descuentoG'};
		$impCuenta = $pedido->{'impCuenta'};
		$infoBasica = $pedido->{'infoBasica'};
		sobreescribirPedido($pedido);		
	}else if($accion == $buscaNoEnv){
		$mesa = $datos->{'mesa'};
		obtenerNoEnviados($mesa);
	}else if($accion == $imprimir){
		$pedido = $datos->{'pedido'};
		imprimir($pedido);
	}

	function cargarPedidos(){
		$pedidos = array();//creo el contenedor de todos los archivos que existan en el directorio
		$path = 'json';//direccion del directorio que guarda los archivos JSON
		$directorio = opendir($path);//abro el directorio para tener acceso a los archivos
		$i = 0;//contador de posiciones
		while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
		{
		    if (!is_dir($archivo))//verificamos si es o no un directorio
		    {
		       $file = $path."/".$archivo;
		       //Leemos el JSON
				$datos_pedido = file_get_contents($file);
				$array_pedido = json_decode($datos_pedido, true);
				$pedidos[$i] = $array_pedido;
				$i++;
		    }
		}//fin del while
		//asort($pedidos, 1);
		echo json_encode($pedidos);		
	}

	/*****************************
	*CREA UN JSON COMO FICHERO
	******************************/
	function generarPedido($pedido, $mesa, $actualizar = false){
		//Creamos el JSON
		$json_string = json_encode($pedido);
		$file = 'json/'.$mesa.'.json';
		file_put_contents($file, $json_string);	
		if(!$actualizar){
			header("Location: ../factura_comandas.php?comandaJson=$json_string");
		}
		
	}



	

	/********************************
	*AGREGA NUEVOS PRODUCTOS AL JSON
	*QUE YA EXISTE EN CARPETA
	*********************************/
	/************************
	*se agrega nuevio: $descuentoG, $porcDescuento;
	**************************/
	function actualizarPedido($productos, $mesa, $total, $subTotal, $pedido, $descuentoG, $porcDescuento){
		$pedidos = array();//creo el contenedor de todos los archivos que existan en el directorio
		$path = 'json';//direccion del directorio que guarda los archivos JSON
		$directorio = opendir($path);//abro el directorio para tener acceso a los archivos
		$file = $path."/".$mesa.".json";
		if(is_readable($file)){
			//Leemos el JSON
		$datos_pedido = file_get_contents($file);
		$array_pedido = json_decode($datos_pedido);
		//$tam = $array_pedido->{'productos'}.count();
		$p = $array_pedido->{'productos'};
		$pos = count($p);
		$prds = $array_pedido->{'productos'};
		//$total = $array_pedido->{'total'};
		foreach ($productos as $product) {
			$array_pedido->{'productos'}[$pos] = $product;
			//$total += $product->{'precioP'};
			++$pos;
		}
		
		
		$array_pedido->{'subTotal'} += $subTotal;
		$array_pedido->{'total'} += $total;
		if($porcDescuento == -1){
			$porcDescuento = $array_pedido->{'porcDescuento'};
			$descuentoG = $array_pedido->{'subTotal'} * ($porcDescuento / 100);
		}		
		$array_pedido->{'descuentoG'} = $descuentoG;
		$array_pedido->{'porcDescuento'} = $porcDescuento;
		if($descuentoG > 0){
			$array_pedido->{'total'} = $array_pedido->{'subTotal'} - $descuentoG;
		}
		
		
		generarPedido( $array_pedido, $mesa, true);
		//envío los nuevos productos a las comandas
		//$array_pedido->{'productos'} = $productos;
		//$json_string = json_encode($array_pedido);
		//header("Location: ../factura_comandas.php?comandaJson=$json_string");
		}else{
			generarPedido( $pedido, $mesa, false);
			$json_string = json_encode($pedido);
			header("Location: ../factura_comandas.php?comandaJson=$json_string");	
		}
		
	}


	//FUNCION QUE ME RETORNA EL CONSECUTIVO DE LA PROXIMA FACTURA
	function consultarConsecutivo(){
		$query = "SELECT MAX(consecFactura) as consecFactura FROM Factura";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		if ($resultdb->num_rows == 1) {
			$consec = $resultdb->fetch_assoc();
			$consec = $consec['consecFactura'];
			if($consec != null){
				$consec++;
			}else{
			$query = "SELECT desde FROM negocio";
			$resultdb = $link->query($query); //envia el query a la BD
			if ($resultdb->num_rows == 1) {
				$consec = $resultdb->fetch_assoc();
				$consec = $consec['desde'];
			}else{
				$consec = 0;
			}			
		}
			
		}else{
			$query = "SELECT desde FROM negocio";
			$resultdb = $link->query($query); //envia el query a la BD
			if ($resultdb->num_rows == 1) {
				$consec = $resultdb->fetch_assoc();
				$consec = $consec['desde'];
			}else{
				$consec = 0;
			}			
		}
		$link->close();//cierro conex
		if(count($consec) < 5){
			$consec = '00'.$consec;
		}
		$consecArray = array('numFactura' => $consec);
		echo json_encode($consecArray);//imprimo los datos de la consulta
	}

	//19-11-2017
	function sacarPedido($mesa){
		$pedidos = array();//creo el contenedor de todos los archivos que existan en el directorio
		$path = 'json';//direccion del directorio que guarda los archivos JSON
		$directorio = opendir($path);//abro el directorio para tener acceso a los archivos
		$file = $path."/".$mesa.".json";
		//Leemos el JSON
		unlink($file);		
	}

	//19-11-2017
	function consultarConsecDomicilio(){
		date_default_timezone_set('America/Bogota');
		$fecha = date('Y-m-d');//fecha -->año-mes-dia
		//$query = "SELECT mesa as domicilio FROM factura WHERE fechaF = '$fecha' AND mesa LIKE 'D%' AND cuadre = 0";
		$query = "SELECT mesa as domicilio FROM factura WHERE mesa LIKE 'D%' AND cuadre = 0";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		$consec = 0;//dario
		while($row = $resultdb->fetch_assoc()){//dario
			$mesa = $row['domicilio'];
			//if($consec != null){
				$mesa = intval(preg_replace('/[^0-9]+/', '', $mesa), 10);//extrae el valor numerico del varchar
				if($consec < $mesa){
					$consec = $mesa;
			//	}
			}			
		}
		if($consec == null){
				$consec = 'D1';
			}else{
				$consec = 'D'.(++$consec);
			}
		
		$link->close();//cierro conex
		
		$consecArray = array('consecDomicilio' => $consec);
		echo json_encode($consecArray);//imprimo los datos de la consulta
	}

	//22-11-2017
	function consultarConsecLlevar(){
		date_default_timezone_set('America/Bogota');
		$fecha = date('Y-m-d');//fecha -->año-mes-dia
		//$query = "SELECT mesa as llevar FROM factura WHERE fechaF = '$fecha' AND mesa LIKE 'L%' AND cuadre = 0";
		$query = "SELECT mesa as llevar FROM factura WHERE mesa LIKE 'L%' AND cuadre = 0";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		$consec = 0;//dario
		while($row = $resultdb->fetch_assoc()){//dario
			$mesa = $row['llevar'];
			//if($consec != null){
				$mesa = intval(preg_replace('/[^0-9]+/', '', $mesa), 10);//extrae el valor numerico del varchar
				if($consec < $mesa){
					$consec = $mesa;
			//	}
			}			
		}
		if($consec == null){
				$consec = 'Ll1';
			}else{
				$consec = 'Ll'.(++$consec);
			}
		$link->close();//cierro conex
		
		$consecArray = array('consecLlevar' => $consec);
		echo json_encode($consecArray);//imprimo los datos de la consulta
	}

	function sobreescribirPedido($pedido){
		$pedidos = array();//creo el contenedor de todos los archivos que existan en el directorio
		$path = 'json';//direccion del directorio que guarda los archivos JSON
		$directorio = opendir($path);//abro el directorio para tener acceso a los archivos
		$mesa = $pedido->{'mesa'};
		$file = $path."/".$mesa.".json";
		//Leemos el JSON
		$datos_pedido = file_get_contents($file);
		$array_pedido = json_decode($datos_pedido);
		//$tam = $array_pedido->{'productos'}.count();
		$array_pedido = $pedido;
		generarPedido( $array_pedido, $mesa, true);
	}

//01-12-2017 DARIO -- obtengo los productos que aún no han sido enviados a las comandas
	function obtenerNoEnviados($mesa){
		$productos = array();//creo el contenedor de todos los archivos que existan en el directorio
		$path = 'json';//direccion del directorio que guarda los archivos JSON
		$directorio = opendir($path);//abro el directorio para tener acceso a los archivos
		$file = $path."/".$mesa.".json";
		if(is_readable($file)){
			//Leemos el JSON
		$datos_pedido = file_get_contents($file);
		$array_pedido = json_decode($datos_pedido);
		$i = 0;//posicion para los no enviados
		$j = 0;//posicion para los enviados
		$total = 0;
		$subTotal = 0;
		$descuentoG = 0;
		$enviados = array();
			$prod = $array_pedido->{'productos'};
			foreach ($prod as $p) {
				if(!$p->{'enviado'}){
					$p->{'enviado'} = true;
					$productos[$i] = $p;
					++$i;
				}else{
					$enviados[$j] = $p;
					$subTotal += $p->{'precioP'} * $p->{'cantidad'};
					++$j;
				}
			}
			$descuentoG = $array_pedido->{'descuentoG'};
			$total = $subTotal - $descuentoG;
			$array_pedido->{'productos'} = $enviados;
			$array_pedido->{'descuentoG'} = $descuentoG;
			$array_pedido->{'total'} = $total;
			$array_pedido->{'subTotal'} = $subTotal;
			sobreescribirPedido($array_pedido);
		}	
		echo json_encode($productos);	
	}


	/*******************************
	*METODO QUE ME IMPRIME EN COMANDA
	**********************************/
	function imprimir($pedido){
		$json_string = json_encode($pedido);
		header("Location: ../factura_comandas.php?comandaJson=$json_string");
	}

?>
