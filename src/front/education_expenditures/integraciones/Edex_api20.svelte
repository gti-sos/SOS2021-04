<script>
import {onMount} from "svelte";



var BASE_API_PATH = '/api/v1/education_expenditures';

var RESEARCH_API_PATH = '/proxyHerokuEdex/api/v2/foundsresearchsources-stats';

   

//////////////////////////////////////////
//Funciones Cargar grafica y datos Api's//
//////////////////////////////////////////

//Variables comunes

var edex_data = [];
var r_data = [];
var research_data = [];
var inicio = 2014;
var fin = 2017;
var anyos = rangoAnyos(inicio,fin);


async function tomaDatosGrafica(datos,atributo){ //Esta funcion hace la media por años y 
    

    //Filtramos para usar datos seleccionados a partir de año de inicio
    var datosFiltradosAnyo = datos.filter((e)=>{
        return e.year >= inicio;
    });

    console.log("Datos filtrados:" + datosFiltradosAnyo);

    //Creamos variables auxiliares
    var arrayTotal = [];
    
    var anyos = rangoAnyos(inicio,fin);
    var a = 0;

    var mediaPorAnyo = 0;
    var arrayFinal = [];
    var contador0 = 0;
    var contadorDist = 0;

    //Iteramos por cada año del rango establecido
    for(var anyo in anyos){
        //Pillamos el año
        a=anyos[anyo];
        //Limpiamos variables
        mediaPorAnyo = 0;
        arrayTotal=[];
        
        //Iteramos sobre los datos para comprobar si su año coincide con el establecido
        for(var num in datosFiltradosAnyo){
            var dato = datosFiltradosAnyo[num]; //Tomamos el dato que estamos iterando
            if(dato.year == a){ //Si coincide con el año ("a") se toma el valor del atributo pasado por parametro
                arrayTotal.push(dato[atributo]);
            }
            else{
                arrayTotal.push(0);
            }
       }

       console.log("Total edex " + num +" " + arrayTotal);
       
       //Hacemos la media por años

       for(var i = 0; i < arrayTotal.length; ++i){
        if(arrayTotal[i] == 0)
            contador0++;
        else
            contadorDist++;
        }


       for(var num in arrayTotal){
           mediaPorAnyo += arrayTotal[num];
       }

       if(contador0 == anyos.length){
           mediaPorAnyo = 0;
       }
       else{
           mediaPorAnyo = mediaPorAnyo / contadorDist;
       }

       mediaPorAnyo = Math.round(mediaPorAnyo);

       var objeto = {x: a, y: mediaPorAnyo};


       //Pusheamos al array final
       arrayFinal.push(objeto);
    }

    return arrayFinal;
}



async function cargaGrafica(){

    const res_ee = await fetch(BASE_API_PATH);
    const res_r = await fetch(RESEARCH_API_PATH);

    if (res_ee.ok){
        var json_ee = await res_ee.json();
        
        if(json_ee.length===undefined){
        edex_data = [];
        edex_data.push(json_ee);          
        }
        else{
        edex_data = json_ee;
        }

    }
    if(res_r.ok){
        var json_r = await res_r.json();

        if(json_r.length===undefined){
            console.log("Aqui llega undefined javi");
        r_data = [];
        r_data.push(json_r);          
        }
        else{
        console.log("Aqui llegan datos javi");
        console.log("longitud:" + json_r.length);
        r_data = json_r;
        console.log(json_r);
        }

    }

    
    /*tomamos los años y el dato a buscar de los elementos seleccionados
    for(var elemento in edex_data){
        console.log(elemento);
        anyos.push(edex_data[elemento].year);
        data_clasif.push(edex_data[elemento][datoClasif]);
    }
    console.log("años: " + anyos);
    console.log("datos " + datoClasifEsp + ":" + data_clasif);
    conjuntoAnyos = new Set(anyos);
    anyos = [...conjuntoAnyos];*/

    //Tomamos los datos

    var datosGrafica_edex = await tomaDatosGrafica(edex_data,"education_expenditure_per_public_expenditure");
    console.log("edex final:" + datosGrafica_edex);
    var datosGrafica_r    = await tomaDatosGrafica(r_data,"percentage_of_government_funding");
    console.log("research final:" + datosGrafica_r);

    /*Creamos los objetos que se le pasarán a la gráfica
      Los datos deben tener el siguiente aspecto:

    , {
		type: "column",
		name: "Proven Oil Reserves (bn)",
		legendText: "Proven Oil Reserves",
		showInLegend: true, 
		dataPoints:[
			{ label: "Saudi", y: 266.21 },
			{ label: "Venezuela", y: 302.25 },
			{ label: "Iran", y: 157.20 },
			{ label: "Iraq", y: 148.77 },
			{ label: "Kuwait", y: 101.50 },
			{ label: "UAE", y: 97.8 }
		]
	}
        Nota: mantener id's para sonidos  
    */

    var obj_edex = {
		type: "column",	
		name: "Gastos en educación por gasto público",
		legendText: "Gastos en educación por gasto público",
		axisYType: "secondary",
		showInLegend: true,
		dataPoints:datosGrafica_edex
	};
    
    var obj_research = {
		type: "column",	
		name: "Porcentaje de financiamiento ",
		legendText: "Porcentaje de financiamiento",
		axisYType: "secondary",
		showInLegend: true,
		dataPoints:datosGrafica_r
	};

    var graphic_data = [];

    graphic_data.push(obj_edex);
    graphic_data.push(obj_research);

    console.log("Serie objetos: " + JSON.stringify(graphic_data));

    //Incluimos los años en formato string en un vector
    
    var anyosGraphic = [];
    var aux = "";

    for(var a in anyos){
        aux = String(anyos[a]);
        anyosGraphic.push(aux);
    }
    console.log("años grafica:" + anyosGraphic);
 //Graphic sound options

// Sonification options
var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	title:{
		text: "Porcentaje de gasto en educación vs Porcentaje de gasto en financiamiento"
	},	
	axisY: {
		
		titleFontColor: "#4F81BC",
		lineColor: "#4F81BC",
		labelFontColor: "#4F81BC",
		tickColor: "#4F81BC"
	},
	axisY2: {
		
		titleFontColor: "#C0504E",
		lineColor: "#C0504E",
		labelFontColor: "#C0504E",
		tickColor: "#C0504E"
	},	
	toolTip: {
		shared: true
	},
	legend: {
		cursor:"pointer",
		itemclick: toggleDataSeries
	},
	data: graphic_data
});
chart.render();
}

function toggleDataSeries(e) {
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else {
		e.dataSeries.visible = true;
	}
	chart.render();
}

// Funciones auxiliares

function rangoAnyos(inic,fin){
    var rango = [];
    for(var i = inic; i<=fin;i++){
        rango.push(i);
    }
    return rango;
}

</script>

<svelte:head>

    <script src="https://canvasjs.com/assets/script/canvasjs.min.js" on:load="{cargaGrafica}"></script>

</svelte:head>

<main>
    <div id="chartContainer" style="height: 370px; width: 100%;"></div>

</main>

<style>

</style>