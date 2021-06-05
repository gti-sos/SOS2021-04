<script>
  import { Nav, NavItem, NavLink } from "sveltestrap";
  //Integración de Divorce stats y Air Death´s Pollution
  var illiteracy = [];
  var temperatures = [];
  var errorMsg = "";
  var okMsg = "";
  async function getStats() {
      console.log("Fetching divorce stats data...");
      const res = await fetch(
          "/api/v1/illiteracy"
      );
      if (res.ok) {
          const json = await res.json();
          illiteracy = json;
          //console.log(Object.keys(json));
          console.log(`We have received ${illiteracy.length} stats.`);
          console.log("Ok");
      } else {
          errorMsg = "Error al obtener los  datos";
          okMsg = "";
          console.log("ERROR!" + errorMsg);
      }
      console.log("Fetching air death´s pollution data...");
      const res1 = await fetch(
          "proxySOStemperature/api/v2/temperature-stats"
      );
      if (res1.ok) {
          const json1 = await res1.json();
          temperatures = json1;
          //console.log(Object.keys(json1));
          console.log(`We have received ${temperatures.length} stats.`);
          console.log("Ok");
      } else {
          errorMsg = "Error al obtener los  datos";
          okMsg = "";
          console.log("ERROR!" + errorMsg);
      }
  }
  async function onLoad() {
      await getStats();
      var array = [];
      var arrayChartDivorces = [];
      var arrayChartDeaths = [];
      illiteracy.forEach((c) => {
          //console.log(Object.keys(c));
          //console.log(`imprimiendo c ${c}`);
          var data = {
              country: "",
              year: null,
              IlliteracyRate: null,
              temper_max: null,
          };
          var pais = c.country.toLowerCase();
          pais = pais.charAt(0).toUpperCase() + pais.substr(1);
          //console.log(pais);
          data.country = pais;
          data.year = c.year;
          data.IlliteracyRate = c["male_illiteracy_rate"];
          //console.log(Object.values(data));
          array.push(data);
      });
      temperatures.forEach((c) => {
          var exists = 0;
          var data = {
              country: "",
              year: null,
              IlliteracyRate: null,
              temper_max: null,
          };
          for (var i = 0; i < array.lenth; i++) {
              if (c.year == array[i].year && c.country == array[i].country) {
                  array[i].temper_max = c.temperature_co2;
                  exists = 1;
              }
          }
          if (exists != 1) {
              var pais = c.country.toLowerCase();
              pais = pais.charAt(0).toUpperCase() + pais.substr(1);
              data.country = pais;
              data.year = c.year;
              data.temper_max = c.temperature_co2;
              array.push(data);
          }
          
          //console.log(Object.values(data));
          //console.log("print del array", array);
      });
      // { country: Spain, year: 2019, IlliteracyRate: 5, Air Polution´s Deaths Rate: 10] },
  
      //eliminando los elementos repetidos
      var hash = {};
      illiteracy = illiteracy.filter(function (current) {
          var exists = !hash[current.country];
          hash[current.country] = true;
          return exists;
      });
      //console.log(illiteracy);
      var hash1 = {};
      temperatures = temperatures.filter(function (current) {
          var exists = !hash1[current.country];
          hash1[current.country] = true;
          return exists;
      });
      //console.log(temperatures);
 
   
      illiteracy.forEach((c) => {
          var dato = [];
          console.log("imprimiendo el pais a añadir", c.country);
          var pais = c.country.toLowerCase();
          pais = pais.charAt(0).toUpperCase() + pais.substr(1)
         
          dato.push(pais);
          //console.log(parseFloat(-c["divorce-rate"]));
          dato.push(parseFloat(c["male_illiteracy_rate"])); /// aqui iria el menois para mostrrar la grafica por ambos lados 
          arrayChartDivorces.push(dato);
          //console.log(arrayChartDivorces);
      });
      temperatures.forEach((c) => {
          var dato = [];
          var pais = c.country.toLowerCase();
          pais = pais.charAt(0).toUpperCase() + pais.substr(1);
          
          dato.push(pais);
          dato.push(parseFloat(c.temperature_co2));
          arrayChartDeaths.push(dato);
          
      });
      console.log(arrayChartDeaths, arrayChartDivorces);
      console.log(
          Object.keys(arrayChartDeaths),
          Object.keys(arrayChartDivorces)
      );
      console.log(
          Object.values(arrayChartDeaths),
          Object.values(arrayChartDivorces)
      );
  
      
      var chart = JSC.chart("chartDiv", {
          debug: false,
          type: "horizontal column",
          title_label_text:
              "lliteracy Man Rate and Temperatures Maxims by countries",
          yAxis: {
              scale_type: "stacked",
          },
          xAxis: { label_text: "Country", crosshair_enabled: true },
          defaultTooltip_label_text: "country %xValue:<br><b>%points</b>",
          defaultPoint_tooltip: "%icon {Math.abs(%Value)}",
          legend_template: "%name %icon {Math.abs(%Value)}",
          series: [
              {
                  name: "lliteracy Mens Rate",
                  points: {
                      mapTo: "x,y",
                      data: arrayChartDivorces
                  },
              },
              {
                  name: "Maxims Temperatures",
                  points: {
                      mapTo: "x,y",
                      data: arrayChartDeaths,
                  },
              },
          ],
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
      <h2>
          Integracion de Tasa de alfabetización de hombres y las temperaturas máximas por pais
      </h2>
  </div>

  {#if errorMsg}
      <p>{errorMsg}</p>
  {:else}
      <div id="chartDiv" />
      <div id="grid" />
  {/if}
</main>

<style>
  #chartDiv {
      width: 100%;
      height: 400px;
  }
</style>