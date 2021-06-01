<script>
    import {onMount} from "svelte";
    
    
    
    var BASE_API_PATH = '/api/v1/education_expenditures';
    
    var SANITY_API_PATH = 'https://sanity-integration.herokuapp.com/sanity-stats';
    
       
    
    //////////////////////////////////////////
    //Funciones Cargar grafica y datos Api's//
    //////////////////////////////////////////
    
    //Variables comunes
    
    var edex_data = [];
    var s_data = [];
    var inicio = 2010;
    var fin = 2017;
    var paises = [];
    
    
    async function tomaDatosGrafica(datos,atributo){ //Esta funcion hace la media por años y 
        
    
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
                    arrayTotal.push(dato[atributo]);
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
           
           var objeto =  { x: a, y: mediaPorAnyo }
    
           //Pusheamos al array final
           arrayFinal.push(objeto);
        }
    
        return arrayFinal;
    }

        //Una vez completados los array de medias de datos para cada país, creamos dos objetos que actuarán como series en la gráfica

      
    
    
    async function cargaGrafica(){
    
        const res_ee = await fetch(BASE_API_PATH);
        const res_s = await fetch(SANITY_API_PATH);
    
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
        if(res_s.ok){
            var json_s = await res_s.json();
    
            if(json_s.length===undefined){

            s_data = [];
            s_data.push(json_s);          
            }
            else{
            console.log("longitud:" + json_s.length);
            s_data = json_s;
            console.log(json_s);
            }
    
        }
    
        var datosEdex =  await tomaDatosGrafica(edex_data,"education_expenditure_per_public_expenditure");
        var datosSanity =await tomaDatosGrafica(s_data,"health_expenditure_in_percentage");
     
       console.log(datosEdex);
        

        var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title:{
            text: "Gasto público en educación vs Gasto público en sanidad"
        },
        axisX: {
            title:"Años"
        },
        axisY:{
            title: "Porcentaje",
            includeZero: true
        },
        data: [{
            type: "scatter",
            toolTipContent: "<span style=\"color:#4F81BC \"><b>{name}</b></span><br/><b> Load:</b> {x} TPS<br/><b> Porcentaje:</b></span> {y} ms",
            name: "Gastos en educación por gasto público",
            showInLegend: true,
            dataPoints: datosEdex
        },
        {
            type: "scatter",
            name: "Gastos en sanidad por gasto público",
            showInLegend: true, 
            toolTipContent: "<span style=\"color:#C0504E \"><b>{name}</b></span><br/><b> Load:</b> {x} TPS<br/><b> Porcentaje:</b></span> {y} ms",
            dataPoints:datosSanity
        }]
});
chart.render();

}

function rangoAnyos(inic,fin){
        var rango = [];
        for(var i = inic; i<=fin;i++){
            rango.push(i);
        }
        return rango;
    }
    
    
    // Funciones auxiliares

</script>
    
<svelte:head>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js" on:load="{cargaGrafica}"></script>

</svelte:head>
    
<main>
    <div id="chartContainer" style="height: 370px; width: 100%;"></div>
</main>
    
<style>
</style>