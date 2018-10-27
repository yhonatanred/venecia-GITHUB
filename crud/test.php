<?php
	//include 'categoria.php';

	

//TEST PARA ACTUALIZAR UNA CATEGORIA
/*	$array = array("accion"=>'eliminar', "nombre"=>'Hamburguesas');
	$json = json_encode($array);
	header("Location: categoria.php?productJson=$json");

*/
//TEST PARA CREAR UNA CATEGORIA
/*
	$array = array("accion"=>'crear', "nombre"=>'frutas');
	$json = json_encode($array);
	header("Location: categoria.php?productJson=$json");
	*/
//TEST PARA CREAR UN PRODUCTO
	//$array = array("nombre"=>'eliminar', "nombre"=>'Hamburguesas');
	/*$prod = Array("codigo"=>'21atyt', "nombre"=>'test3', "precio"=>3500,"color"=>'color', "subCategoria"=>1, "comanda"=>1);
	$gusto=array(2,3);
	$array = array("accion"=>'crearPyG', "producto"=>$prod, "gustos"=>$gusto);
	*/
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-xsrf-token");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

//VARIABLES QUE ME REPRESENTA LOS TIPOS DE PAGO
$tarjeta = "tarjeta";
$efectivo = "efectivo";
$credito = "credito";
$mixto = "mixto";

	$array = array('accion' => 'cargar', 'fecha1'=>'2017-12-17', 'fecha2'=> '2017-12-17');
	$json = json_encode($array);
	header("Location: servicioTemporal/pedidoTemporal.php?pedidoJson=$json");

?>
