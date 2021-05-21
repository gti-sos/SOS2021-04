<script>
    import { onMount } from "svelte";
    import { each } from "svelte/internal";
    
    
        
    //Funcion para la toma de datos e incluirlos en la gráfica
    var BASE_API_PATH = '/api/v1/illiteracy';
    
    var edex_data = [];
    var anyos = [];
    var paises = [];
    var inicio = 2013;
    var fin = 2020;
    var data_clasif = [];
    var clasif = ["female_illiteracy_rate","male_illiteracy_rate",
    "adult_illiteracy_rate","young_illiteracy_rate",];
    var datoClasif = clasif[Math.floor(Math.random()*clasif.length)];
    var datoClasifEsp = "";
    var conjuntoAnyos = new Set(anyos);
    var datosGrafica = [];
    
    //Declaramos los arrays que incluirán a cada uno de los paise
    
    
    switch (datoClasif){
        case "female_illiteracy_rate":
            datoClasifEsp = "Tasa de Alfabetización en Mujeres";
            break;
        case "male_illiteracy_rate":
            datoClasifEsp = "Tasa de Alfabetización en Hombres";
            break;
        case "adult_illiteracy_rate":
            datoClasifEsp = "Tasa de Alfabetización en Adultos";
            break;
        default:
            datoClasifEsp="Tasa de Alfabetización";
    
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
    
    
    
    async function getData(){
        console.log("se ejecuta carga datos");
        const res = await fetch(
          BASE_API_PATH
          );
          if (res.ok) {
            var json = await res.json();
            if(json.length===undefined){
              edex_data = [];
              edex_data.push(json);          
            }
            else{
              edex_data = json;
            }
            mensajeError="";
            mensajeCorrecto="Datos cargados correctamente"
          } else {
            if (res.status === 500) {
              mensajeError = "No se ha podido acceder a la base de datos";
              console.log("No");
            }
            if (edex_data.length === 0) {
              mensajeError = "No hay datos disponibles";
              console.log("No")
            }
            
          } 
          console.log(edex_data);
          
          //tomamos los años y el dato a buscar de los elementos seleccionados
          for(var elemento in edex_data){
              console.log(elemento);
              anyos.push(edex_data[elemento].year);
              data_clasif.push(edex_data[elemento][datoClasif]);
          }
          console.log("años: " + anyos);
          console.log("datos " + datoClasifEsp + ":" + data_clasif);
          conjuntoAnyos = new Set(anyos);
          anyos = [...conjuntoAnyos];
    
          //Tomamos los datos
    
          datosGrafica = tomaDatosGrafica(edex_data);
    }
    
    async function cargaGrafica(){
    
        //Peticion de datos
    
        console.log("se ejecuta cargar grafica");
    
        const res = await fetch(
          BASE_API_PATH
          );
          if (res.ok) {
            var json = await res.json();
            if(json.length===undefined){
              edex_data = [];
              edex_data.push(json);          
            }
            else{
              edex_data = json;
            }
            mensajeError="";
            mensajeCorrecto="Datos cargados correctamente"
          } else {
            if (res.status === 500) {
              mensajeError = "No se ha podido acceder a la base de datos";
              console.log("No");
            }
            if (edex_data.length === 0) {
              mensajeError = "No hay datos disponibles";
              console.log("No")
            }
            
          } 
          console.log(edex_data);
          
          //tomamos los años y el dato a buscar de los elementos seleccionados
          for(var elemento in edex_data){
              console.log(elemento);
              anyos.push(edex_data[elemento].year);
              data_clasif.push(edex_data[elemento][datoClasif]);
          }
          console.log("años: " + anyos);
          console.log("datos " + datoClasifEsp + ":" + data_clasif);
          conjuntoAnyos = new Set(anyos);
          anyos = [...conjuntoAnyos];
    
          //Tomamos los datos
    
          datosGrafica = await tomaDatosGrafica(edex_data);
    
        //Construccion de la grafica
    
        Highcharts.chart('container', {
    
        title: {
            text: "Porcentaje de Población Mundial Alfabetizada"
    
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
                rangeDescription: 'Range:'+inicio+'  to 2016'
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
    
        });
    }
    
    function cambiaDato(nombre){
        datoClasif = nombre;
        cargaGrafica();
    
    }
    
    </script>
    
    <svelte:head>
    
        <script src="https://code.highcharts.com/highcharts.js" on:load={cargaGrafica} ></script>
        
        
    </svelte:head>
    
    <main>
        <figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description" style="font-size: 0.85em; text-align: center; padding:1em">
                    <em>'La Población que está Alfabetizada se considera a aquella que tienen la habilidad de leer, escribir y controlar los numeros con fluidez'</em>
                </p>
                <table id="datatable">
                    <thead></thead>
                    <tbody> <!--
                        <tr style="text-align: center;">
                            <h5>Haz Click sobre alguno de los botones para cambiar el dato de la gráfica</h5>
                        </tr>
                        <tr>
                            <td><button style="btn btn-primary" on:click={cambiaDato('education_expenditure_per_millions')}>Gasto en millones de dolares</button></td>
                            <td><button style="btn btn-primary" on:click={cambiaDato('education_expenditure_per_public_expenditure')}>% Gasto en educacion por gasto publico</button></td>
                            <td><button style="btn btn-primary" on:click={cambiaDato('education_expenditure_gdp')}>% Gasto en educacion por PIB</button></td>
                            <td><button style="btn btn-primary" on:click={cambiaDato('education_expenditure_per_capita')}>Gasto en educacion per capita</button></td>
                        </tr>
    
                    -->
                        
                    </tbody>
                </table>       
        </figure>
    </main>
    
    <style>
    .highcharts-figure, .highcharts-data-table table {
        min-width: 360px; 
        max-width: 800px;
        margin: 1em auto;
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