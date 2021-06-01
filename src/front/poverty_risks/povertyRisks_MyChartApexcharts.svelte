<script>
import { onMount } from "svelte";
import { each } from "svelte/internal";


    
//Funcion para la toma de datos e incluirlos en la gráfica
var BASE_API_PATH = '/api/v1/poverty_risks';

var povertyRisks_data = [];
var anyos = [];
var paises = [];
var inicio = 2014;
var fin = 2019;
var data_clasif = [];
var clasif = ["people_in_risk_of_poverty","people_poverty_line",
"home_poverty_line","percentage_risk_of_poverty"];
var datoClasif = clasif[Math.floor(Math.random()*clasif.length)];
var datoClasifEsp = "";
var conjuntoAnyos = new Set(anyos);
var datosGrafica = [];

//Declaramos los arrays que incluirán a cada uno de los paise


switch (datoClasif){
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

}

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

    await fetch(BASE_API_PATH+"/loadInitialData");
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
      console.log(povertyRisks_data);

      //Tomamos los datos

      datosGrafica = await tomaDatosGrafica(povertyRisks_data);
      console.log(datosGrafica);

    //Construccion de la grafica

    var options = {
          series: datosGrafica,
          chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          categories: rangoAnyos(inicio,fin)
        },
        tooltip: {
          x: {
          },
        },
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
        window.alert(datoClasifEsp);
        console.log(datoClasifEsp);
}


</script>

<svelte:head>

  <script src="https://cdn.jsdelivr.net/npm/apexcharts" on:load={cargaGrafica}></script>
    
    
</svelte:head>

<main>
  <div id="chart">
  </div>
</main>

<style>


</style>