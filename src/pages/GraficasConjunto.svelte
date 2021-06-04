<script>

var BASE_API_PATH_EE = '/api/v1/education_expenditures';
var BASE_API_PATH_PR = '/api/v1/poverty_risks';
var BASE_API_PATH_I = '/api/v1/illiteracy';

var edex_data = [];
var pr_data = [];
var i_data = [];

var inicio = 2010;
var fin = 2016;

async function cargaGrafica(){

    //Peticion de datos

    console.log("se ejecuta cargar grafica");


    const res_ee = await fetch(BASE_API_PATH_EE);
    const res_pr = await fetch(BASE_API_PATH_PR);
    const res_i =  await fetch(BASE_API_PATH_I);

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
    if(res_pr.ok){
        var json_pr = await res_pr.json();

        if(json_pr.length===undefined){
            console.log("Aqui llega undefined javi");
        pr_data = [];
        pr_data.push(json_pr);          
        }
        else{
        console.log("Aqui llegan datos javi");
        console.log("longitud:" + json_pr.length);
        pr_data = json_pr;
        console.log(json_pr);
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
    

    console.log("pr: " + JSON.stringify(pr_data));
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

    var datosGrafica_edex = await tomaDatosGrafica(edex_data,"education_expenditure_per_public_expenditure");
    console.log("edex final:" + datosGrafica_edex);
    var datosGrafica_pr   = await tomaDatosGrafica(pr_data,"percentage_risk_of_poverty");
    var datosGrafica_i    = await tomaDatosGrafica(i_data,"male_illiteracy_rate");
    var años = rangoAnyos(inicio,fin);
    //Construccion de la grafica

    Highcharts.chart('container', {
  chart: {
    type: 'bar'
  },
  title: {
    text: 'illiteracy,Education Expenditure,Poverty Risks'
  },
  xAxis: {
    categories:años
    },
  yAxis: {
    title: {
      text: 'Grafica conjunta del G04'
    }
  },
  legend: {
    reversed: true
  },
  plotOptions: {
    series: {
      stacking: 'normal'
    }
  },
  series: [{
    name: 'Education Expenditures',
    data: datosGrafica_edex
  }, {
    name: 'Poverty Risks',
    data: datosGrafica_pr
  }, {
    name:'Illiteracy',
    data: datosGrafica_i
  }]
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