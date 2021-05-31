<script>
import { onMount } from "svelte";
import { each } from "svelte/internal";
import ApexCharts from 'apexcharts';


    
//Funcion para la toma de datos e incluirlos en la gráfica
var BASE_API_PATH = '/api/v1/poverty_risks';

var povertyRisks_data = [];
var natalityStats_data = [];
var anyos = [];
var inicio = 2014;
var fin = 2019;
var conjuntoAnyos = new Set(anyos);
var datosGrafica = [];
var datosGraficaNatalityStats = [];

//Declaramos los arrays que incluirán a cada uno de los paise


/*switch (datoClasif){
    case "people_in_risk_of_poverty":
        datoClasifEsp = "Personas en riesgo de pobreza";
        break;
    case "people_poverty_line":
        datoClasifEsp = "Índice de riesgo de pobreza (persona)";
        break;
    case "home_poverty_line":
        datoClasifEsp = "Índice de riesgo de pobreza (hogar)";
        break;
    default:
        datoClasifEsp="Porcentaje población en riesgo de pobreza";

}*/

//Variables para mensajes al usuario
var mensajeCorrecto = "";
var mensajeError = "";

//Funciones auxiliares


async function tomaDatosGrafica(datos){
  console.log("SE EJECUTA tomaDatosGrafica");  


    var datosFiltradosAnyo = datos.filter((e)=>{
        return e.year >= inicio;
    });

   //Creamos variables auxiliares
   var array = [];
   var arrayAux = [];
   var arraySumador = [];
   var objeto = {};
    var anyos = rangoAnyos(inicio,fin);
    var a = 0;

    objeto = {
            name : "people_in_risk_of_poverty",
            data : []
        }

    //Iteramos por cada año del rango establecido
    for(var anyo in anyos){
        //Pillamos el año
        a=anyos[anyo];
        //Limpiamos variables
        arrayAux=[];
        
        //Iteramos sobre los datos para comprobar si su año coincide con el establecido
        for(var num in datosFiltradosAnyo){
            var dato = datosFiltradosAnyo[num]; //Tomamos el dato que estamos iterando
            if(dato.year == a){ //Si coincide con el año ("a") se toma el valor del atributo pasado por parametro
                arrayAux.push(dato["people_in_risk_of_poverty"]);
            }
            else{
                arrayAux.push(0);
            }
       }
      //  console.log("ArrayAux"+ a+ ": " + arrayAux);
        arraySumador.push(arrayAux.reduce((a, b) => a + b, 0));
      //  console.log("arraySumador: " + arraySumador);
    }
    for(var e in arraySumador){
    objeto.data.push(arraySumador[e]);
    }
  
    //Pusheamos al array final
    //array.push(objeto);
    console.log("objetoPovertyRisks");
    console.log(objeto);
    //console.log(array);

    return objeto;    
}


async function tomaDatosGraficaNatalityStats(datos){
    console.log("SE EJECUTA tomaDatosGraficaNatalityStats");
    var datosFiltradosAnyo = datos.filter((e)=>{
        return e.year >= inicio;
    });

   //Creamos variables auxiliares
   var array = [];
   var arrayAux = [];
   var arraySumador = [];
   var objeto = {};
    var anyos = rangoAnyos(inicio,fin);
    var a = 0;

    objeto = {
            name : "natalityStats",
            data : []
        }

    //Iteramos por cada año del rango establecido
    for(var anyo in anyos){
        //Pillamos el año
        a=anyos[anyo];
        //Limpiamos variables
        arrayAux=[];
        
        //Iteramos sobre los datos para comprobar si su año coincide con el establecido
        for(var num in datosFiltradosAnyo){
            var dato = datosFiltradosAnyo[num]; //Tomamos el dato que estamos iterando
            if(dato.year == a){ //Si coincide con el año ("a") se toma el valor del atributo pasado por parametro
                arrayAux.push(dato["born"]*1000);
            }
            else{
                arrayAux.push(0);
            }
       }
      //  console.log("ArrayAuxDrugUse"+ a+ ": " + arrayAux);
        arraySumador.push(arrayAux.reduce((a, b) => a + b, 0));
      //  console.log("arraySumadorDrugUse: " + arraySumador);
    }
    
    for(var e in arraySumador){
    objeto.data.push(arraySumador[e]);
    }
  
    //Pusheamos al array final
    //array.push(objeto);
    console.log("objetoDrugUse");
    console.log(objeto);
    //console.log(array);

    return objeto; 
}


function rangoAnyos(inic,fin){
    var rango = [];
    for(var i = inic; i<=fin;i++){
        rango.push(i);
    }
    return rango;
}



//Funciones principales

async function cargaGrafica(){

    //Peticion de datos

    console.log("se ejecuta cargar grafica");
    var anyos = rangoAnyos(inicio,fin);
    console.log(anyos);

    await fetch(BASE_API_PATH +
      "/loadInitialData"
      );

    const res = await fetch(
      BASE_API_PATH
      );
      if (res.ok) {
        var json = await res.json();
        if(json.length===undefined){
          povertyRisks_data = [];
          povertyRisks_data.push(json);          
        }
        else{
          povertyRisks_data = json;
        }
        mensajeError="";
        mensajeCorrecto="Datos cargados correctamente"
      } else {
        if (res.status === 500) {
          mensajeError = "No se ha podido acceder a la base de datos";
          console.log("No");
        }
        if (povertyRisks_data.length === 0) {
          mensajeError = "No hay datos disponibles";
          console.log("No")
        }
        
      }

      await fetch(
      "http://sos2021-natality-stats.herokuapp.com/api/v2/natality-stats/loadinitialdata"
      );

      const res2 = await fetch(
      "http://sos2021-natality-stats.herokuapp.com/api/v2/natality-stats/"
      );
      if (res2.ok) {
        var json2 = await res2.json();
        if(json2.length===undefined){
          natalityStats_data = [];
          natalityStats_data.push(json2);          
        }
        else{
          natalityStats_data = json2;
        }
        mensajeError="";
        mensajeCorrecto="Datos de drugUse cargados correctamente"
      } else {
        if (res2.status === 500) {
          mensajeError = "No se ha podido acceder a la base de datos de drugUse";
          console.log("No");
        }
        if (natalityStats_data.length === 0) {
          mensajeError = "No hay datos disponibles en drugUse";
          console.log("No")
        }
        
      } 

      console.log(povertyRisks_data);
      console.log(natalityStats_data);
      

      //Tomamos los datos

      datosGrafica = await tomaDatosGrafica(povertyRisks_data);
      datosGraficaNatalityStats = await tomaDatosGraficaNatalityStats(natalityStats_data);
      //console.log(rangoAnyos(inicio,fin));

    //Construccion de la grafica
    var options = {
          series: [76, 67, 61, 90],
          chart: {
          height: 390,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '30%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              }
            }
          }
        },
        colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
        labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
        legend: {
          show: true,
          floating: true,
          fontSize: '16px',
          position: 'left',
          offsetX: 160,
          offsetY: 15,
          labels: {
            useSeriesColors: true,
          },
          markers: {
            size: 0
          },
          formatter: function(seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
          },
          itemMargin: {
            vertical: 3
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
                show: false
            }
          }
        }]
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();

}

</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js" on:load={cargaGrafica}></script> 
    
</svelte:head>

<main>
    <!-- <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
          Integración poverty risks con drug use
        </p>
    </figure> -->
</main>

<style>

</style>