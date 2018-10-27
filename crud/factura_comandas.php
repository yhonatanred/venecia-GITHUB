<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-xsrf-token");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
require __DIR__ . '/ticket/autoload.php';
use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

/* Fill in your own connector here */
//$connector = new WindowsPrintConnector("SAT SAT38TUSE");


/************************
*recibo informacion 
************************/
$json = $_REQUEST['comandaJson'];
$datos = json_decode($json);
enviar_a_comanda($datos);


/**************************************
    *FUNCION QUE ENVÍA DATOS A LA COMANDA
    ***************************************/
    function enviar_a_comanda($pedido){
        echo "envia pedido a comanda: ".$pedido->{'horaPedido'};;
        //$printer = new Printer($connector);
        /* variables para la impresion*/        
        date_default_timezone_set('America/Bogota');
        $date = date('d-m-Y');//fecha -->año-mes-dia
        $hora= $pedido->{'horaPedido'};
        $nombre_comanda= "";
        $nombre_mesa= $pedido->{'mesa'};
        $num_factura= $pedido->{'numFactura'}; 
        $bar = array();
        $cocina  = array();
        $pizzas  = array();
        //variables que representan las comandas
        $b = "bar";
        $c = "cocina";
        $p = "pizzas";
        //contadores para la posicion del array de cada comanda
        $contB = 0;//contador para bar
        $contC = 0;//contador para cocina
        $contP = 0;//contador para pizzas
        foreach ($pedido->{'productos'} as $prod ) {
            $cant = $prod->{'cantidad'};
            $gustos = "";
            foreach($prod->{'gustos'} as $gust){
                $gustos = $gustos." ,".$gust->{'nombreG'};
            }
            $nombre = $prod->{'nombreP'};//." (".$gustos.")";   
            echo $nombre;              
            $nombre_comanda = $prod->{'comanda'};
            if(strtoupper($nombre_comanda) == strtoupper($b)){
                $bar[$contB] = new item("".$cant, "".$nombre ); 
                ++$contB;
            }else if(strtoupper($nombre_comanda) == strtoupper($c)){
                $cocina[$contC] = new item("".$cant, "".$nombre ); 
                ++$contC;
            }else if(strtoupper($nombre_comanda) == strtoupper($p)){
                $pizzas[$contP] = new item("".$cant, "".$nombre ); 
                ++$contP;
            }
            
        }       
        
        /*****************************************************************************************
        **
        **AQUI PONGO EL NOMBRE DE CADA UNA DE LAS IMPRESORAS DE LAS COMANDAS (BAR, COCINA, PIZZAS)
        **
        *********************************************************************************************/
        if(sizeof($bar) > 0){//BAR
            $connector = new WindowsPrintConnector("SAT SAT38TUSE1");
            $printer = new Printer($connector);
            estructurarReporte($printer, $bar, "bar", $nombre_mesa, $num_factura, $date, $hora);
        }
        if(sizeof($cocina) > 0){//COCINA
            $connector = new WindowsPrintConnector("SAT SAT38TUSE1");
            $printer = new Printer($connector);
            estructurarReporte($printer, $cocina, "cocina", $nombre_mesa, $num_factura, $date, $hora);
        }
        if(sizeof($pizzas) > 0){//PIZZAS
           $connector = new WindowsPrintConnector("SAT SAT38TUSE1");
            $printer = new Printer($connector);
            estructurarReporte($printer, $pizzas, "pizzas", $nombre_mesa, $num_factura, $date, $hora);
        }
       
    }


/* Information for the receipt 
$items = array(
    new item("10", "Pantalon Especial Pequeño"),
    new item("0,5", "Pizza Hawaiana Grande"),
    new item("0,5", "Pizza Champiñones Y Pollo Grande"),
);*/

/*
$date = "21-sep-2017";
$hora=" 02:56 PM";
// Start the printer 
$printer = new Printer($connector);
$nombre_comanda="PIZZA";
$nombre_mesa="T3";
$num_factura="20938";
*/

/*********************************************************************************************************************************************
*FUNCION QUE ARMA LA ESTRUCTURA DE LA FACTURA. ARGUMENTOS:
* +printer: conexion de la impresora, +items: array que almacena los productos, +nombre_comanda: nombre de la comanda donde imprime,
* +nombre_mesa: mesa del pedido, +num_factura: numero de factura, +date: fecha, +hora: hora del pedido
**********************************************************************************************************************************************/
    function estructurarReporte($printer, $items, $nombre_comanda, $nombre_mesa, $num_factura, $date, $hora){
        /* Name of shop */
        $printer -> feed();
        $printer -> feed();
        $printer -> setTextSize(1, 2);
        $printer -> text("------------------------------------------------");
        $printer -> setTextSize(2, 2);
        $printer -> text("Comanda: $nombre_comanda");
        $printer -> feed();
        $printer -> feed();
        $printer -> selectPrintMode();
        $printer -> setTextSize(2, 2);
        $printer -> text("Mesa : $nombre_mesa");

        $printer -> feed();
        $printer -> feed();
        /* Items */
        $printer -> setTextSize(1, 2);
        $printer -> text("Factura: : $num_factura");
        $printer -> feed();
        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> setTextSize(1, 1);
        $printer -> text("Fecha:  $date  Hora:  $hora\n");
        $printer -> setTextSize(1, 2);
        $printer -> text("------------------------------------------------");
        $printer -> feed();
        $printer -> setJustification(Printer::JUSTIFY_LEFT);
        foreach ($items as $item) {
            $printer -> setJustification(Printer::JUSTIFY_LEFT);
            $printer -> setTextSize(2, 2);
            $printer -> text($item);
            $printer -> setJustification(Printer::JUSTIFY_LEFT);
            $printer -> feed();
            $printer -> feed();
        }
        $printer -> setTextSize(1,2);
        $printer -> text("------------------------------------------------");
        $printer -> feed();
        $printer -> feed();
        $printer -> feed();
        /* Cut the receipt and open the cash drawer */
        $printer -> cut();
        $printer -> pulse();

        $printer -> close();
    }



/* A wrapper to do organise item names & prices into columns */
class item
{
    private $name;
    private $price;
    private $dollarSign;

    public function __construct($name = '', $price = '')
    {
        $this -> name = $name;
        $this -> price = $price;
    }
    
    public function __toString()
    {
        $rightCols = 15;
        $leftCols = 4;
        
        $left = str_pad($this -> name, $leftCols) ;
        
        $right = str_pad($this -> price, $rightCols);
        return "$left- $right";
    }
}

?>