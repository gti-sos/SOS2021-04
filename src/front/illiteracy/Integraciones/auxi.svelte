<script>
  import { Nav, NavItem, NavLink } from "sveltestrap";
  //Uso de API externa rick and morty
  var characters = [];
  var errorMsg = "";
  var okMsg = "";
  async function getStats() {
    console.log("Fetching data...");
    const res = await fetch("https://rickandmortyapi.com/api/character/");
    if (res.ok) {
      const json = await res.json();
      characters = json.results;
      console.log(Object.keys(json));
      console.log(Object.keys(characters));
      console.log(`We have received ${characters.length} characters.`);
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
   
    characters.forEach(c =>{
      //console.log(Object.keys(c));
      
      console.log(`imprimiendo c ${c}`);
      var point ={x: "name", y: null}
      point.x = c.name
      point.y = c.episode.length
      array.push(point) 
    }  )
    /* let points = [
      { x: "A", y: 10 },
      { x: "B", y: 5 },
    ];
 */
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
    <h2>Uso API externa Rick and Morty API</h2>
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