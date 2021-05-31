
  <script>
    import { onMount } from "svelte";
    import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";
    const BASE_CONTACT_API_PATH = "/api/v1";
    export let params = {};
    let stat = {};
    let updateCountry = "XXXX";
    let updateDate = 1999;
    let updateMenBorn = 999;
    let updateWomenBorn = 999.9;
    let updateNatalityRate = 999.9;
    let updateFertilityRate = 999.9;
    let errorMsg = "";
    let okMsg = "";
    async function getStat() {
      console.log("Fetching stat..." + params.country + " " + params.date);
      const res = await fetch(
        BASE_CONTACT_API_PATH +
          "/illiteracy/" +
          params.country +
          "/" +
          params.date
      );
      if (res.ok) {
        console.log("Ok:");
        const json = await res.json();
        stat = json;
        updateCountry = stat.country;
        updateDate = stat.year;
        updateMenBorn = stat["female_illiteracy_rate"];
        updateWomenBorn = stat["male_illiteracy_rate"];
        updateNatalityRate = stat["adult_illiteracy_rate"];
        updateFertilityRate = stat["young_illiteracy_rate"];
        console.log("Received stat.");
      } else {
        if (res.status === 404) {
          errorMsg = `No existe dato con pais: ${params.country} y fecha: ${params.date}`;
        } else if (res.status === 500) {
          errorMsg = "No se han podido acceder a la base de datos";
        }
        okMsg = "";
        console.log("ERROR!" + errorMsg);
      }
    }
    async function updateStat() {
      console.log(
        "Updating stat..." +
          JSON.stringify(params.country) +
          JSON.stringify(params.date)
      );
      const res = await fetch(
        BASE_CONTACT_API_PATH +
          "/illiteracy/" +
          params.country +
          "/" +
          params.date,
        {
          method: "PUT",
          body: JSON.stringify({
            country: params.country,
            year: parseInt(updateDate),
            "female_illiteracy_rate": parseFloat(updateMenBorn),
            "male_illiteracy_rate": parseFloat(updateWomenBorn),
            "adult_illiteracy_rate": parseFloat(updateNatalityRate),
            "young_illiteracy_rate": parseFloat(updateFertilityRate),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(function (res) {
        if (res.ok) {
          console.log("OK");
          getStat();
          errorMsg = "";
          okMsg = `${params.country} ${params.date} ha sido actualizado correctamente`;
        } else {
          if (res.status === 500) {
            errorMsg = "No se han podido acceder a la base de datos";
          } else if (res.status === 404) {
            errorMsg = "No se han encontrado el dato solicitado";
          } else if (res.status === 400) {
            errorMsg =
              "Todos los parámetros deben estar rellenados correctamente";
          }
          okMsg = "";
          getStat();
          console.log("ERROR!" + errorMsg);
        }
      });
    }
    onMount(getStat);
  </script>
  
  <main>
    <Nav>
      <NavItem>
        <NavLink id="nav_return"href="#/illiteracy">Volver</NavLink>
      </NavItem>
    </Nav>
  
    <div>
      <h2>
        Editar campo <strong>{params.country}</strong>
        <strong>{params.date}</strong>
      </h2>
    </div>
  
    <div>
      {#if errorMsg}
        <p class="msgRed" style="color: #9d1c24">ERROR: {errorMsg}</p>
      {/if}
      {#if okMsg}
        <p class="msgGreen" style="color: #155724">{okMsg}</p>
      {/if}
    </div>
  
    <div>
      <Table bordered>
        <thead>
          <tr>
            <th> País </th>
            <th>Año </th>
            <th>Alfabetizacion de mujeres </th>
            <th>Alfabetizacion de hombres </th>
            <th>Alfabetizacion de adultos </th>
            <th>Alfabetizacion de jovenes </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{updateCountry}</td>
            <td>{updateDate}</td>
            <td
              ><input
                id="input_update_woman"
                type="number"
                placeholder="1000"
                min="1"
                bind:value={updateMenBorn}
              /></td
            >
            <td
              ><input
                type="number"
                placeholder="1000"
                min="1"
                bind:value={updateWomenBorn}
              /></td
            >
            <td
              ><input
                type="number"
                placeholder="10.2"
                min="1.0"
                bind:value={updateNatalityRate}
              /></td
            >
            <td
              ><input
                type="number"
                placeholder="2.1"
                min="1.0"
                bind:value={updateFertilityRate}
              /></td
            >
            <td>
              <Button id="input_update_button"outline color="primary" on:click={updateStat}
                >Actualizar</Button
              >
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
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
    p {
      display: inline;
    }
    .msgRed {
      padding: 8px;
      background-color: #f8d7da;
    }
    .msgGreen {
      padding: 8px;
      background-color: #d4edda;
    }
  </style>