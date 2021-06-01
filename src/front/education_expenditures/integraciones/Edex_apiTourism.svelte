<script>
    import {onMount} from "svelte";
    
    
    
    var BASE_API_PATH = '/api/v1/education_expenditures';
    
    var TOURISM_API_PATH = 'https://sos2021-03.herokuapp.com/api/integration/international-tourisms';
    
       
    
    //////////////////////////////////////////
    //Funciones Cargar grafica y datos Api's//
    //////////////////////////////////////////
    
    //Variables comunes
    
    var edex_data = [];
    var tourism_data = [];
    var inicio = 2014;
    var fin = 2017;
    var anyos = rangoAnyos(inicio,fin);
    
    
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
    
    
    
    async function cargaGrafica(){
    
        const res_ee = await fetch(BASE_API_PATH);
        const res_r = await fetch(TOURISM_API_PATH);
    
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
                console.log("Aqui llega undefined javi");
            tourism_data = [];
            tourism_data.push(json_r);          
            }
            else{
            console.log("Aqui llegan datos javi");
            console.log("longitud:" + json_r.length);
            tourism_data = json_r;
            console.log(json_r);
            }
    
        }
    
        
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
    
        var datosGrafica_edex = await tomaDatosGrafica(edex_data,"education_expenditure_per_millions");
        console.log("edex final:" + datosGrafica_edex);
        var datosGrafica_tourism    = await tomaDatosGrafica(tourism_data,"expendituresbillion");
        console.log("tourism final:" + datosGrafica_tourism);
    
        
        var anyosGraphic = [];
        var aux = "";
    
        for(var a in anyos){
            aux = String(anyos[a]);
            anyosGraphic.push(aux);
        }
        console.log("años grafica:" + anyosGraphic);
    

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title:{
                text: "Gatos en educación vs Gastos en Turismo"
            },
            axisY :{
                includeZero: false
                
            },
            toolTip: {
                shared: true
            },
            legend: {
                fontSize: 13
            },
            data: graphic_data
        });

        chart.render();

};

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
        <!--Se hace uso de la biblioteca CanvasJS y el tipo es  Multi Series Spline Area-->    
        <script type="text/javascript" src="https://canvasjs.com/assets/script/canvasjs.min.js" on:load="{cargaGrafica}"></script>
    </svelte:head>
    
    <main>
        <div id="chartContainer" style="height: 370px; width: 100%;"></div>
    </main>
    
    <style>

    
    </style>