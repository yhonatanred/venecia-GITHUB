<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-xsrf-token");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

require __DIR__ . '/ticket/autoload.php';
use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

//RECIBE INFORMACION ENVIA DESDE OTRA UBICACIÓN O ARCHIVO
$json = $_REQUEST['facturaZJson'];
$datos = json_decode($json);

estructurarZeta($datos);

function estructurarZeta($datos_zeta){

//CAPTURO LA INFORMACION BASICA DEL NEGOCIO
$infoNegocio = $datos_zeta->{'infoNegocio'};

$nombreEmpresa =  $infoNegocio->{'nombre'};
$nitEmpresa = $infoNegocio->{'nit'};
$subnombre = $infoNegocio->{'subnombre'};
//$zNumero = "1";//SE COMENTA PORQUE AUN NO SE TIENE EL CONSECUTIVO DE LAS ZETAS EN LA BD
$date = date('d-m-Y');//fecha -->dia, mes, año

//CAPTURO LA INFORMACION DEL TOTAL DE LAS FACTURAS IMPRESAS
$infoFacturas = $datos_zeta->{'facturas'};

$facturaFinal = $infoFacturas->{'facturaFinal'};
$facturaInicial = $infoFacturas->{'facturaInicial'};
$cantidad = $infoFacturas->{'total'};

//CAPTURO LA INFORMACION DE LAS VENTAS
$infoVentas = $datos_zeta->{'venta'};
$ventasSinImp = $infoVentas->{'ventas'};
$descuento = $datos_zeta->{'descuentos'};

$ventaNeta = $datos_zeta->{'ventaNeta'};
$impuesto="0";

$iva = "0";
$gravado = $datos_zeta->{'ventaNeta'};

$ventaTotal = $datos_zeta->{'ventaNeta'};
$servicioOpcional = $datos_zeta->{'propina'};
$valorDomicilio = "0";
$recaudo="0";

$total = $datos_zeta->{'total'};


//cuadre de valores
$efectivo = $datos_zeta->{'efectivo'};
$tarjeta = $datos_zeta->{'tarjeta'};
$credito = $datos_zeta->{'creditos'};
$mixto = "0";
/*
imprimirZeta($nombreEmpresa, $nitEmpresa, $subnombre, $date, $facturaFinal, $facturaInicial, $cantidad, $ventasSinImp, $descuento, $ventaNeta, $impuesto, $iva, $gravado, $ventaTotal, $servicioOpcional, $valorDomicilio, $recaudo, $total, $efectivo, $tarjeta, $credito, $mixto);
*/
//LINEAS DE PRUEBAS
/* Name of shop */
print($nombreEmpresa."<br>");
print($subnombre."<br>");
print($nitEmpresa."<br>");
print($date."<br>");
print(new datos('Factura Final:', $facturaFinal)."<br>");
print(new datos('Factura Inicial:', $facturaInicial)."<br>");
print(new datos('Cantidad:', $cantidad)."<br>");
print(new datos('Venta Sin Imp:', $ventasSinImp)."<br>");
print(new datos('Descuento:', $descuento)."<br>");
print(new linea('', '')."<br>");
print(new datos('Venta Neta:', $ventaNeta)."<br>");
print(new datos('Impuesto:', $impuesto)."<br>");
print(new linea('', '')."<br>");
print(new datos('Venta Total:', $ventaTotal)."<br>");
print(new datos('Ser. Opcional:', $servicioOpcional)."<br>");
//$printer -> text(new datos('Vr. Domicilios:', $valorDomicilio));
print(new datos('Recaudo:', $recaudo)."<br>");
print(new linea2('', '')."<br>");
print(new datos('Total:', $total)."<br>");
print(new linea2('', '')."<br>");
print("******CUADRE******<br>");
print(new datos('Efectivo:', $efectivo)."<br>");
print(new datos('Tarjeta:', $tarjeta)."<br>");
print(new datos('Credito:', $credito)."<br>");
//print(new datos('Mixto:', $mixto)."<br>");
print(new linea2('', '')."<br>");
print(new datos('TOTAL:', $total)."<br>");
print(new linea2('', '')."<br>");
print("******DETALLE IVA:  %******<br>");
print(new datos('IVA:', $iva)."<br>");
print(new datos('GRAVADO:', $gravado)."<br>");

}//FIN DE LA FUNCION


function imprimirZeta($nombreEmpresa, $nitEmpresa, $subnombre, $date, $facturaFinal, $facturaInicial, $cantidad, $ventasSinImp, $descuento, $ventaNeta, $impuesto, $iva, $gravado, $ventaTotal, $servicioOpcional, $valorDomicilio, $recaudo, $total, $efectivo, $tarjeta, $credito, $mixto){
    /* Fill in your own connector here */
$connector = new WindowsPrintConnector("SAT SAT38TUSE1");
$printer = new Printer($connector);


/* Print top logo */
$printer -> setJustification(Printer::JUSTIFY_CENTER);
/* Name of shop */
$printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
$printer -> text("$nombreEmpresa\n");
$printer -> selectPrintMode();
$printer -> text("$subnombre\n");
$printer -> text("$nitEmpresa\n");
$printer -> feed();
$printer -> setJustification(Printer::JUSTIFY_LEFT);
//$printer -> text(new item('Z caja No:', $zNumero));//SE COMENTA PORQUE AÚN NO SE HA CAPTURADO EL CONSECUTIVO DE LAS ZETAS EN LA BD
$printer -> setJustification(Printer::JUSTIFY_CENTER);
$printer -> text("$date\n");
$printer -> feed();
$printer -> setJustification(Printer::JUSTIFY_LEFT);
$printer -> text(new datos('Factura Final:', $facturaFinal));
$printer -> text(new datos('Factura Inicial:', $facturaInicial));
$printer -> text(new datos('Cantidad:', $cantidad));
$printer -> feed();
$printer -> feed();
$printer -> text(new datos('Venta Sin Imp:', $ventasSinImp));
$printer -> text(new datos('Descuento:', $descuento));
$printer -> text(new linea('', ''));
$printer -> text(new datos('Venta Neta:', $ventaNeta));
$printer -> text(new datos('Impuesto:', $impuesto));
$printer -> text(new linea('', ''));
$printer -> text(new datos('Venta Total:', $ventaTotal));
$printer -> text(new datos('Ser. Opcional:', $servicioOpcional));
//$printer -> text(new datos('Vr. Domicilios:', $valorDomicilio));
$printer -> text(new datos('Recaudo:', $recaudo));
$printer -> text(new linea2('', ''));
$printer -> text(new datos('Total:', $total));
$printer -> text(new linea2('', ''));
$printer -> feed();
$printer -> text("******CUADRE******\n");
$printer -> text(new datos('Efectivo:', $efectivo));
$printer -> text(new datos('Tarjeta:', $tarjeta));
$printer -> text(new datos('Credito:', $credito));
//$printer -> text(new datos('Mixto:', $mixto));
$printer -> text(new linea2('', ''));
$printer -> text(new datos('TOTAL:', $total));
$printer -> text(new linea2('', ''));
$printer -> feed();
$printer -> feed();
$printer -> text("******DETALLE IVA:  %******\n");
$printer -> text(new datos('IVA:', $iva));
$printer -> text(new datos('GRAVADO:', $gravado));
$printer -> feed();
$printer -> feed();
/*
$printer -> text("------------------  RECAUDOS  ------------------");
$printer -> text(" FACTURA             VALOR                  TIPO");
$printer -> text("------------------------------------------------");
$printer -> feed();
$printer -> setJustification(Printer::JUSTIFY_LEFT);
foreach ($facturas as $factura) {
    $printer -> setJustification(Printer::JUSTIFY_LEFT);
    $printer -> text($factura);
}
$printer -> feed();
$printer -> text(new datos('TOTAL:', $total));
$printer -> feed();
$printer -> feed();
*/
$printer -> cut();
$printer -> pulse();
$printer -> close();

}//FIN DE LA FUNCION IMPRIMIRZETA



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
        $leftCols = 23;
        
        $left = str_pad($this -> llave, $leftCols) ;
        $right = str_pad($this -> valor, $rightCols," ",STR_PAD_LEFT);
        return "$left$right\n";
    }
}

class factura
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
        
        $leftCols = 20;
        $centerCols = 10;
        $rightCols = 18;

        $left = str_pad($this -> cant, $leftCols);
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
        $leftCols = 20;
        $rightCols = 18;

        $left = str_pad($this -> izq, $leftCols);
        $right = str_pad($this -> der, $rightCols, '-', STR_PAD_LEFT);
        return "$left$right\n";
    }
}

class linea2
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
        $leftCols = 20;
        $rightCols = 18;

        $left = str_pad($this -> izq, $leftCols);
        $right = str_pad($this -> der, $rightCols, '=', STR_PAD_LEFT);
        return "$left$right\n";
    }
}