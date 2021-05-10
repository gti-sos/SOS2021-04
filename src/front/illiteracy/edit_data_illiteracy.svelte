
  <script>
    import { onMount } from "svelte";
    import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";
    const BASE_CONTACT_API_PATH = "/api/v2";
    export let params = {};
    let stat = {};
    let updateCountry = "XXXX";
    let updateyear = 1999;
    let updatefemale_illiteracy_rate = 99.9;
    let updatemale_illiteracy_rate = 99.0;
    let updateadult_illiteracy_rate = 99.9;
    let updateyoung_illiteracy_rate = 99.9;
    let errorMsg = "";
    let okMsg = "";
    async function getStat() {
      console.log("Fetching stat..." + params.country + " " + params.year);
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
        updateyear = stat.year;
        updatefemale_illiteracy_rate = stat["female_illiteracy_rate"];
        updatemale_illiteracy_rate = stat["male_illiteracy_rate"];
        updateadult_illiteracy_rate = stat["adult_illiteracy_rate"];
        updateyoung_illiteracy_rate = stat["young_illiteracy_rate"];
        console.log("Received stat.");
      } else {
        if (res.status === 404) {
          errorMsg = `No existe dato con pais: ${params.country} y fecha: ${params.year}`;
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
          JSON.stringify(params.year)
      );
      const res = await fetch(
        BASE_CONTACT_API_PATH +
          "/illiteracy/" +
          params.country +
          "/" +
          params.year,
        {
          method: "PUT",
          body: JSON.stringify({
            country: params.country,
            date: parseInt(params.year),
            "female_illiteracy_rate": parseFloat(updatefemale_illiteracy_rate),
            "male_illiteracy_rate": parseFloat(updatemale_illiteracy_rate),
            "adult_illiteracy_rate": parseFloat(updateadult_illiteracy_rate),
            "young_illiteracy_rate": parseFloat(updateyoung_illiteracy_rate),
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
          okMsg = `${params.country} ${params.year} ha sido actualizado correctamente`;
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
        <NavLink href="#/illiteracy">Volver</NavLink>
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
            <th>porcentaje de mujeres analfabetas </th>
            <th>porcentaje de hombres analfabetos </th>
            <th>porcentaje de Adultos analfabetos </th>
            <th>porcentaje de jovenes analfabetos </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{updateCountry}</td>
            <td>{updateyear}</td>

            <td
              ><input
                type="number"
                placeholder="99.9"
                min="1"
                bind:value={updatefemale_illiteracy_rate}
              /></td
            >
            <td
              ><input
                type="number"
                placeholder="99.9"
                min="1"
                bind:value={updatemale_illiteracy_rate}
              /></td
            >
            <td
              ><input
                type="number"
                placeholder="99.9"
                min="1.0"
                bind:value={updateadult_illiteracy_rate}
              /></td
            >
            <td
              ><input
                type="number"
                placeholder="99.9"
                min="1.0"
                bind:value={updateyoung_illiteracy_rate}
              /></td
            >
            <td>
              <Button outline color="primary" on:click={updateStat}
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