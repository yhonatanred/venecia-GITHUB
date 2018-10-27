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
$leer = 'leer';
$actualizar = 'actualizar';

//EVALUA EL TIPO DE ACCION A REALIZAR
if($accion==$leer){
    listar();
}else if($accion==$actualizar){
    $resolucion = $datos->{'detalles'}->{'resolucion'};
    $desde = $datos->{'detalles'}->{'desde'};
    $hasta = $datos->{'detalles'}->{'hasta'};
    $regimen = $datos->{'detalles'}->{'regimen'};
    $nombre = $datos->{'detalles'}->{'nombre'};
    $nit = $datos->{'detalles'}->{'nit'};
    $direccion = $datos->{'detalles'}->{'direccion'};
    $subnombre = $datos->{'detalles'}->{'subnombre'};
    $mensaje = $datos->{'detalles'}->{'mensaje'};
    $slogan = $datos->{'detalles'}->{'slogan'};
    actualizar($resolucion,$desde,$hasta,$regimen,$nombre,$nit,$direccion,$subnombre,$mensaje,$slogan);
}else{
    listar();
}

function listar(){
    $query = "SELECT * FROM negocio WHERE idNegocio=1";
    $link = conectar(); //llama a la funcion conectar de conex.php
    $result = $link->query($query); //envia el query a la BD
    if ($result->num_rows == 1) {
        $negocio = $result->fetch_assoc();
    }
    $link->close();//cierro 
    echo json_encode($negocio);
}

function actualizar($resolucion,$desde,$hasta,$regimen,$nombre,$nit,$direccion,$subnombre,$mensaje,$slogan){
    $query = "UPDATE negocio set resolucion = '$resolucion', desde = '$desde', hasta = '$hasta', regimen='$regimen', nombre='$nombre', nit='$nit', direccion='$direccion', subnombre='$subnombre', mensaje='$mensaje', slogan='$slogan'  where idNegocio=1";
    $link = conectar(); //llama a la funcion conectar de conex.php
    $result = $link->query($query); //envia el query a la BD		
    $link->close();
    echo json_encode($result);
}
