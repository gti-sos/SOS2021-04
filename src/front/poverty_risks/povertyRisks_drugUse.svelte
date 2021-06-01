<script>

    
//Funcion para la toma de datos e incluirlos en la gráfica
var BASE_API_PATH = '/api/v1/poverty_risks';

var povertyRisks_data = [];
var drugUse_data = [];
var anyos = [];
var inicio = 2014;
var fin = 2019;
var conjuntoAnyos = new Set(anyos);
var datosGrafica = [];
var datosGraficaDrugUse = [];

//Declaramos los arrays que incluirán a cada uno de los paise


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


async function tomaDatosGraficaDrugUse(datos){
    console.log("SE EJECUTA tomaDatosGraficaDrugUse");
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
            name : "drugUse",
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
                arrayAux.push(parseFloat(dato["dupopulation"])*1000);
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
      "proxyHeroku/api/v1/du-stats/loadInitialData"
      );

      const res2 = await fetch(
      "proxyHeroku/api/v1/du-stats"
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
      

      //Tomamos los datos

      datosGrafica = await tomaDatosGrafica(povertyRisks_data);
      datosGraficaDrugUse = await tomaDatosGraficaDrugUse(drugUse_data);
      //console.log(rangoAnyos(inicio,fin));

    //Construccion de la grafica
    Highcharts.chart('container', {
  chart: {
    type: 'area'
  },
  title: {
    text: 'Integración 01 poverty risks con drugUse'
  },
  subtitle: {
    text: ''
  },
  xAxis: {
    categories: anyos,
    tickmarkPlacement: 'on',
    title: {
      enabled: false
    }
  },
  yAxis: {
    title: {
      text: 'People'
    },
    labels: {
      formatter: function () {
        return this.value / 1000;
      }
    }
  },
  tooltip: {
    split: true,
    valueSuffix: ' millions'
  },
  plotOptions: {
    area: {
      stacking: 'normal',
      lineColor: '#666666',
      lineWidth: 1,
      marker: {
        lineWidth: 1,
        lineColor: '#666666'
      }
    }
  },
  series: [datosGrafica,datosGraficaDrugUse]
});

}

</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js" on:load={cargaGrafica}></script> 
    
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
          Integración poverty risks con drug use
        </p>
    </figure>
</main>

<style>

</style>