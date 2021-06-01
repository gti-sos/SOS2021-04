<script>

    
//Funcion para la toma de datos e incluirlos en la gráfica
var BASE_API_PATH = '/api/v1/poverty_risks';

var povertyRisks_data = [];
var natalityStats_data = [];
var anyos = [];
var inicio = 2014;
var fin = 2019;
var stringAnyos = [];
var datosGrafica = [];
var datosGraficaNatalityStats = [];

//Variables para mensajes al usuario
var mensajeCorrecto = "";
var mensajeError = "";


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
        return e.date >= inicio;
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
            if(dato.date == a){ //Si coincide con el año ("a") se toma el valor del atributo pasado por parametro
                arrayAux.push(dato["born"]);
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
      "proxyHerokuNatalityStats/api/v2/natality-stats/loadinitialdata"
      );

      const res2 = await fetch(
      "proxyHerokuNatalityStats/api/v2/natality-stats/"
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
          series: [datosGrafica,datosGraficaNatalityStats],
          chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: anyos,
        },
        yaxis: {
          title: {
            text: '$ (thousands)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " thousands"
            }
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
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