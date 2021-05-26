<script>
import { onMount } from "svelte";
import { each } from "svelte/internal";


    
//Funcion para la toma de datos e incluirlos en la gráfica
var BASE_API_PATH = '/api/v1/poverty_risks';

var povertyRisks_data = [];
var drugUse_data = [];
var anyos = [];
var paises = [];
var inicio = 2014;
var fin = 2019;
var data_clasif = [];
var clasif = ["people_in_risk_of_poverty","people_poverty_line",
"home_poverty_line","percentage_risk_of_poverty"];
//var datoClasif = clasif[Math.floor(Math.random()*clasif.length)];
var datoClasifEsp = "";
var conjuntoAnyos = new Set(anyos);
var datosGrafica = [];

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
    
    var datosFiltradosAnyo = datos.filter((e)=>{
        return e.year >= inicio;
    });

    paises = new Array();
    var arrayTotal = [];
    var arrayAux1 = {};
    var arrayAux2 = [];
    var indice = 0;    

    for(var num in datosFiltradosAnyo){
        var dato = datosFiltradosAnyo[num]; //Tomamos el dato que estamos iterando

        if(paises.indexOf(dato.country)!=-1){ //Comprobamos si ya hemos pasado por ese país
            var arrayAux1 = {};
            var arrayAux2 = [];
            indice = paises.indexOf(dato.country);
            arrayAux1 = arrayTotal[indice]; //Guardamos aqui el array del país
            //Guardamos el par año,datoARepresentar
            arrayAux2.push(dato.year);
            arrayAux2.push(dato[datoClasif]);

            //Lo pusheamos al array1
            arrayAux1.data.push(arrayAux2);

            //Modificamos el valor en el general
            arrayTotal[indice] = arrayAux1;
        }
        else{
            //Quiere decir que es la primera vez que tomamos ese país
            arrayAux1 = {};
            arrayAux2 = [];
            
            //Añadimos el par año, datoARepresentar
            arrayAux2.push(dato.year);
            arrayAux2.push(dato[datoClasif]);

            //Lo pusheamos al array1 y luego al general
            arrayAux1= {
                name:dato.country,
                data:[] 
            }

            arrayAux1.data.push(arrayAux2);
            arrayTotal.push(arrayAux1);

            //Por ultimo añadimos el país a la lista de paises
            paises.push(dato.country);

        }
    }

    /*Una vez tenemos los datos de la siguiente manera
    
    general[pais1[[año,dato],[año,dato],..],pais2[[año,dato],[año,dato],..],[],...]
    
    debemos ir creando los objetos {name: pais, data: datos} de tal manera que data esté ordenado
    por años y en caso de no encontrarse el dato en algún año, el valor será null



    */
   
    var arrayFinal = [];
    var paisActual = "";
    var datosGraficaPorPais = [];
    var contador = 0;
    var objeto = {};
    var anyosAuxiliar = [];
    var rango=rangoAnyos(inicio,fin);

    for(var num1 in arrayTotal){
        contador = 0;
        anyosAuxiliar = [];
        arrayAux1 = {}; //Vaciamos el array auxiliar
        arrayAux2 = []; //Vaciamos el array auxiliar
        arrayAux1 = arrayTotal[num1]; //Guardamos el array del pais
        paisActual = paises[num1];
        datosGraficaPorPais = []; //Vaciamos el array de datos por pais

        //Ordenamos los datos por años
        arrayAux1.data.sort(compareNumbers);

        //Lo recorremos para tener en cuenta los años presentes

        for(var num2 in arrayAux1.data){
            anyosAuxiliar.push(arrayAux1.data[num2][0]); //Añadimos el año
        }

        //creamos el objeto que vamos a insertar en la gráfica
        
        for(var num3 in rango){
            
            if(anyosAuxiliar.indexOf(rango[num3])!=-1){
                datosGraficaPorPais.push(arrayAux1.data[contador][1]);
                contador++;
            }
            else{
                datosGraficaPorPais.push(0);
                //Añadimos CEROS a los años para los que NO tengamos datos
            }
        }
        
        //Ya con los datos completos, creamos entonces el objeto

        objeto = {
            name : paisActual,
            data : datosGraficaPorPais
        }

        arrayFinal.push(objeto);
    }
    console.log("Final:"+JSON.stringify(arrayFinal));

    return arrayFinal;    
}


function compareNumbers(a, b) {
  return a[0] - b[0];
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

      const res2 = await fetch(
      BASE_API_PATH
      );
      if (res2.ok) {
        var json2 = await res2.json();
        if(json2.length===undefined){
          drugUse_data = [];
          drugUse_data.push(json2);          
        }
        else{
          drugUse_data = json2;
        }
        mensajeError="";
        mensajeCorrecto="Datos de drugUse cargados correctamente"
      } else {
        if (res2.status === 500) {
          mensajeError = "No se ha podido acceder a la base de datos de drugUse";
          console.log("No");
        }
        if (drugUse_data.length === 0) {
          mensajeError = "No hay datos disponibles en drugUse";
          console.log("No")
        }
        
      } 

      console.log(povertyRisks_data);
      console.log(drugUse_data);
      
      //tomamos los años y el dato a buscar de los elementos seleccionados
     /* for(var elemento in povertyRisks_data){
          //console.log(elemento);
          anyos.push(povertyRisks_data[elemento].year);
          data_clasif.push(povertyRisks_data[elemento][datoClasif]);
      }
      console.log("años: " + anyos);
      console.log("datos " + datoClasifEsp + ":" + data_clasif);
      conjuntoAnyos = new Set(anyos);
      anyos = [...conjuntoAnyos];*/

      //Tomamos los datos

      datosGrafica = await tomaDatosGrafica(povertyRisks_data);
      datosGraficaDrugUse = await tomaDatosGraficaDrugUse(drugUse_data);

    //Construccion de la grafica
    
    /*
    Highcharts.chart('container', {

    title: {
        text: "Riesgo de pobreza a nivel mundial"

    },

    subtitle: {
        text: datoClasifEsp
    },

    yAxis: {
        title: {
            text: datoClasifEsp
        }
    },

    xAxis: {
        accessibility: {
            rangeDescription: 'Range:'+inicio+'  to 2019'
        }
    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: inicio
        }
    },

    series: datosGrafica,

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

    });*/

            Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Historic World Population by Region'
        },
        subtitle: {
            text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
        },
        xAxis: {
            categories: rango,
            title: {
            text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
            text: 'Population (millions)',
            align: 'high'
            },
            labels: {
            overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
            dataLabels: {
                enabled: true
            }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Year 1800',
            data: [107, 31, 635, 203, 2]
        }, {
            name: 'Year 1900',
            data: [133, 156, 947, 408, 6]
        }, {
            name: 'Year 2000',
            data: [814, 841, 3714, 727, 31]
        }, {
            name: 'Year 2016',
            data: [1216, 1001, 4436, 738, 40]
        }]
        });

}

function cambiaDato(nombre){
    datoClasif = nombre;
    cargaGrafica();

}

</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load={cargaGrafica} ></script>
    
    
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
          Bar chart showing horizontal columns. This chart type is often
          beneficial for smaller screens, as the user can scroll through the data
          vertically, and axis labels are easy to read.
        </p>
    </figure>
</main>

<style>
.highcharts-figure, .highcharts-data-table table {
  min-width: 310px; 
  max-width: 800px;
  margin: 1em auto;
}

#container {
  height: 400px;
}

.highcharts-data-table table {
	font-family: Verdana, sans-serif;
	border-collapse: collapse;
	border: 1px solid #EBEBEB;
	margin: 10px auto;
	text-align: center;
	width: 100%;
	max-width: 500px;
}
.highcharts-data-table caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}
.highcharts-data-table th {
	font-weight: 600;
  padding: 0.5em;
}
.highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
  padding: 0.5em;
}
.highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
  background: #f8f8f8;
}
.highcharts-data-table tr:hover {
  background: #f1f7ff;
}
</style>