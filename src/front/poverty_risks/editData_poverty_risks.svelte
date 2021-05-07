<script>
    import { onMount } from "svelte";
    import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";
    const BASE_API_PATH = "/api/v1/poverty_risks";
    export let params = {};
    
    let stat = {};
    let updateCountry = "";
    let updateYear = 0;
    let updatePeople_in_risk_of_poverty = 0;
    let updatePeople_poverty_line =0;
    let updateHome_poverty_line = 0;
    let updatePercentage_risk_of_poverty = 0;
    let mensajeError = "";

    async function getStat() {
    
    const res = await fetch(
      BASE_API_PATH +"/" + params.country +"/" + params.year
    );
    if (res.ok) {
      console.log("Ok:");
      const json = await res.json();
      stat = json;
      updateCountry = stat.country;
      updateYear = stat.year;
      updatePeople_in_risk_of_poverty = stat.people_in_risk_of_poverty;
      updatePeople_poverty_line = stat.people_poverty_line;
      updateHome_poverty_line = stat.home_poverty_line;
      updatePercentage_risk_of_poverty = stat.percentage_risk_of_poverty;
      
    } else {
      if(res.status===404){
          mensajeError = "No se encuentra el dato solicitado";
        }else if(res.status ===500){
          mensajeError = "No se han podido acceder a la base de datos";
        }        
    }
  }

  async function updateStat() {
    
    const res = await fetch(
      BASE_API_PATH +
        "/" +
        params.country +
        "/" +
        params.year,
      {
        method: "PUT",
        body: JSON.stringify({
          "country": params.country,
          "year": parseInt(params.year),
          "people_in_risk_of_poverty": parseFloat(updatePeople_in_risk_of_poverty),
          "people_poverty_line": parseFloat(updatePeople_poverty_line),
          "home_poverty_line": parseFloat(updateHome_poverty_line),
          "percentage_risk_of_poverty": parseFloat(updatePercentage_risk_of_poverty)
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }
    ).then(function (res) {
      if (res.ok) {
        getStat();
        mensajeError= "";
      } else {
         if(res.status ===500){
          mensajeError = "No se han podido acceder a la base de datos";
        }else if(res.status ===404){
          mensajeError = "No se han encontrado el dato solicitado";
        }        
      }
    });
  }
  onMount(getStat);
</script>

<main>

    <div class="grid-block" style="background-image: url('https://i0.wp.com/criptotendencia.com/wp-content/uploads/2019/02/Como-nacio-el-Euro.jpg?fit=1000%2C642&ssl=1'); width: 100%; height: 100%;padding: 5%; ">
        <div id="interno" class="grid-block" style="background-color:rgb(245, 181, 128);border-radius:4%; padding:1%;">
            <em><h1 class="display-3" style="text-align: center;" >Modifica {params.country}/{params.year}</h1></em>
        </div>
        
    </div>

    <br>
    

      <Table bordered>
        <thead>
          <tr>
            <tr style="text-align: center; " valign="middle">
                <td valign="middle">Año</td>
                <td valign="middle">País</td>
                <td valign="middle">Personas en riesgo de pobreza</td>
                <td valign="middle">Índice de riesgo de pobreza (persona)</td>
                <td valign="middle">Índice de riesgo de pobreza (hogar)</td>
                <td valign="middle">Porcentaje población en riesgo de pobreza</td>
                <td valign="middle"colspan="2"> Acciones </td>
          </tr>
        </thead>
        <tbody>
          <tr>
                  <td>{updateYear}</td>
                  <td>{updateCountry}</td>
                    <td><input type="number" placeholder="8474000"  bind:value={updatePeople_in_risk_of_poverty}/></td>
                    <td><input type="number" placeholder="12849"  bind:value={updatePeople_poverty_line}/></td>
                    <td><input type="number" placeholder="26983"  bind:value={updateHome_poverty_line}/></td>
                    <td><input type="number" placeholder="13.6"  bind:value={updatePercentage_risk_of_poverty}/></td>
                    <td><button on:click={updateStat} class="btn btn-success"> Actualizar </button></td>
          </tr>
        </tbody>
      </Table>
      {#if mensajeError}
        <p style="color: red">ERROR: {mensajeError}</p>
      {/if}
      <div class="foot" style="min-width: 100%;
    color: white;
    background-color:#343c44;
    min-width: 100%;
    
    bottom: 0;
    background-color:#343c44;
    left: 0;
    position: absolute;">
    
      <footer>
       

        <div>
           <a href="#/poverty_risks"><Button style="background-color: blue;">Datos</Button></a>
       </div>
        
    </footer>

    </div>
      
</main>

<style>
footer{
    
    padding: 1%;
    width: 100%;

    
}

</style>