<script>
    import { onMount } from "svelte";
    import { Table, Button} from "sveltestrap";
    const BASE_API_PATH = "/api/v1/education_expenditures";
    export let params = {};
    
    let stat = {};
    let updateCountry = "";
    let updateYear = 0;
    let updateEducation_expenditure_per_millions = 0;
    let updateEducation_expenditure_per_public_expenditure =0;
    let updateEducation_expenditure_gdp = 0;
    let updateEducation_expenditure_per_capita = 0;
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
      updateEducation_expenditure_per_millions = stat.education_expenditure_per_millions;
      updateEducation_expenditure_per_public_expenditure = stat.education_expenditure_per_public_expenditure;
      updateEducation_expenditure_gdp = stat.education_expenditure_gdp;
      updateEducation_expenditure_per_capita = stat.education_expenditure_per_capita;
      
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
          "education_expenditure_per_millions": parseFloat(updateEducation_expenditure_per_millions),
          "education_expenditure_per_public_expenditure": parseFloat(updateEducation_expenditure_per_public_expenditure),
          "education_expenditure_gdp": parseFloat(updateEducation_expenditure_gdp),
          "education_expenditure_per_capita": parseFloat(updateEducation_expenditure_per_capita)
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

    <div class="grid-block" style="background-image: url('images/fondo_edex.png'); width: 100%; height: 100%;padding: 5%; ">
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
                <td valign="middle">Gasto en millones de euros</td>
                <td valign="middle">Porcentaje del gasto público</td>
                <td valign="middle">Porcentaje del PIB</td>
                <td valign="middle">Gasto per capita</td>
                <td valign="middle"colspan="2"> Acciones </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{updateYear}</td>
            <td>{updateCountry}</td>
            <td><input type="number" placeholder="250.4"  bind:value={updateEducation_expenditure_per_millions}/></td>
                    <td><input type="number" placeholder="112.3"  bind:value={updateEducation_expenditure_per_public_expenditure}/></td>
                    <td><input id="edit_gdp" type="number" placeholder="2.5"  bind:value={updateEducation_expenditure_gdp}/></td>
                    <td><input type="number" placeholder="2010"  bind:value={updateEducation_expenditure_per_capita}/></td>
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
           <a href="#/education_expenditures"><Button style="background-color: blue;">Página Principal</Button></a>
       </div>
        
    </footer>

    </div>
      
</main>

<style>
    .foot{
    min-width: 100%;
    color: white;
    background-color:#343c44;
    width: 100%;
    
    bottom: 0;
    background-color:#343c44;
    left: 0;
    
    
    
}
footer{
    
    padding: 1%;
    width: 100%;

    
}

</style>