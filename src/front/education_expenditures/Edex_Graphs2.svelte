<script>

import bb, {bubble} from "billboard.js";

import { onMount } from "svelte";
import { each } from "svelte/internal";

    
//Funcion para la toma de datos e incluirlos en la gráfica
var BASE_API_PATH = '/api/v1/education_expenditures';

var edex_data = [];
var anyos = [];
var paises = [];
var inicio = 2014;
var fin = 2016;
var data_clasif = [];
var clasif = ["education_expenditure_per_millions","education_expenditure_per_public_expenditure",
"education_expenditure_gdp","education_expenditure_per_capita",];
var datoClasif = clasif[Math.floor(Math.random()*clasif.length)];
var datoClasifEsp = "";
var conjuntoAnyos = new Set(anyos);
var datosGrafica = [];
var anyosGrafica = [];
var maximo = 0;

//Declaramos los arrays que incluirán a cada uno de los paise


switch (datoClasif){
    case "education_expenditure_per_millions":
        datoClasifEsp = "Gasto en educación en millones de Dolares";
        maximo = 200000;
        break;
    case "education_expenditure_per_public_expenditure":
        datoClasifEsp = "Gasto en educación por gasto público";
        maximo=15;
        break;
    case "education_expenditure_gdp":
        datoClasifEsp = "Gasto en educación por PIB";
        maximo=6;
        break;
    default:
        datoClasifEsp="Gasto en educación per capita";
        maximo = 2350;

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
        objeto = [];
        objeto.push(paisActual);
        for(var num3 in rango){
            
            if(anyosAuxiliar.indexOf(rango[num3])!=-1){
                objeto.push(arrayAux1.data[contador][1]);
                contador++;
            }
            else{
                objeto.push(0);
            }
        }
        
        //Ya con los datos completos, creamos entonces el objeto

        

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

      //Tomaremos solo algunos

      var datosReduct = datosGrafica.slice(0,Math.round(datosGrafica.length/2));

      var auxanyos = rangoAnyos(inicio,fin);
      for(var a in auxanyos){
        anyosGrafica.push(String(auxanyos[a]));
      }

      console.log("AÑOS: " + anyosGrafica);

      var chart = bb.generate({
        data: {
          columns: datosReduct,
          type: bubble(), // for ESM specify as: bubble()
          labels: true
        },
        bubble: {
          maxR: 50
        },
        axis: {
          x: {
            type: "category"
          },
          y: {
            label:{
              text:datoClasifEsp,
              position: "outer-middle"
            },
             
            max: maximo
          }
        },
        bindto: "#bubbleChart"
});

setTimeout(function() {
	chart.load({
		columns: [
			datosGrafica[0]
		]
	});
}, 500);

setTimeout(function() {
	chart.load({
		columns: [
			datosGrafica[1]
		]
	});
}, 1000);

setTimeout(function() {
	chart.load({
		columns: [
			datosGrafica[2]
		]
	});
}, 1500);

setTimeout(function() {
	chart.load({
		columns: [
			datosGrafica[3]
		]
	});
}, 2000);
    
}
onMount(cargaGrafica);

</script>

<main>
  <div class="grid-block" style="background-image: url('images/fondo_edex.png'); width: 100%; height: 100%;padding: 5%; ">
      <div id="interno" class="grid-block" style="background-color:rgb(245, 181, 128);border-radius:4%; padding:1%;">
          <em><h1 class="display-3" style="text-align: center;" >Gastos en educación</h1></em>
      </div>
    
    </div>


  <div style="padding:5%;">
  <div id="bubbleChart">

  </div>
 </div>


</main>

<style>
  

</style>