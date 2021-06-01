<script>

    
//Funcion para la toma de datos e incluirlos en la gráfica
var BASE_API_PATH = '/api/v1/poverty_risks';

var parqueMovil_data = [];
var anyos = [];
var inicio = 2014;
var fin = 2019;
var conjuntoAnyos = new Set(anyos);
var datosGrafica = [];

//Declaramos los arrays que incluirán a cada uno de los paise


//Variables para mensajes al usuario
var mensajeCorrecto = "";
var mensajeError = "";

//Funciones auxiliares


async function tomaDatosGrafica(datos){
  console.log("SE EJECUTA tomaDatosGrafica");  


    var datosFiltradosAnyo = datos.filter((e)=>{
        return e.Año >= inicio;
    });

   //Creamos variables auxiliares
   var array = [];
   var arrayAux = [];
   var arraySumador = [];
   var objeto = {};
    var anyos = rangoAnyos(inicio,fin);
    var a = 0;

    objeto = {
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
            //console.log(dato.Año);
            //console.log(dato.Unidades);
            if(dato.Año == a){ //Si coincide con el año ("a") se toma el valor del atributo pasado por parametro
                arrayAux.push(dato["Unidades"]);
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
      "https://datos.alcobendas.org/dataset/cd9382b9-751c-42cb-9295-6dd5bcc32bec/resource/3835a7cb-2bd0-45cc-8cb6-961be66f205f/download/parque-movil-de-alcobendas.json"
      );
      if (res.ok) {
        var json = await res.json();
        if(json.length===undefined){
          parqueMovil_data = [];
          parqueMovil_data.push(json);          
        }
        else{
          parqueMovil_data = json;
        }
        mensajeError="";
        mensajeCorrecto="Datos cargados correctamente"
      } else {
        if (res.status === 500) {
          mensajeError = "No se ha podido acceder a la base de datos";
          console.log("No");
        }
        if (parqueMovil_data.length === 0) {
          mensajeError = "No hay datos disponibles";
          console.log("No")
        }
        
      }

      console.log(parqueMovil_data);
      

      //Tomamos los datos

      datosGrafica = await tomaDatosGrafica(parqueMovil_data);
      //console.log(rangoAnyos(inicio,fin));

    //Construccion de la grafica
    var options = {
          series: datosGrafica.data,
          chart: {
          width: 380,
          type: 'pie',
        },
        labels: rangoAnyos(inicio,fin),
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
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