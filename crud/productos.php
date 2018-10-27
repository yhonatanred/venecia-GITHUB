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
	$crear = 'crear';//variable que me representa que se creará un producto sin gustos
	$crearPyG = 'crearPyG';//variable que representa que se creará un producto con sus gustos
	$leer = 'leer';
	$actualizar = 'actualizar';
	$actualizarPyG = 'actualizarPyG';
	$eliminar = 'eliminar';
	$buscar = 'buscar';
	$detalles='detalles';
	$gustosP = 'obtenerGustosP';
	$estado = 'estado';
	$leerId = 'leerId';
	$prodXid = 'prodXid';
	$obtenerIds = 'obtenerIds';
	$buscar_comun = 'buscar_comun';
	$consecTr = 'tr';

	if($accion==$leer){
		leerProductos();
	}else if($accion==$crear){
		$codigo= $datos->{'producto'}->{'codigo'};
		$nombre= $datos->{'producto'}->{'nombre'};
		$precio= $datos->{'producto'}->{'precio'};
		$color= $datos->{'producto'}->{'color'};
		$comanda= $datos->{'producto'}->{'comanda'};
		$idSubCat= $datos->{'producto'}->{'subCategoria'};
		nuevoProducto($codigo, $nombre, $precio, $color, $idSubCat, $comanda);

	}else if($accion==$crearPyG){
		$codigo= $datos->{'producto'}->{'codigo'};
		$nombre= $datos->{'producto'}->{'nombre'};
		$precio= $datos->{'producto'}->{'precio'};
		$color= $datos->{'producto'}->{'color'};
		$comanda= $datos->{'producto'}->{'comanda'};
		$idSubCat= $datos->{'producto'}->{'subCategoria'};
		$gustos= $datos->{'gustos'};
		nuevoProductoConGusto($codigo, $nombre, $precio, $color, $idSubCat, $comanda, $gustos);
	}else if($accion==$detalles){
		productosDetalles();
	}else if($accion==$actualizar){
		$codigo= $datos->{'producto'}->{'codigo'};
		$nombre= $datos->{'producto'}->{'nombre'};
		$precio= $datos->{'producto'}->{'precio'};
		$color= $datos->{'producto'}->{'color'};
		$comanda= $datos->{'producto'}->{'comanda'};
		$idSubCat= $datos->{'producto'}->{'subCategoria'};
		$activo= $datos->{'activo'};
		$idAnterior= $datos->{'idAnterior'};
		modificarProductoSinGusto($codigo, $nombre, $precio, $color, $idSubCat, $comanda, $activo, $idAnterior);
	}else if($accion==$actualizarPyG){
		$codigo= $datos->{'producto'}->{'codigo'};
		$nombre= $datos->{'producto'}->{'nombre'};
		$precio= $datos->{'producto'}->{'precio'};
		$color= $datos->{'producto'}->{'color'};
		$comanda= $datos->{'producto'}->{'comanda'};
		$idSubCat= $datos->{'producto'}->{'subCategoria'};
		$activo= $datos->{'activo'};
		$idAnterior= $datos->{'idAnterior'};
		$gustos= $datos->{'gustos'};
		modificarProductoConGusto($codigo, $nombre, $precio, $color, $idSubCat, $comanda, $activo, $idAnterior, $gustos);
	}else if($accion==$gustosP){
		obtenerGustos_de_Productos();
	}else if($accion==$estado){
		$activo= $datos->{'activo'};
		$idProducto=$datos->{'idProducto'}; 
		estado_producto($activo, $idProducto);
	}else if($accion==$leerId){
		$codigo= $datos->{'id'};
		leerProductoId($codigo);
	}else if($accion==$prodXid){
		$idProducto= $datos->{'idProducto'};
		buscarProductos_X_codigo($idProducto);
	}else if($accion==$obtenerIds){
		obtenerIds_de_Productos();
	}else if($accion == $buscar_comun){
		$nombre = $datos->{'nombre'};
		buscarProducto_comun($nombre);
	}else if($accion == $consecTr){
		consecTr();
	}


//CRUD DE CATEGORIAS

	//crear
	function nuevoProducto($codigoProd, $nombre, $precio, $color, $idSubCat, $idComanda){
		//agrega un nuevo producto a la BD
		$activo = true;
		$query = "INSERT INTO Productos(idProducto, nombreP, precioP, color, activo, idSubCategoria, idComanda) VALUES('$codigoProd', '$nombre', $precio, '$color', $activo, $idSubCat, $idComanda)";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		if($result){
			echo 'Nuevo producto';
		}
		else if(!$result){
			echo 'Error al insertar en la BD';
		}

		
		$link->close();		
	}



	function nuevoProductoConGusto($codigoProd, $nombre, $precio, $color, $idSubCat, $idComanda, $gustos){
		//agrega un nuevo producto a la BD
		$activo = true;
		$query = "INSERT INTO Productos(idProducto, nombreP, precioP, color, activo, idSubCategoria, idComanda) VALUES('$codigoProd', '$nombre', $precio, '$color', $activo, $idSubCat, $idComanda)";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		if($result){
			echo 'Nuevo producto';
		}
		else if(!$result){
			echo 'Error al insertar en la BD';
		}

		//agrega 'gustos' al producto
		$tamanioG = count($gustos);
		for($i = 0; $i < $tamanioG; $i++){
			$varGusto = $gustos[$i];
			if($varGusto != 'no'){
				$queryG = "INSERT INTO Gustos_Productos(idProducto, idGusto) VALUES('$codigoProd', $varGusto)";
				$result = $link->query($queryG);
				if($result){
					echo 'Nuevo gusto para este plato';
				}
				else if(!$result){
					echo 'Error al insertar gusto al plato en la BD';
				}
			}
		}
		$link->close();		
	}
	

//Leer
	function leerProductos(){
		$activo = true;
		$query = "SELECT * FROM Productos WHERE activo=$activo ORDER BY nombreP ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$producto = array("codigo"=>$row['idProducto'], "nombre"=>$row['nombreP'], "precio"=>$row['precioP'], 
				"color"=>$row['color'], "idComanda"=>$row['idComanda'], "subCategoria"=>$row['idSubCategoria']);
			$arrayData[$i] = $producto;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}	


	function productosDetalles(){
		$activo = true;
		/**********************************************************
		*QUERY PARA SELECCIONAR LOS PRODUCTOS QUE TIENEN GUSTOS*****
		************************************************************/
		$query1= "SELECT DISTINCT Productos.idProducto, Productos.nombreP, Productos.precioP, Productos.color, Categorias.nombreCat, SubCategorias.nombreSC, Comandas.nombreComanda, Comandas.idComanda, count(*) as numGustos, Productos.activo FROM Productos, Categorias, SubCategorias, Comandas, Gustos, Gustos_Productos WHERE Productos.idSubCategoria = SubCategorias.idSubCategoria 
				AND SubCategorias.idCategoria = Categorias.idCategoria AND Productos.idComanda = Comandas.idComanda  AND Productos.idProducto = Gustos_Productos.idProducto AND 
				Gustos_Productos.idGusto = Gustos.idGusto group by idProducto  ORDER BY nombreP";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result1 = $link->query($query1); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		$aux = array();
		while($row = mysqli_fetch_array($result1)){
			$producto = array("idAnterior"=>$row['idProducto'], "codigo"=>$row['idProducto'], "nombre"=>$row['nombreP'], "precio"=>$row['precioP'], 
				"color"=>$row['color'], "idComanda"=>$row['idComanda'], "categoria"=>$row['nombreCat'], "comanda"=>$row['nombreComanda'], "subCategoria"=>$row['nombreSC'], "numGustos"=>$row['numGustos'], "activo"=>!$row['activo'], "editar"=>false);
			$arrayData[$i] = $producto;
			$aux[$i]=$row['nombreP'];
			$i++;
		}

		/**********************************************************
		*QUERY PARA SELECCIONAR LOS PRODUCTOS QUE NO TIENEN GUSTOS***
		************************************************************/
		$query2= "SELECT DISTINCT Productos.idProducto, Productos.nombreP, Productos.precioP, Productos.color, Categorias.nombreCat, SubCategorias.nombreSC, Comandas.nombreComanda, Comandas.idComanda, Productos.activo FROM Productos, Categorias, SubCategorias, Comandas WHERE Productos.idSubCategoria = SubCategorias.idSubCategoria AND SubCategorias.idCategoria = Categorias.idCategoria AND Productos.idComanda = Comandas.idComanda  AND NOT EXISTS(
				SELECT Gustos_Productos.idProducto FROM Gustos_Productos WHERE Gustos_Productos.idProducto=Productos.idProducto ) ORDER BY nombreP";
		$result2 = $link->query($query2); //envia el query a la BD			
		while($row = mysqli_fetch_array($result2)){
			$producto = array("idAnterior"=>$row['idProducto'], "codigo"=>$row['idProducto'], "nombre"=>$row['nombreP'], "precio"=>$row['precioP'], 
				"color"=>$row['color'],  "idComanda"=>$row['idComanda'] ,"categoria"=>$row['nombreCat'], "comanda"=>$row['nombreComanda'], "subCategoria"=>$row['nombreSC'], "numGustos"=>0, "activo"=>!$row['activo'], "editar"=>false);
			$arrayData[$i] = $producto;
			$aux[$i]=$row['nombreP'];
			$i++;
		//	echo 'valor en while: '.json_encode($arrayData);
		}		
		array_multisort($aux, SORT_ASC, $arrayData);
		$link->close();

		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}//FIN DE LA FUNCION



	/*ACTUALIZA ´RPDUCTOS*/
	function modificarProductoSinGusto($codigoProd, $nombre, $precio, $color, $idSubCat, $idComanda, $activo, $idAnterior){
		//modifica un producto en la BD
		//$activo = true;
		
		
		$query = "UPDATE Productos SET idProducto='$codigoProd', nombreP='$nombre', precioP=$precio, color='$color', 
		 activo=$activo, idSubCategoria=$idSubCat, idComanda=$idComanda WHERE idProducto='$idAnterior'";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		if($result){
			echo 'Producto modificado';
		}
		else if(!$result){
			echo 'Error al imodificar un producto en la BD';
			echo "UPDATE Productos SET idProducto='$codigoProd', nombreP='$nombre', precioP=$precio, color='$color', 
		 activo=$activo, idSubCategoria=$idSubCat, idComanda=$idComanda WHERE idProducto='$idAnterior'";
		}
		
		$link->close();		
	}
	function modificarProductoConGusto($codigoProd, $nombre, $precio, $color, $idSubCat, $idComanda, $activo, $idAnterior, 
		$gustos){
		//modifica un producto en la BD
		//$activo = true;
		$query = "UPDATE Productos SET idProducto='$codigoProd', nombreP='$nombre', precioP=$precio, color='$color', 
		 activo=$activo, idSubCategoria=$idSubCat, idComanda=$idComanda WHERE idProducto='$idAnterior'";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		if($result){
			echo 'Producto modificado';
			$query = "DELETE FROM Gustos_Productos WHERE idProducto = '$codigoProd'";
			$result = $link->query($query); //envia el query a la BD

			//actualiza 'gustos' al producto
			$tamanioG = count($gustos);
			for($i = 0; $i < $tamanioG; $i++){
				$varGusto = $gustos[$i];
				if($varGusto != 'no'){
					$queryG = "INSERT INTO Gustos_Productos(idProducto, idGusto) VALUES('$codigoProd', $varGusto)";
					$result2 = $link->query($queryG);
					if($result2){
						echo 'Nuevo gusto para este plato';
					}
					else if(!$result){
						echo 'Error al insertar gusto al plato en la BD';
					}
				}
			}


		}
		else if(!$result){
			echo 'Error al imodificar un producto en la BD';
			echo "UPDATE Productos SET idProducto='$codigoProd', nombreP='$nombre', precioP=$precio, color='$color', 
		 activo=$activo, idSubCategoria=$idSubCat, idComanda=$idComanda WHERE idProducto='$idAnterior'";
		}
		
		$link->close();		
	}

//funcion que modifica el estado de un producto(activado/desactivado)
	function estado_producto($estado, $idProducto){
		$query = "UPDATE Productos SET activo = $estado WHERE idProducto = '$idProducto'";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD
		if($result){
			echo 'Se cambió el estado del producto';
		}
		else if(!$result){
			echo 'Error al cambiar el estado del producto en la BD';
		}
		
		$link->close();
	}

	function obtenerGustos_de_Productos(){
		$query = "SELECT * FROM Gustos_Productos";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$gustos = array("idProducto"=>$row['idProducto'], "idGusto"=>$row['idGusto']);
			$arrayData[$i] = $gustos;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}


//A PARTIR DE AQUI NO SE HA MODIFICADO LOS METODOS PARA ASIGNARLOS A 'PRODUCTOS' -----------------------------------

	

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

	//LeerId busca los productos por el id de la subcategoria
	function leerProductoId($codigo){
		$activo = true;
		$query = "SELECT Productos.idProducto, Productos.nombreP, Productos.precioP, Productos.color, Productos.activo, Productos.idSubCategoria, Productos.idComanda, Comandas.nombreComanda FROM Productos, Comandas WHERE Productos.activo=$activo and Productos.idSubCategoria=$codigo and Productos.idComanda = Comandas.idComanda  ORDER BY nombreP ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$producto = array("codigo"=>$row['idProducto'], "nombre"=>$row['nombreP'], "precio"=>$row['precioP'], 
				"color"=>$row['color'], "idComanda"=>$row['idComanda'], "subCategoria"=>$row['idSubCategoria'], "nombreComanda"=>$row['nombreComanda']);
			$arrayData[$i] = $producto;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}


	//BUSCA UN PRODUCTO POR su codigo --fecha: 06-11-2017
	function buscarProductos_X_codigo($idProducto){
		$activo = true;
		$query = "SELECT Productos.idProducto, Productos.nombreP, Productos.precioP, Productos.color, Productos.activo, Productos.idSubCategoria, Productos.idComanda, Comandas.nombreComanda FROM Productos, Comandas, Subcategorias WHERE Productos.idProducto = '$idProducto' and Productos.activo=1 and Productos.idSubCategoria=Subcategorias.idSubCategoria and Productos.idComanda = Comandas.idComanda ORDER BY nombreP ASC";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$producto = array("codigo"=>$row['idProducto'], "nombre"=>$row['nombreP'], "precio"=>$row['precioP'], 
				"color"=>$row['color'], "idComanda"=>$row['idComanda'], "subCategoria"=>$row['idSubCategoria'], "nombreComanda"=>$row['nombreComanda']);
			$arrayData[$i] = $producto;
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

	//obtiene los ids de los productos
	function obtenerIds_de_Productos(){
		$activo = true;
		$query = "SELECT idProducto FROM Productos WHERE activo = $activo";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$result = $link->query($query); //envia el query a la BD		
		$i = 0;
		$arrayData = array();//creo un array para almacenar los datos de la consulta 
		while($row = mysqli_fetch_array($result)){
			$arrayData[$i] = $row['idProducto'];
			$i++;
		}
		$link->close();
		echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}


	//busca un producto por nombre en comun por su nombre o subcategoria
	function buscarProducto_comun($nombre){
	//	SELECT * FROM Productos WHERE nombreP LIKE '%$nombre%' OR idSubCategoria = (SELECT idSubCategoria FROM SubCategorias WHERE nombreSC = '%$nombre%')";
	$activo = true;
	/**********************************************************
	*QUERY PARA SELECCIONAR LOS PRODUCTOS QUE TIENEN GUSTOS*****
	************************************************************/
	$query1= "SELECT DISTINCT Productos.idProducto, Productos.nombreP, Productos.precioP, Productos.color, Categorias.nombreCat, SubCategorias.nombreSC, Comandas.nombreComanda, Comandas.idComanda, count(*) as numGustos, Productos.activo FROM Productos, Categorias, SubCategorias, Comandas, Gustos, Gustos_Productos WHERE (Productos.idSubCategoria = SubCategorias.idSubCategoria 
			AND SubCategorias.idCategoria = Categorias.idCategoria AND Productos.idComanda = Comandas.idComanda  AND Productos.idProducto = Gustos_Productos.idProducto AND 
			Gustos_Productos.idGusto = Gustos.idGusto) AND ( Productos.nombreP LIKE '%$nombre%' OR Productos.idSubCategoria = (SELECT idSubCategoria FROM SubCategorias WHERE nombreSC = '$nombre') ) group by idProducto  ORDER BY nombreP";
	$link = conectar(); //llama a la funcion conectar de conex.php
	$result1 = $link->query($query1); //envia el query a la BD		
	$i = 0;
	$arrayData = array();//creo un array para almacenar los datos de la consulta 
	$aux = array();
	while($row = mysqli_fetch_array($result1)){
		$producto = array("idAnterior"=>$row['idProducto'], "codigo"=>$row['idProducto'], "nombre"=>$row['nombreP'], "precio"=>$row['precioP'], 
			"color"=>$row['color'], "idComanda"=>$row['idComanda'], "categoria"=>$row['nombreCat'], "comanda"=>$row['nombreComanda'], "subCategoria"=>$row['nombreSC'], "numGustos"=>$row['numGustos'], "activo"=>!$row['activo'], "editar"=>false);
		$arrayData[$i] = $producto;
		$aux[$i]=$row['nombreP'];
		$i++;
	}

	/**********************************************************
	*QUERY PARA SELECCIONAR LOS PRODUCTOS QUE NO TIENEN GUSTOS***
	************************************************************/
	$query2= "SELECT DISTINCT Productos.idProducto, Productos.nombreP, Productos.precioP, Productos.color, Categorias.nombreCat, SubCategorias.nombreSC, Comandas.nombreComanda, Comandas.idComanda, Productos.activo FROM Productos, Categorias, SubCategorias, Comandas WHERE (Productos.idSubCategoria = SubCategorias.idSubCategoria AND SubCategorias.idCategoria = Categorias.idCategoria AND Productos.idComanda = Comandas.idComanda  AND NOT EXISTS(
			SELECT Gustos_Productos.idProducto FROM Gustos_Productos WHERE Gustos_Productos.idProducto=Productos.idProducto ) ) AND (Productos.nombreP LIKE '%$nombre%' OR Productos.idSubCategoria = (SELECT idSubCategoria FROM SubCategorias WHERE nombreSC = '$nombre')) ORDER BY nombreP";
	$result2 = $link->query($query2); //envia el query a la BD			
	while($row = mysqli_fetch_array($result2)){
		$producto = array("idAnterior"=>$row['idProducto'], "codigo"=>$row['idProducto'], "nombre"=>$row['nombreP'], "precio"=>$row['precioP'], 
			"color"=>$row['color'],  "idComanda"=>$row['idComanda'] ,"categoria"=>$row['nombreCat'], "comanda"=>$row['nombreComanda'], "subCategoria"=>$row['nombreSC'], "numGustos"=>0, "activo"=>!$row['activo'], "editar"=>false);
		$arrayData[$i] = $producto;
		$aux[$i]=$row['nombreP'];
		$i++;
	//	echo 'valor en while: '.json_encode($arrayData);
	}		
	array_multisort($aux, SORT_ASC, $arrayData);
	$link->close();

	echo json_encode($arrayData);//imprimo un JSON con los datos de la consulta
	}

	//DARIO
	function consecTr(){
		//obtiene el tr mayor de la tabla detalles
		$query = "SELECT MAX(tr) as tr FROM Detalle";
		$link = conectar(); //llama a la funcion conectar de conex.php
		$resultdb = $link->query($query); //envia el query a la BD
		if ($resultdb->num_rows == 1){
			$consec = $resultdb->fetch_assoc();
			$consec = $consec['tr'];
			$consec++;
		}else{
			$consec = 0;
		}	

		//obtiene el tr mayor de la tabla borrados
		$query = "SELECT MAX(tr) as tr FROM Borrados";
		$resultdb = $link->query($query); //envia el query a la BD
		if ($resultdb->num_rows == 1){
			$consec2 = $resultdb->fetch_assoc();
			$consec2 = $consec2['tr'];
			$consec2++;
		}else{
			$consec2 = 0;
		}	

		if($consec < $consec2){
			$consec = $consec2;
		}

		$link->close();//cierro conex
		if(count($consec) < 5){
			$consec = '00'.$consec;
		}
		$consecArray = array('tr' => $consec);
		echo json_encode($consecArray);//imprimo los datos de la consulta
	}

?>