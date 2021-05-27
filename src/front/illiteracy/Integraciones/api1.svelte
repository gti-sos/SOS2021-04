<script>
  import { CardText, Nav, NavItem, NavLink } from "sveltestrap";
//import CommonChart from "../../../Pages/CommonChart.svelte";
  //Uso de API externa Breaking Bad
  var municipios = [];
  var errorMsg = "";
  var okMsg = "";
  async function getStats() {
      console.log("Fetching data...");
      const res = await fetch("http://opendata.gijon.es/descargar.php?id=227&tipo=JSON");
      if (res.ok) {
          const json = await res.json();
          municipios = json;
          //console.log(Object.keys(json));
          //console.log(Object.keys(municipios));

          console.log(`We have received ${municipios.poblaciones.poblacion.length} municipios.`);
          console.log("Ok");
      } else {
          errorMsg = "Error al obtener los  datos de los personajes";
          okMsg = "";
          console.log("ERROR!" + errorMsg);
      }
  }
  async function onLoad() {
      await getStats();
      var array=[];
      var array2 = [0,0,0]; 
      var numMujeres=0;
      var numHombres=0;
      var numTotal=0;
     
 
      for (let index = 0; index < 78; index++) { 
        const element = municipios.poblaciones.poblacion[index]
        console.log(element);
        var a =[];
        if(element.municipio == "ALLANDE"){
        console.log("NOMBRE: "+element.municipio);
        console.log("mujeres: "+element.mujer);
        console.log("varones: "+element.varon);
        console.log("total: "+element.total);
        numMujeres=element.mujer;
        numHombres=element.varon;
        numTotal=element.total;
        console.log("mujeres: "+numMujeres);
        array2[0]=numMujeres;
        array2[1]=numHombres;
        array2[2]=numTotal;
    }       
  };
  for ( var i = 0; i < 2; i++){
            var point = { x: "name", y: "number of peolpe by gender" , z: null}; // y=number of characters per season
            switch( i ){
               case 0 :
               point.x = "mujeres"
               point.y = array2[0];
               point.z = numMujeres;
                   break;
                case 1 :
                point.x = "varones"
                point.y = array2[1];              
                point.z = numHombres;
                   break;
           }
           console.log(Object.values(point));
           console.log(array);
           array.push(point);
          }    
 var chart = JSC.chart('chartDiv', {
      debug: false,
      //title_label_text: 'Breaking Bad characters per season',
      legend_visible: false,
      
      
      defaultSeries: {
        type: 'pie donut',
        shape: {
          innerSize: '30%',
          padding: 0.005,
          offset: '1,80'
        }
      },
      yAxis_label_text: 'Numero de varones en el municipio',
     // zAxis_label_text: 'Number of characters in this season',
      defaultAnnotation: { label_style: { fontSize: '400px' } },
  
       
      series: [
        {
          name: 'porcentaje sobre el total de habitantes',
          points: array
          
        }
          ]
      
    });
    
    console.log("array");
  }
</script>

<svelte:head>
  <script
  type="text/javascript" src="https://code.jscharting.com/latest/jscharting.js"
      on:load={onLoad}></script>
      
</svelte:head>

<main>
  <Nav>
      <NavItem>
          <NavLink href="/">Página Principal</NavLink>
      </NavItem>
      <NavItem>
          <NavLink href="/#/integrations/">volver</NavLink>
      </NavItem>
  </Nav>

  <div>
      <h2>Uso API externa </h2>
      <CardText> Representacón del Censo de los pueblos de Gijon en concreto el municipiode  Allande</CardText>
  </div>

  {#if errorMsg}
      <p>{errorMsg}</p>
  {:else}
      <div id="chartDiv"  />
  {/if}
</main>

<style>
  #chartDiv {
      width: 100%;
      height: 400px;
  }
</style>