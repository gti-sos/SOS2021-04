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
      console.log(Object.keys(characters));
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
   
    characters.forEach(c =>{
      var point ={x: "nuts_name", y: null}

      if(c.nuts_name === "Sevilla"){
        console.log("prueba");
        console.log(c.nuts_name);
        console.log(c.nat_grw0111_pc);
        var valor=0;
        valor=parseFloat(c.nat_grw0111_pc);
        console.log(valor);
        point.x = c.nuts_name;
        point.y = valor;
      }
      if(c.nuts_name == "Huelva"){
        console.log("prueba");
        console.log(c.nuts_name);
        console.log(c.nat_grw0111_pc);
        var valor=0;
        valor=parseFloat(c.nat_grw0111_pc);
        console.log(valor);
        point.x = c.nuts_name;
        point.y = valor;
      }
      if(c.nuts_name == "Cádiz"){
        console.log("prueba");
        console.log(c.nuts_name);
        console.log(c.nat_grw0111_pc);
        var valor=0;
        valor=parseFloat(c.nat_grw0111_pc);
        console.log(valor);
        point.x = c.nuts_name;
        point.y = valor;
      }
      
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
    <h2>Uso API externa Variación de Poblaciones en Capitales Europeas</h2>
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