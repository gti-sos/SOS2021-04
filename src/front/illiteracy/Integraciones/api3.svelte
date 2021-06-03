<script>
  import { CardText, Nav, NavItem, NavLink } from "sveltestrap";
//import CommonChart from "../../../Pages/CommonChart.svelte";
  //Uso de API externa Breaking Bad
  var datos1 = [];
  var datos2 = [];
  var inicio = 2008;
  var errorMsg = "";
  var okMsg = "";
  async function getStats() {
      console.log("Fetching data...");
      const res = await fetch("/api/v1/illiteracy");
      const res2 = await fetch("https://sos2021-11.herokuapp.com/api/v2/anxiety_stats");
      if (res.ok && res2.ok) {
          const json = await res.json();
          const json2 = await res2.json();
          datos1 = json;
          datos2 = json2;
          //console.log(Object.keys(json));
          //console.log(Object.keys(datos1));

          console.log(`We have received ${datos1} datos1.`);
          console.log(`We have received ${datos2} datos2.`);
          console.log("Ok");
      } else {
          errorMsg = "Error al obtener los  datos1 de los personajes";
          okMsg = "";
          console.log("ERROR!" + errorMsg);
      }
  }
  async function onLoad() {
      await getStats();

      var NOMBRE1=[];
      var illiteracy=[];
      var exterior=[];
      var paisesAPI =[];
      var paisesMIOS =[];
      var arrayilliteracy=[];
      var arrayexterior=[];
     
 
      for (let index = 0; index < 10; index++) { 
        const element = datos1[index]
        const element2 = datos2[index]
       // console.log(element);
        NOMBRE1.push(element.country);
        paisesMIOS.push(element.country);
              // console.log("NOMBRE1: "+element.country+"_"+element.year);
        NOMBRE1.push((element2.country).split("_")[1]);
        paisesAPI.push((element2.country).split("_")[1]);
        illiteracy.push(element.male_illiteracy_rate);
        exterior.push(element2.anxiety_men);
  };
  
  console.log(NOMBRE1);
  console.log(illiteracy);
  console.log(exterior);


  for ( var i = 0; i <10; i++){
           var decide = NOMBRE1[i] in paisesAPI;
           console.log(decide);
           switch( i ){
             case true:
             var point1 = { x: "name", y: ""}; // y=number of characters per season
            point1.x = NOMBRE1[i]
            point1.y = exterior[i];
            arrayexterior.push(point1);
               break;
              case false:
              var point2 = { x: "name", y: ""};
            point2.x = NOMBRE1[i]
            point2.y = illiteracy[i];
            arrayilliteracy.push(point2);
            console.log(point2);
                break;
           }
            
            console.log("quiero ver");
            console.log(point2);
            console.log("hola");
            
            
           //console.log(Object.values(point));
           //console.log(arraymujeres);
           //array.push(point);
          }    
          var chart = JSC.chart('chartDiv', {
        debug: true,
        palette: 'fiveColor31',
        legend_position: 'inside top left',
        defaultSeries: {
          type: 'area',
          shape_opacity: 0.6,
          defaultPoint_tooltip: '%icon {%percentOfGroup:n1}% <b>%yValue</b>'
        },
        yAxis: { scale_type: 'stacked', formatString: 'c' },
        xAxis: {
          crosshair_enabled: true,
          categories: 'Range:'+inicio+'  to 2016'
        },
        title_label_text: 'Costs (Last 6 Months)',
        series: [
          {
            name: 'Purchases',
            points: arrayilliteracy
          },
          {
            name: 'Taxes',
            points: arrayexterior
          },
          
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