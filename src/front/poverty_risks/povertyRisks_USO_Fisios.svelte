<script>

    
//Funcion para la toma de datos e incluirlos en la gráfica
var BASE_API_PATH = '/api/v1/poverty_risks';

var fisios_data = [];
var anyos = [];
var inicio = 2014;
var fin = 2018;
var conjuntoAnyos = new Set(anyos);
var datosGrafica = [];

//Declaramos los arrays que incluirán a cada uno de los paise


//Variables para mensajes al usuario
var mensajeCorrecto = "";
var mensajeError = "";

//Funciones auxiliares


async function tomaDatosGrafica(datos){
  console.log("SE EJECUTA tomaDatosGrafica");  

   //Creamos variables auxiliares
   var array = [];
   var arrayAux = [];
   var arraySumador = [];
   var objeto = {};
    var anyos = rangoAnyos(inicio,fin);
    var a = 0;
    var datosTotales;

    
        console.log(datos);
        datosTotales=datos[0].Data;
    //Iteramos por cada año del rango establecido
    for(var anyo in anyos){
        //Pillamos el año
        a=anyos[anyo];
        //Limpiamos variables
        arrayAux=[];
        console.log(a);
        //Iteramos sobre los datos para comprobar si su año coincide con el establecido
        for(var num in datosTotales){
            var dato = datosTotales[num]; //Tomamos el dato que estamos iterando
            if(dato.NombrePeriodo == a.toString()){ //Si coincide con el año ("a") se toma el valor del atributo pasado por parametro
              objeto = {
            x : dato.NombrePeriodo,
            y : dato.Valor
                }
            } 
       }
       array.push(objeto);
      //  console.log("ArrayAux"+ a+ ": " + arrayAux);
      //  arraySumador.push(arrayAux.reduce((a, b) => a + b, 0));
      //  console.log("arraySumador: " + arraySumador);
    }
    /* for(var e in arraySumador){
    objeto.data.push(arraySumador[e]);
    } */
  
    //Pusheamos al array final
    
    console.log("objetoFisios:");
    console.log(objeto);
    console.log(array);

    return array;    
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

    const res = await fetch(
      "https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/t15/p416/a2018/s09001.px?tip=AM");
      
      if (res.ok) {
        var json = await res.json();
        if(json.length===undefined){
          fisios_data = [];
          fisios_data.push(json);          
        }
        else{
          fisios_data = json;
        }
        mensajeError="";
        mensajeCorrecto="Datos cargados correctamente"
      } else {
        if (res.status === 500) {
          mensajeError = "No se ha podido acceder a la base de datos";
          console.log("No");
        }
        if (fisios_data.length === 0) {
          mensajeError = "No hay datos disponibles";
          console.log("No")
        }
        
      }

      console.log(fisios_data);
      
      //Tomamos los datos

      datosGrafica = await tomaDatosGrafica(fisios_data);
      //console.log(rangoAnyos(inicio,fin));

    //Construccion de la grafica
    var options = {
          series: [
          {
            data: datosGrafica
          }
        ],
          legend: {
          show: false
        },
        chart: {
          height: 350,
          type: 'treemap'
        },
        title: {
          text: 'Fisioterapeutas colegiados por año',
          align: 'center'
        },
        colors: [
          '#3B93A5',
          '#F7B844',
          '#ADD8C7',
          '#EC3C65',
          '#C1F666',
          '#D43F97'
        ],
        plotOptions: {
          treemap: {
            distributed: true,
            enableShades: false
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