<script>

    var BASE_API_PATH_EE = 'http://sos2021-10.herokuapp.com/api/integration/obesity-stats';
    var BASE_API_PATH_I = '/api/v1/illiteracy';
    
    var edex_data = [];
    var i_data = [];
    
    var inicio = 2008;
    var fin = 2016;
    
    async function cargaGrafica(){
    
        //Peticion de datos
    
        console.log("se ejecuta cargar grafica");
    
    
        const res_ee = await fetch(BASE_API_PATH_EE);
        const res_i =  await fetch(BASE_API_PATH_I);
        console.log(res_ee);
    
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
        
        if(res_i.ok){
            var json_i  = await res_i.json();
            if(json_i.length===undefined){
            i_data = [];
            i_data.push(json_i);          
            }
            else{
            i_data = json_i;
            }
    
        }  
        
    
        console.log("i: " + JSON.stringify(i_data));
    
        
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
    
        var datosGrafica_edex = await tomaDatosGrafica(edex_data,"man_percent");
        console.log("edex final:" + datosGrafica_edex);
        var datosGrafica_i    = await tomaDatosGrafica(i_data,"male_illiteracy_rate");
    
        //Construccion de la grafica
    
        Highcharts.chart('container', {
    
        title: {
            text: "Grafica conjunta Grupo 10 Obesity_stats y Grupo 4 illiteracy"
    
        },
    
        subtitle: {
            text: "prueba"
        },
    
        yAxis: {
            title: {
                text: "porcentaje (%)"
            }
        },
    
        xAxis: {
            accessibility: {
                rangeDescription: 'Range:'+inicio+'  to ' + fin
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
    
        series: [
    
            {
                name: 'Obesity-Stats',
                data: datosGrafica_edex
            },
            {
                name:'Illiteracy',
                data: datosGrafica_i
            }
    
        ],
    
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
    
    async function tomaDatosGrafica(datos,atributo){
        
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
                    if(dato.country=="Spain"){
                     arrayTotal.push(dato[atributo]);
                    }
                    
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
    
    
           //Pusheamos al array final
           arrayFinal.push(mediaPorAnyo);
        }
    
        return arrayFinal;
       
    }
    
    function rangoAnyos(inic,fin){
        var rango = [];
        for(var i = inic; i<=fin;i++){
            rango.push(i);
        }
        return rango;
    }
    
    </script>
    
    <svelte:head>
        <script src="https://code.highcharts.com/highcharts.js" on:load={cargaGrafica}></script>
    </svelte:head>
    
    <main>
    
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p class="highcharts-description">
            </p>
        </figure>
        
    
    </main>
    
    <style>
    
    </style>