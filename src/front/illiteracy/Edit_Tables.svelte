<script>
    import { onMount } from "svelte";
    import { pop } from "svelte-spa-router";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import Input from "sveltestrap/src/Input.svelte";
    import Label from "sveltestrap/src/Label.svelte";
    import FormGroup from "sveltestrap/src/FormGroup.svelte";
    import { Pagination, PaginationItem, PaginationLink } from "sveltestrap";
    const BASE_API_URL = "/api/v1/illiteracy";
    let illiteracyStats = [];
    let  newilliteracyStat = {
        country: "",
        year: 0,
        "female_illiteracy_rate": 0.0,
        "male_illiteracy_rate": 0.0,
        "adult_illiteracy_rate": 0.0,
        "young_illiteracy_rate": 0.0,
    };
    /* These variables are for the selects */
    let countries = [];
    let years = [];
    let currentCountry = "-";
    let currentYear = "-";
    let numberElementsPages = 10;
    let offset = 0;
    let currentPage = 1; /* We could use just one variable offset or currentPage, we leave both */
    let moreData = true;
    onMount(() => {
        getStats(currentCountry, currentYear);
    });
    onMount(getCountriesYears);
    /* 
	This function get years and countries to put them into the selects.
	We call it just once in the onMount and each time we need to update the selects,
	but taking care we are asking for all the data.
	*/
    async function getCountriesYears() {
        const res = await fetch(BASE_API_URL);
        /* Getting the countries for the select */
        if (res.ok) {
            const json = await res.json();
            countries = json.map((d) => {
                return d.country;
            });
            /* Deleting duplicated countries */
            countries = Array.from(new Set(countries));
            /* Getting the years for the select */
            years = json.map((d) => {
                return d.year;
            });
            /* Deleting duplicated years */
            years = Array.from(new Set(years));
            console.log(
                "Counted " +
                    countries.length +
                    "countries and " +
                    years.length +
                    "years."
            );
        } else {
            errorAlert(
                "Error interno al intentar obtener las ciudades y los años"
            );
            console.log("ERROR!");
        }
    }
    async function getStats(country, year) {
        console.log("Fetching illiteracy stats...");
        /* Checking if the fields are empty */
        var url = BASE_API_URL + "?limit=" + numberElementsPages;
        if (country != "-" && year != "-") {
            url = url + "&country=" + country + "&year=" + year;
        } else if (country != "-" && year == "-") {
            url = url + "&country=" + country;
        } else if (country == "-" && year != "-") {
            url = url + "&year=" + year;
        }
        const res = await fetch(
            url + "&offset=" + numberElementsPages * offset
        );
        /* Asking for the following data for the pagination */
        const next = await fetch(
            url + "&offset=" + numberElementsPages * (offset + 1)
        );
        if (res.ok && next.ok) {
            console.log("Ok:");
            const json = await res.json();
            const jsonNext = await next.json();
            illiteracyStats = json;
            /* Checking if we have run out of elements */
            if (jsonNext.length == 0) {
                moreData = false;
            } else {
                moreData = true;
            }
            console.log("Received " + illiteracyStats.length + " illiteracy stats.");
        } else {
            errorAlert("Error interno al intentar obtener todos los datos");
            console.log("ERROR!");
        }
    }
    async function loadInitialStats() {
        console.log("Loading initial illiteracy stats...");
        deleteStats();
        const res = await fetch(BASE_API_URL + "/loadInitialData").then(
            function (res) {
                if (res.ok) {
                    console.log("Ok");
                    /* Putting the current year and the country to remove the search */
                    currentYear = "-";
                    currentCountry = "-";
                    getStats(currentCountry, currentYear);
                    getCountriesYears();
                    initialDataAlert();
                } else {
                    errorAlert(
                        "Error interno al intentar obtener los datos iniciales"
                    );
                    console.log("ERROR!");
                }
            }
        );
    }
    async function insertStat() {
        console.log("Inserting illiteracy stats...");
        /* Checking if the country and the year are not empty */
        if (
            newilliteracyStat.country == "" ||
            newilliteracyStat.country == null ||
            newilliteracyStat.year == "" ||
            newilliteracyStat.year == null
        ) {
            alert(
                "Se debe incluir el nombre del país y el año obligatoriamente"
            );
        } else {
            const res = await fetch(BASE_API_URL, {
                method: "POST",
                body: JSON.stringify(newilliteracyStat),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(function (res) {
                if (res.ok) {
                    /* If we want the select to be updated each time we insert, uncomment the line below */
                    getCountriesYears();
                    getStats(currentCountry, currentYear);
                    insertAlert();
                } else if (res.status == 409) {
                    alert("¡Ya existe ese dato en nuestra base de datos!");
                } else {
                    errorAlert(
                        "Error interno al intentar insertar un elemento"
                    );
                }
            });
        }
    }
    async function deleteStat(country, year) {
        console.log("Deleting illiteracy stat...");
        const res = await fetch(BASE_API_URL + "/" + country + "/" + year, {
            method: "DELETE",
        }).then(function (res) {
            if (res.ok) {
                getStats(currentCountry, currentYear);
                /* If we want to delete the entry in the select, uncomment the line below */
                /* We decided to conserve the option because we find it more logic */
                getCountriesYears();
                deleteAlert();
            } else if (res.status == 404) {
                errorAlert("Se ha intentado borrar un elemento inexistente.");
            } else {
                errorAlert(
                    "Error interno al intentar borrar un elemento concreto"
                );
            }
        });
    }
    async function deleteStats() {
        console.log("Deleting illiteracy stats...");
        const res = await fetch(BASE_API_URL + "/", {
            method: "DELETE",
        }).then(function (res) {
            if (res.ok) {
                /* To put the correct number in pagination */
                setOffset(0);
                currentYear = "-";
                currentCountry = "-";
                getStats(currentCountry, currentYear);
                getCountriesYears();
                deleteAllAlert();
            } else {
                errorAlert(
                    "Error interno al intentar borrar todos los elementos"
                );
            }
        });
    }
    function search(country, year) {
        setOffset(0);
        getStats(country, year);
    }
    function setOffset(newOffset) {
        offset = newOffset;
        currentPage = newOffset + 1;
    }
    function addOffset(increment) {
        offset += increment;
        currentPage += increment;
        getStats(currentCountry, currentYear);
    }
    /* These functions are for the alerts */
    function insertAlert() {
        clearAlert();
        var alert_element = document.getElementById("div_alert");
        alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
        alert_element.className = "alert alert-dismissible in alert-success ";
        alert_element.innerHTML =
            "<strong>¡Dato insertado!</strong> El dato ha sido insertado correctamente";
        setTimeout(() => {
            clearAlert();
        }, 3000);
    }
    function deleteAlert() {
        clearAlert();
        var alert_element = document.getElementById("div_alert");
        alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
        alert_element.className = "alert alert-dismissible in alert-danger ";
        alert_element.innerHTML =
            "<strong>¡Dato borrado!</strong> El dato ha sido borrado correctamente";
        setTimeout(() => {
            clearAlert();
        }, 3000);
    }
    function deleteAllAlert() {
        clearAlert();
        var alert_element = document.getElementById("div_alert");
        alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
        alert_element.className = "alert alert-dismissible in alert-danger ";
        alert_element.innerHTML =
            "<strong>¡Datos borrados!</strong> Todos los datos han sido borrados correctamente";
        setTimeout(() => {
            clearAlert();
        }, 3000);
    }
    function initialDataAlert() {
        clearAlert();
        var alert_element = document.getElementById("div_alert");
        alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
        alert_element.className = "alert alert-dismissible in alert-warning ";
        alert_element.innerHTML =
            "<strong>¡Datos iniciales!</strong> Se han generado datos iniciales correctamente ";
        setTimeout(() => {
            clearAlert();
        }, 3000);
    }
    function errorAlert(error) {
        clearAlert();
        var alert_element = document.getElementById("div_alert");
        alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
        alert_element.className = "alert alert-dismissible in alert-danger ";
        alert_element.innerHTML =
            "<strong>¡ERROR!</strong> ¡Ha ocurrido un error! " + error;
        setTimeout(() => {
            clearAlert();
        }, 3000);
    }
    function clearAlert() {
        var alert_element = document.getElementById("div_alert");
        alert_element.style = "display: none; ";
        alert_element.className = "alert alert-dismissible in";
        alert_element.innerHTML = "";
    }
</script>

<main>
    <!-- This div is for the alerts -->
    <div role="alert" id="div_alert" style="display: none;" />
    {#await illiteracyStats}
        Loading illiteracy stats...
    {:then illiteracyStats}
        <FormGroup>
            <Label for="selectCountry">Búsqueda por país</Label>
            <Input
                type="select"
                name="selectCountry"
                id="selectCountry"
                bind:value={currentCountry}
            >
                {#each countries as country}
                    <!-- The if to conserve the option selected after search and delete -->
                    {#if country == currentCountry}
                        <option selected="selected">{country}</option>
                    {:else}
                        <option>{country}</option>
                    {/if}
                {/each}
                <option>-</option>
            </Input>
        </FormGroup>

        <FormGroup>
            <Label for="selectYear">Año</Label>
            <Input
                type="select"
                name="selectYear"
                id="selectYear"
                bind:value={currentYear}
            >
                {#each years as year}
                    <!-- The if to conserve the option selected after search and delete -->
                    {#if year == currentYear}
                        <option selected="selected">{year}</option>
                    {:else}
                        <option>{year}</option>
                    {/if}
                {/each}
                <option>-</option>
            </Input>
        </FormGroup>

        <Button
            outline
            color="secondary"
            on:click={search(currentCountry, currentYear)}
            class="button-search"
        >
            <i class="fas fa-search" /> Buscar
        </Button>

        <Table bordered>
            <thead>
                <tr>
                    <th> País </th>
                    <th>Año </th>
                    <th>Porcentaje de matrimonios </th>
                    <th>Porcentaje de divorcios </th>
                    <th>Ratio actual </th>
                    <th>Ratio porcentual </th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Input
                            type="text"
                            placeholder="Ej. Spain"
                            bind:value={newilliteracyStat.country}
                        />
                    </td>
                    <td>
                        <Input
                            type="number"
                            placeholder="Ej. 2020"
                            bind:value={newilliteracyStat.year}
                        />
                    </td>
                    <td>
                        <Input
                            type="number"
                            placeholder="0.0"
                            step="0.01"
                            min="0"
                            bind:value={newilliteracyStat["female_illiteracy_rate"]}
                        />
                    </td>
                    <td>
                        <Input
                            type="number"
                            placeholder="0.0"
                            step="0.01"
                            min="0"
                            bind:value={newilliteracyStat["male_illiteracy_rate"]}
                        />
                    </td>
                    <td>
                        <Input
                            type="number"
                            placeholder="0.0"
                            step="0.01"
                            min="0"
                            bind:value={newilliteracyStat["adult_illiteracy_rate"]}
                        />
                    </td>
                    <td>
                        <Button outline color="primary" on:click={insertStat}>
                            <i class="far fa-edit" /> Insertar
                        </Button>
                    </td>
                </tr>
                {#each illiteracyStats as stat}
                    <tr>
                        <td>
                            <a
                                href="#/illiteracy/{stat.country}/{stat.year}"
                            >
                                {stat.country}
                            </a>
                        </td>
                        <td> {stat.year} </td>
                        <td> {stat["female_illiteracy_rate"]} </td>
                        <td>
                            {stat["male_illiteracy_rate"]}
                        </td>
                        <td>
                            {stat["adult_illiteracy_rate"]}

                        </td>
                        <td>
                            {stat["young_illiteracy_rate"]}
                            
                        </td>
                        <td>
                            <Button
                                outline
                                color="danger"
                                on:click={deleteStat(
                                    stat.country,
                                    stat.year
                                )}
                            >
                                <i class="fa fa-trash" aria-hidden="true" /> Borrar
                            </Button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </Table>
    {/await}

    <Pagination style="float:right;" ariaLabel="Cambiar de página">
        <PaginationItem class={currentPage === 1 ? "disabled" : ""}>
            <PaginationLink
                previous
                href="#/illiteracyApp"
                on:click={() => addOffset(-1)}
            />
        </PaginationItem>

        <!-- If we are not in the first page-->
        {#if currentPage != 1}
            <PaginationItem>
                <PaginationLink href="#/illiteracyApp" on:click={() => addOffset(-1)}
                    >{currentPage - 1}</PaginationLink
                >
            </PaginationItem>
        {/if}
        <PaginationItem active>
            <PaginationLink href="#/illiteracyApp">{currentPage}</PaginationLink>
        </PaginationItem>

        <!-- If there are more elements-->
        {#if moreData}
            <PaginationItem>
                <PaginationLink href="#/illiteracyApp" on:click={() => addOffset(1)}
                    >{currentPage + 1}</PaginationLink
                >
            </PaginationItem>
        {/if}

        <PaginationItem class={moreData ? "" : "disabled"}>
            <PaginationLink
                next
                href="#/illiteracyApp"
                on:click={() => addOffset(1)}
            />
        </PaginationItem>
    </Pagination>

    <Button outline color="secondary" on:click={pop}>
        <i class="fas fa-arrow-circle-left" /> Atrás
    </Button>
    <Button outline color="warning" on:click={loadInitialStats}>
        <i class="fas fa-cloud-upload-alt" aria-hidden="true" /> Cargar datos iniciales
    </Button>
    <Button outline color="danger" on:click={deleteStats}>
        <i class="fa fa-trash" aria-hidden="true" /> Borrar todo
    </Button>
</main>