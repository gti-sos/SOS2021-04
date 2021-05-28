<script>
  import { Nav, NavItem, NavLink } from "sveltestrap";
  //Uso de API externa rick and morty
  var characters = [];
  var errorMsg = "";
  var okMsg = "";
  async function getStats() {
    console.log("Fetching data...");
    const res = await fetch("https://cohesiondata.ec.europa.eu/resource/jeqt-d5ig.json");
    if (res.ok) {
      const json = await res.json();
      characters = json;
      console.log(Object.keys(json));
      //console.log(Object.keys(characters));
      console.log(`We have received ${characters.length} capitales.`);
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
   
    for (let index = 0; index < 10; index++) { 
      const element = characters[index]
      var point ={x: "name", y: null}
      point.x = element.nuts_name
      point.y = parseFloat(element.nat_grw0111_pc)
      array.push(point) 
      
    }  
    const chart = new JSC.Chart("chartDiv", {
      // Pass points to the series
      series: [{ points: array }],
    });
  }
</script>

<svelte:head>
  <script
    src="https://code.jscharting.com/latest/jscharting.js"
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
    <h2>Uso API externa Variación de Poblaciones en Capitales Europeas en %</h2>
  </div>

  {#if errorMsg}
    <p>{errorMsg}</p>
  {:else}
    <div id="chartDiv" />
  {/if}
</main>

<style>
  #chartDiv {
    width: 100%;
    height: 400px;
  }
</style>