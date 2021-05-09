<script>
    import { onMount } from "svelte";
    import { Table, Button, Col,Nav, NavItem, NavLink } from "sveltestrap";
    const BASE_API_PATH = "/api/v1/illiteracy";
    /*De la URL expórtame los parámetros a este array llamado params,es un JSON ({})*/
    export let params = {};
    
    //Viene un JSON y yo recojo los datos en el JSON stats.
    let stat = {};
    let updateCountry = "";
    let updateYear = 0;
    let updatefemale_illiteracy_rate = 0;
    let updatemale_illiteracy_rate =0;
    let updateadult_illiteracy_rate = 0;
    let updateyoung_illiteracy_rate = 0;
    let msjError = "";
    let msjOK = "";

    async function getStat() {
    
    const res = await fetch(
      BASE_API_PATH +"/" + params.country +"/" + params.year
    );
    if (res.ok) {
      console.log("Ok:");
      const json = await res.json();
      /*Guardo todos los datos de la petición y la guardo en mi plantilla JSON.*/
      stat = json;
      updateCountry = stat.country;
      updateYear = stat.year;
      updatefemale_illiteracy_rate = stat.female_illiteracy_rate;
      updatemale_illiteracy_rate = stat.male_illiteracy_rate;
      updateadult_illiteracy_rate = stat.adult_illiteracy_rate;
      updateyoung_illiteracy_rate = stat.young_illiteracy_rate;
        
    } else {
      if(res.status===404){
          msjError = "No se encuentra el dato solicitado";
        }else if(res.status ===500){
          msjError = "Error al intentar acceder a la base de datos";
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
          "female_illiteracy_rate": parseFloat(updatefemale_illiteracy_rate),
          "male_illiteracy_rate": parseFloat(updatemale_illiteracy_rate),
          "adult_illiteracy_rate": parseFloat(updateadult_illiteracy_rate),
          "young_illiteracy_rate": parseFloat(updateyoung_illiteracy_rate)
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }
    ).then(function (res) {
      if (res.ok) {
        getStat();
        msjError= "";
        msjOK= "Dato actualizado";
      } else {
         if(res.status ===500){
          msjError = "No se han podido acceder a la base de datos";
        }else if(res.status ===404){
          msjError = "Error al intentar encontrar el dato solicitado";
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
      <Col md=4 style="text-align: right;">
      <div>
          {#if msjError.length!=0}
          <p style="color:tomato">Se ha producido un error:<b> {msjError} </b></p>
          {/if}
          {#if msjOK.length!=0}
          <p class="msjOK"><b> {msjOK} </b></p>
          {/if}
      </div>
      </Col>  

      <Table bordered>
        <thead>
          <tr>
            <tr style="text-align: center; " valign="middle">
                <td valign="middle">Año</td>
                <td valign="middle">País</td>
                <td valign="middle">Porcentaje de mujeres analfabetas</td>
                <td valign="middle">Porcentaje de hombres analfabetos</td>
                <td valign="middle">Porcentaje de adultos analfabetos</td>
                <td valign="middle">Porcentaje de jovenes analfabetos</td>
                <td valign="middle"colspan="2"> Acciones </td>
          </tr>
        </thead>
        <tbody>
          <tr>
                  <td>{updateYear}</td>
                  <td>{updateCountry}</td>
                    <td><input type="number" placeholder="8474000"  bind:value={updatefemale_illiteracy_rate}/></td>
                    <td><input type="number" placeholder="12849"  bind:value={updatemale_illiteracy_rate}/></td>
                    <td><input type="number" placeholder="26983"  bind:value={updateadult_illiteracy_rate}/></td>
                    <td><input type="number" placeholder="13.6"  bind:value={updateyoung_illiteracy_rate}/></td>
                    <td><button on:click={updateStat} class="btn btn-success"> Actualizar </button></td>
          </tr>
        </tbody>
      </Table>
      {#if msjError}
        <p style="color: red">ERROR: {msjError}</p>
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
           <a href="#/illiteracy"><Button style="background-color: blue;">Volver</Button></a>
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