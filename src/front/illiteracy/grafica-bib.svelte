<script>
  import { CardText, Nav, NavItem, NavLink } from "sveltestrap";
//import CommonChart from "../../../Pages/CommonChart.svelte";
  //Uso de API externa Breaking Bad
  var datos = [];
  var errorMsg = "";
  var okMsg = "";
  async function getStats() {
      console.log("Fetching data...");
      const res = await fetch("/api/v1/illiteracy");
      if (res.ok) {
          const json = await res.json();
          datos = json;
          //console.log(Object.keys(json));
          //console.log(Object.keys(datos));

          console.log(`We have received ${datos} datos.`);
          console.log("Ok");
      } else {
          errorMsg = "Error al obtener los  datos de los personajes";
          okMsg = "";
          console.log("ERROR!" + errorMsg);
      }
  }
  async function onLoad() {
      await getStats();

      var NOMBRE=[];
      var mujeres=[];
      var varon=[];
      var total=[];
      var jovenes=[];

      var arraymujeres=[];
      var varones=[];
      var arraytotal=[];
      var arrayjovenes=[];
     
 
      for (let index = 0; index < datos.length; index++) { 
        const element = datos[index]
       // console.log(element);
        NOMBRE.push(element.country+"_"+element.year);
              // console.log("NOMBRE: "+element.country+"_"+element.year);
        mujeres.push(element.female_illiteracy_rate);
              // console.log("mujeres: "+element.female_illiteracy_rate);
        varon.push(element.male_illiteracy_rate);
              // console.log("varones: "+element.male_illiteracy_rate);
        total.push(element.adult_illiteracy_rate);
              // console.log("total: "+element.adult_illiteracy_rate);
        jovenes.push(element.young_illiteracy_rate);
              // console.log("jovenes: "+element.young_illiteracy_rate);
    
  };
  
  console.log(NOMBRE);
  console.log(mujeres);
  console.log(varon);
  console.log(total);
  console.log(jovenes);

  for ( var i = 0; i <NOMBRE.length; i++){
            var point1 = { x: "name", y: ""}; // y=number of characters per season
            point1.x = NOMBRE[i]
            point1.y = mujeres[i];
            arraymujeres.push(point1);
            console.log("quiero ver");
            console.log(arraymujeres);
      
            var point2 = { x: "name", y: ""};
            point2.x = NOMBRE[i]
            point2.y = varon[i];
            varones.push(point2);

            var point3 = { x: "name", y: ""};
            point3.x = NOMBRE[i]
            point3.y = total[i];
            arraytotal.push(point3);

            var point4 = { x: "name", y: ""};
            point4.x = NOMBRE[i]
            point4.y = jovenes[i];
            arrayjovenes.push(point4);
    
           //console.log(Object.values(point));
           //console.log(arraymujeres);
           //array.push(point);
          }    
          var chart = JSC.chart('chartDiv', {
        debug: true,
        defaultSeries_type: 'column',
        title_label_text: 'Acme Tool Sales',
        yAxis: { label_text: 'Units Sold' },
        xAxis_label_text: 'Quarter',
        series: [
          {
            name: 'female_illiteracy_rate',
            points: arraymujeres
          },
          {
            name: 'male_illiteracy_rate',
            points: varones
            
          },
          {
            name: 'adult_illiteracy_rate',
            points: arraytotal
            
          },
          {
            name: 'young_illiteracy_rate',
            points: arrayjovenes
            
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
      <h2>Uso API Propia </h2>
      <CardText> Representación de la tasa de alfabetización por pais y año usando la biblioteca jscharting</CardText>
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