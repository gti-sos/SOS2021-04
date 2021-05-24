<script>
    import {
      Nav,
      NavItem,
      NavLink
    } from "sveltestrap";
    //Uso de API externa restcountries.eu 
  var countries = [];
  var errorMsg = "";
  var okMsg ="";
  async function getStats() {
      console.log("Fetching data...");
      const res = await fetch(
        "https://cohesiondata.ec.europa.eu/resource/jeqt-d5ig.json"
      );
      if (res.ok) {
        const json = await res.json();
        countries = json;
        console.log(`We have received ${countries.length} cities.`);
      
        console.log("Ok");
      } else {
        errorMsg="Error recuperando datos de restcountries"
        okMsg = "";
        console.log("ERROR!" + errorMsg);
      }
    };
    
  async function loadChart(){
   await getStats();
   var ctx = document.getElementById('myChart').getContext('2d');
   var xAxis = [];
   var yAxis = [];
   console.log("entra en el loader");
   
   for (let index = 0; index < countries.length; index++) {
    const element = countries[index];
    /*
    console.log("Ciudad: "+element.nuts_name);
    console.log("Variación: "+element.nat_grw0111_pc);
*/
    if(element.nuts_name === "Sevilla"){
    console.log("entra en el if");
    xAxis.push(element.name);
    yAxis.push(element.population);
    console.log("Ciudad: "+element.nuts_name);
    console.log("Variación: "+element.nat_grw0111_pc);
  }    
  if(element.nuts_name === "Huelva"){
    console.log("entra en el if");
    xAxis.push(element.name);
    yAxis.push(element.population);
    console.log("Ciudad: "+element.nuts_name);
    console.log("Variación: "+element.nat_grw0111_pc);
  }
  if(element.nuts_name === "Cádiz"){
    console.log("entra en el if");
    xAxis.push(element.name);
    yAxis.push(element.population);
    console.log("Ciudad: "+element.nuts_name);
    console.log("Variación: "+element.nat_grw0111_pc);
  }
  if(element.nuts_name === "Paris"){
    console.log("entra en el if");
    xAxis.push(element.name);
    yAxis.push(element.population);
    console.log("Ciudad: "+element.nuts_name);
    console.log("Variación: "+element.nat_grw0111_pc);
  }
  if(element.nuts_name === "Berlin"){
    console.log("entra en el if");
    xAxis.push(element.name);
    yAxis.push(element.population);
    console.log("Ciudad: "+element.nuts_name);
    console.log("Variación: "+element.nat_grw0111_pc);
  } 
      
      
    
    
   
     
   }
   var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: xAxis,
          datasets: [{
              label: 'población mujeres por municipio',
              data: yAxis,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }
  </script>
  
  <svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js" on:load={loadChart}></script>
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
      <h2>
        Uso API externa data.europea.eu
      </h2>
    </div>
  
    {#if errorMsg}
      <p>{errorMsg}</p>
    {:else}
    <div>
      <canvas id="myChart"></canvas>
    </div>
    {/if}
  </main>
  
  <style>
   main {
      text-align: center;
      padding: 1em;
      margin: 0 auto;
    }
    div{
      margin-bottom: 15px;
    }
  </style>