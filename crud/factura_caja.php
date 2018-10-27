<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-xsrf-token");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

require __DIR__ . '/ticket/autoload.php';
use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

//VARIABLES QUE ME REPRESENTA LOS TIPOS DE PAGO
$tarjeta = "tarjeta";
$efectivo = "efectivo";
$credito = "credito";
$mixto = "mixto";

//RECIBE INFORMACION ENVIA DESDE OTRA UBICACIÓN O ARCHIVO
$json = $_REQUEST['facturaJson'];
$datos = json_decode($json);
//ESPECIFICA EL TIPO DE REPORTE, "cuenta" O "factura"
$tipoReporte = $datos->{'tipoReporte'};
$resolucion = $datos->{'resolucion'};
$desde = $datos->{'desde'};
$hasta = $datos->{'hasta'};
$regimen = $datos->{'regimen'};
$nombreEmpresa = $datos->{'nombreEmp'};;
$nitEmpresa = $datos->{'nitEmp'};
$direccion = $datos->{'direccionEmp'};
$subnombre = $datos->{'subNombre'};
$mensaje = "FACTURA IMPRESA POR SISTEMA POS";
$slogan = $datos->{'slogan'};
$logo = "";
$tipoPago="";
$entrego="";
$cambio="";
$vrTarjeta = "";
$vrEfectivo = "";

$mesa= $pedido->{'mesa'}; // se agregan esta linea 22-05-2018
$pedido = $datos->{'pedido'};//se agregan esta linea 18-05-2018
$total= $pedido->{'total'};//se agregan esta linea 18-05-2018
if(strtoupper($tipoReporte) != strtoupper("cuenta")){
       //INFORMACION DEL PAGO
    $tipoPago= $datos->{'tipoPago'};
    $entrego= $datos->{'entrega'};
    $cambio= $datos->{'cambio'};  
    $total = $total + $pedido->{'propina'};//linea agregada para sumar la propina---> 18-05-2018  
    $servicio= $pedido->{'propina'}; // se agregan esta linea 22-05-2018
    if(strtoupper($tipoPago) == strtoupper($mixto)){
        $vrTarjeta = $datos->{'vrTarjeta'};
        $vrEfectivo = $datos->{'vrEfectivo'};
    }
}else{
    //imagen del negocio
    $logo = EscposImage::load("ticket/resources/fondo.png", false);

    $iniMesa = substr($mesa, 0, 1); // se agregan esta linea 22-05-2018 con el if
    if(strtoupper($iniMesa) == strtoupper("d") || strtoupper($iniMesa) == strtoupper("l")) {
        $total = $total + $pedido->{'propina'};
        $servicio= $pedido->{'propina'};
    }else{
        $total= $total + ( $pedido->{'total'} * 0.1); 
        $servicio= $total * 0.1;
    }
}

//$pedido = $datos->{'pedido'};
//INFORMACION DEL PEDIDO
date_default_timezone_set('America/Bogota');
$date =$datos->{'fecha'};// date('d-m-Y');//fecha -->dia, mes, año
$hora= $pedido->{'horaPedido'};
//$mesa= $pedido->{'mesa'}; se pone en la parte de arriba      22-05-2018
$subtotal= $pedido->{'subTotal'};
///$servicio= $pedido->{'propina'}; se coloca en la parte de arriba 22-05-2018
//$total= $pedido->{'total'};  esta linea se pone arriba antes del for
$noFactura= $pedido->{'numFactura'};
$descuentoG = $pedido->{'descuentoG'};
//datos del cliente
$infoBasica = $pedido->{'infoBasica'};
$mesero= $infoBasica->{'mesero'};
$nombre= $infoBasica->{'nombreC'};
$nitCliente= $infoBasica->{'direccion'};
$empresa= $infoBasica->{'empresa'};
$telefono= $infoBasica->{'telefono'};
$cajero="";//toma el valor del ultimo usuario que realizó el pedido

$productos = array();
//RECIBE LOS PRODUCTOS
$prods = $pedido->{'productos'};
$i = 0;
foreach ($prods as $prod ){
    $gustos = "";
    foreach($prod->{'gustos'} as $gust){
        $gustos = $gustos." ,".$gust->{'nombreG'};
    }
    $nombreProd = $prod->{'nombreP'}."  (".$gustos.")";
    $productos[$i] = new producto("".$prod->{'cantidad'}, "".$nombreProd, "".$prod->{'precioP'});
    $cajero = $prod->{'usuario'};
    ++$i;
}
/*
$productos = array(
    new producto("2", "Pizza Hawaiana Familiar", "95.000"),
    new producto("3", "Pizza Venezia Especial Familiar","73.000"),
    new producto("1", "Recargo Domicilio Condominio Club","2.200")
);
*/
/* MENSAJE DE PIE DE PAGINA */
$mensajePropina="Por disposicion de Industria y Comercio, se informa que en este establecimiento la propina es sugeridad y corresponde a un 10% del valor de la cuenta, el cual podra ser aceptado, rechazado o modificado por usted de acuerdo con su valorazion del servicio prestado. Si no desea pagar dicho valor haga caso omiso del mismo.";
$newmensajePropina = wordwrap($mensajePropina, 48, "\n", false);


/* Fill in your own connector here */
$connector = new WindowsPrintConnector("SAT SAT38TUSE1");
$printer = new Printer($connector);


/* Print top logo */
$printer -> setJustification(Printer::JUSTIFY_CENTER);
//valida la variable para imprimirla solo en la factura
if($logo != ""){
    $printer -> graphics($logo);
}


/* Name of shop */
$printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
$printer -> text("$nombreEmpresa\n");
$printer -> selectPrintMode();
$printer -> text("$subnombre\n");
$printer -> text("$nitEmpresa\n");
$printer -> feed();
$printer -> setJustification(Printer::JUSTIFY_LEFT);
$printer -> text("Factura de venta No.-- $noFactura\n");
$printer -> setJustification(Printer::JUSTIFY_CENTER);
$printer -> text("$date  Fecha:  $hora\n");
$printer -> setJustification(Printer::JUSTIFY_LEFT);
$printer -> text(new datos('Mesa No.', "$mesa  Mesero: $mesero"));
$printer -> text(new datos('Cajero:', $cajero));
$printer -> text(new datos('Empresa:', $empresa));
$printer -> text(new datos('Nombre:', $nombre));
$printer -> text(new datos('Nit:', $nitCliente));
$printer -> text(new datos('Telefono:', $telefono));
$printer -> setJustification(Printer::JUSTIFY_LEFT);
$printer -> text("------------------------------------------------");
$printer -> text(" CANT             PRODUCTO                SUMAN");
$printer -> feed();
$printer -> text("------------------------------------------------");
$printer -> feed();
$printer -> setJustification(Printer::JUSTIFY_LEFT);
foreach ($productos as $producto) {
    $printer -> setJustification(Printer::JUSTIFY_LEFT);
    $printer -> text($producto);
}
$printer -> feed();
$printer -> text(new item('Subtotal:', $subtotal));
$printer -> text(new item('Servicio Volun.:', $servicio));
if($descuentoG > 0){
    $printer -> text(new item('Descuento :', "-".$descuentoG));
}
$printer -> setEmphasis(true);
$printer -> text(new linea('', ''));
$printer -> setTextSize(1,2);
$printer -> text(new item('Total:', "$ $total"));
$printer -> setTextSize(1,1);
$printer -> text(new linea('', ''));
$printer -> setEmphasis(false);

/*****************************************************************************************************
*VALIDA LOS TIPOS DE PAGO
*******************************************************************************************************/
if(strtoupper($tipoPago) == strtoupper($tarjeta) || strtoupper($tipoPago) == strtoupper($efectivo) || strtoupper($tipoPago) == strtoupper($credito) ){
    $printer -> text("------------------------------------------------");
    $printer -> feed();
    $printer -> text(new cambio("Entrega:", "$ $entrego","$tipoPago"));
    $printer -> text(new cambio("Cambio:", "$ $cambio",''));
    $printer -> text("------------------------------------------------");
    $printer -> feed();
}else if(strtoupper($tipoPago) == strtoupper($mixto)){
    $printer -> text("------------------------------------------------");
    $printer -> feed();
    $printer -> text(new cambio("Tipo de pago:", "***","$tipoPago"));
    $printer -> text(new cambio("Tarjeta:", "$ $vrTarjeta",''));
    $printer -> text(new cambio("Efectivo:", "$ $vrEfectivo",''));
    $printer -> text(new cambio("Cambio:", "$ $cambio",''));
    $printer -> text("------------------------------------------------");
    $printer -> feed();
}

$printer -> feed();
$printer -> setJustification(Printer::JUSTIFY_CENTER);
$printer -> text("$regimen\n");
$printer -> text("-----------Informacion Tributaria---------");
$printer -> feed();
$printer -> text(new item('Base:', $subtotal));
$printer -> text(new item('IVA: 0%', '0'));
$printer -> feed();
$printer -> text("------------------------------------------------");
$printer -> feed();
$printer -> text("$resolucion\n");
$printer -> text("Desde -- $desde Hasta -- $hasta\n");
$printer -> feed();
$printer -> text("$newmensajePropina");
$printer -> feed();
$printer -> feed();
$printer -> text("------------------------------------------------");
$printer -> feed();
$printer -> text("$direccion");
$printer -> feed();
$printer -> text("------------------------------------------------");
$printer -> feed();
$printer -> text("$mensaje");
$printer -> feed();
$printer -> feed();
$printer -> feed();
$printer -> feed();

/* Cut the receipt and open the cash drawer */
$printer -> cut();
$printer -> pulse();

$printer -> close();

/* A wrapper to do organise item names & prices into columns */
class item
{
    private $name;
    private $price;
    private $dollarSign;

    public function __construct($name = '', $price = '', $dollarSign = false)
    {
        $this -> name = $name;
        $this -> price = $price;
        $this -> dollarSign = $dollarSign;
    }
    
    public function __toString()
    {
        $rightCols = 10;
        $leftCols = 38;
        if ($this -> dollarSign) {
            $leftCols = $leftCols / 2 - $rightCols / 2;
        }
        $left = str_pad($this -> name, $leftCols) ;
        
        $sign = ($this -> dollarSign ? '$ ' : '');
        $right = str_pad($sign . $this -> price, $rightCols, ' ', STR_PAD_LEFT);
        return "$left$right\n";
    }
}

class datos
{
    private $llave;
    private $valor;

    public function __construct($llave = '', $valor = '')
    {
        $this -> llave = $llave;
        $this -> valor = $valor;
    }
    
    public function __toString()
    {
        $rightCols = 15;
        $leftCols = 10;
        
        $left = str_pad($this -> llave, $leftCols) ;
        $right = str_pad($this -> valor, $rightCols);
        return "$left$right\n";
    }
}

class producto
{
    private $cant;
    private $nombre;
    private $valor;
    private $n;

    public function __construct($cant = '', $nombre = '', $valor = '')
    {

        $tam = strlen($nombre);
        if($tam>0){
            $cade=substr($nombre,0,30);
            $this -> nombre = $cade;
            $this -> cant = $cant;
            $this -> valor = $valor;
            $this -> n = "";
        }if(($tam>30) && ($tam<60)){
          $cade=substr($nombre,30,60);
          $this -> n = new producto("",$cade,"");
        }if(($tam>60) && ($tam<90)){
          $cade=substr($nombre,60,90);
          $this -> n = new producto("",$cade,"");
        }
        
    }
    
    public function __toString()
    {
        
        $leftCols = 6;
        $centerCols = 30;
        $rightCols = 12;

        $left = str_pad($this -> cant, $leftCols,' ', STR_PAD_BOTH);
        $center = str_pad($this -> nombre, $centerCols);
        $right = str_pad($this -> valor, $rightCols, ' ', STR_PAD_LEFT);
        return "$left$center$right\n".$this -> n."";
    }
}
class linea
{
    private $izq;
    private $der;

    public function __construct($izq = '', $der = '')
    {
        $this -> izq = $izq;
        $this -> der = $der;
    }
    
    public function __toString()
    {
        $leftCols = 40;
        $rightCols = 8;

        $left = str_pad($this -> izq, $leftCols);
        $right = str_pad($this -> der, $rightCols, '=', STR_PAD_LEFT);
        return "$left$right\n";
    }
}

class cambio
{
    private $texto;
    private $valor;
    private $tipo;

    public function __construct($texto = '', $valor = '', $tipo = '')
    {
        $this -> texto = $texto;
        $this -> valor = $valor;
        $this -> tipo = $tipo;
    }
    
    public function __toString()
    {
        
        $leftCols = 10;
        $centerCols = 20;
        $rightCols = 18;

        $left = str_pad($this -> texto, $leftCols);
        $center = str_pad($this -> valor, $centerCols,' ', STR_PAD_LEFT);
        $right = str_pad($this -> tipo, $rightCols, ' ', STR_PAD_LEFT);
        return "$left$center$right\n";
    }
}