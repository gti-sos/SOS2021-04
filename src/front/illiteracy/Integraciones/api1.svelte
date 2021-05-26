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
      var array = []; 
      var numMujeres=0;
      var numHombres=0;
      var numTotal=0;
      var nombre;
      var point = { x: "name", y: "number of municipios" , z: null}; // y=number of characters per season 
      municipios.forEach((c) => {
          //console.log(Object.values(c));
          console.log(`imprimiendo c ${Object.keys(c)}`);
          if(c.municipio=="ALLENDE"){
            
          }
                      
         
      });
      
     
 var chart = JSC.chart('chartDiv', {
      debug: true,
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
      yAxis_label_text: 'Number of municipios in this season',
      zAxis_label_text: 'Number of characters in this season',
      defaultAnnotation: { label_style: { fontSize: '400px' } },
  
       
      series: [
        {
          name: 'total of character in the serie ',
          points: array
            
        }
          ]
      
    });
    
 
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
      <h2>Uso API externa Breaking Bad </h2>
      <CardText> Representacón del número de personajes total que aparecen en cada temporada de la serie Breaking Bad</CardText>
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