<script>
    import {onMount} from "svelte";
    
    
    
    var BASE_API_PATH = '/api/v1/education_expenditures';
    
    var EXTERNAL_API_PATH = 'https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/t15/p416/a2018/s05001.px?tip=AM';
    
       
    
    //////////////////////////////////////////
    //Funciones Cargar grafica y datos Api's//
    //////////////////////////////////////////
    
    //Variables comunes
    
    var edex_data = [];
    var ex_data = [];
   
    var inicio = 2014;
    var fin = 2017;
    var anyos = rangoAnyos(inicio,fin);
    
    
    async function tomaDatosGrafica(datos,atributo){ //Esta funcion hace la media por años y 
        
    
        //Filtramos para usar datos seleccionados a partir de año de inicio
        var datosFiltradosAnyo = datos.filter((e)=>{
            return e.year >= inicio;
        });
    
    
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

    async function tomaDatosGraficaexterna(datosExternos){
        
        //Tomamos los datos totales de colegiados hombres y mujeres
        var datosFiltradosTotal = datosExternos[0];
        var datosTotales = datosFiltradosTotal["Data"];


       
        var final = [];
        var arrayAux = [];
        var a = 0;

    for(var an in anyos){
        //Pillamos el año
        a=anyos[an];
        //Limpiamos variables
        arrayAux=[];
        //Iteramos sobre los datos para comprobar si su año coincide con el establecido
        for(var num in datosTotales){
            var dato = datosTotales[num]; //Tomamos el dato que estamos iterando
            if(parseInt(dato.NombrePeriodo) == a){ //Si coincide con el año ("a") se toma el valor del atributo pasado por parametro
            final.push({x:a, y:dato["Valor"]});
            } 
       }  
    }

        return final;
}
    
    
    
    async function cargaGrafica(){
    
        const res_ee = await fetch(BASE_API_PATH);
        const res_r = await fetch(EXTERNAL_API_PATH);
    
      

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
            ex_data = [];
            ex_data.push(json_r);          
            }
            else{

            ex_data = json_r;
    
            }
    
        }
    
        var datosGrafica_edex = await tomaDatosGrafica(edex_data,"education_expenditure_per_capita");
        var datosGrafica_ex    = await tomaDatosGraficaexterna(ex_data);

        console.log("edex: "+ JSON.stringify(datosGrafica_edex));
        console.log("ex: "+ JSON.stringify(datosGrafica_ex))
        
    
        //Incluimos los años en formato string en un vector
        
        var anyosGraphic = [];
        var aux = "";
    
        for(var a in anyos){
            aux = String(anyos[a]);
            anyosGraphic.push(aux);
        }
    
        var options = {
          series: [{
          name: 'Gasto en educación per capita',
          data: datosGrafica_edex,
        },{
          name: 'Quimicos colegiados',
          data: datosGrafica_ex,
        }],
          chart: {
          height: 350,
          type: 'radar',
          dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1
          }
        },
        title: {
          text: 'Gasto en educación per capita / Quimicos colegiados '
        },
        stroke: {
          width: 2
        },
        fill: {
          opacity: 0.1
        },
        markers: {
          size: 0
        },
        xaxis: {
          categories: ['2014', '2015', '2016', '2017']
        }
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
    
    
    }
     //Graphic sound options
    
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
        <script src="https://cdn.jsdelivr.net/npm/apexcharts" on:load="{cargaGrafica}"></script>

    </svelte:head>
    
    <main>

        <div id="chart">
        </div>
 
    </main>
    
    <style>
        @import url(https://fonts.googleapis.com/css?family=Roboto);

        body {
        font-family: Roboto, sans-serif;
        }
 
        #chart {
        max-width: 650px;
        margin: 35px auto
        }

    </style>