<script>
    import { Table , Button, Toast, ToastBody, ToastHeader, Col, Row, Container } from 'sveltestrap';

    //Incluimos la ruta donde se ejecuta el backend de la Api

    const BASE_API_PATH = "api/v1/poverty_risks";

    /* Creo un array para almacenar los datos
    guardados de las consultas al backend*/
    let datosRecibidos = [];

    //Variables auxiliares para la muestra de errores
    let mensajeError = ""

    async function getStats() {
        console.log("Fetching data...");
        /* Busqueda a la URL que se necesite
        (se le pueden pasar parámetros para modificar las consultas)
        Voy a tener una función para cada petición que quiera hacer.*/
        const res = await fetch(BASE_API_PATH); 
        if (res.ok) {
            const json = await res.json();
            /*Que espere la respuesta de la consulta y la guarde en
            un JSON.*/
            datosRecibidos = json;
            /*Y ahora la guardas en el array datosRecibidos.*/
            mensajeError = "";
        } else {
            if (datosRecibidos.length == 0) {
                mensajeError = "No hay datos disponibles";
            }
            if (res.status === 500) {
                mensajeError = "No se ha podido acceder a la base de datos";
            }
        }
    }

    getStats(); // Se carga la función cuando se cargan los scripts.


    let nuevoElemento = {
        "year" : "",
        "country" : "",
        "people_in_risk_of_poverty":"",
        "people_poverty_line":"",
        "home_poverty_line":"",
        "percentage_risk_of_poverty":""
    };

    function removeDataInserted(){
        nuevoElemento = {
        "year" : "",
        "country" : "",
        "people_in_risk_of_poverty":"",
        "people_poverty_line":"",
        "home_poverty_line":"",
        "percentage_risk_of_poverty":""
        };

    };

    async function insertData() {
    
    nuevoElemento.year = parseInt(nuevoElemento.year);
    nuevoElemento.country = String(nuevoElemento.country);
    nuevoElemento.people_in_risk_of_poverty = parseFloat(nuevoElemento.people_in_risk_of_poverty);
    nuevoElemento.people_poverty_line = parseFloat(nuevoElemento.people_poverty_line);
    nuevoElemento.home_poverty_line = parseFloat(nuevoElemento.home_poverty_line);
    nuevoElemento.percentage_risk_of_poverty = parseFloat(nuevoElemento.percentage_risk_of_poverty);
    const res = await fetch(BASE_API_PATH, {
      method: "POST",
      body: JSON.stringify(nuevoElemento),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (res) {
      if (res.ok) {
      } else {
        if (res.status === 409) {
          mensajeError = `Ya existe un dato con valores idénticos para los mismos campos.`;
        } else if (res.status === 500) {
          mensajeError = "No se ha podido acceder a la base de datos.";
        }else if(res.status === 400){
          mensajeError = "Todos los campos deben estar rellenados según el patron predefinido.";
        }
      }
      removeDataInserted();
      getStats();
        });
    }

    async function loadInitialData(){
        //Para cargarlos hacemos un fetch a la direccion donde está el método de carga inicial
        
        
        const peticionCarga = await fetch(BASE_API_PATH + '/loadInitialData'); //Se espera hasta que termine la peticion
        
        if(peticionCarga.ok){
            const peticionMuestra = await fetch(BASE_API_PATH); //Se accede a la toma de todos los elementos

            if(peticionMuestra.ok){
                console.log(" Receiving data, wait a moment ...")
                const data = await peticionMuestra.json();
                datosRecibidos = data;
                console.log(`Done! Received ${data.length} stats.`);
                console.log(datosRecibidos)
            }
            else{
                console.log("No data loaded.");
            }
        }
        else{
            console.log("Error loading data.");
        }
        console.log(datosRecibidos.length);
        
    
    }

    async function deleteElement(year, country) {
    
    const res = await fetch(
      BASE_API_PATH + "/" + country + "/" + year,
      {
        method: "DELETE",
      }
    ).then(function (res) {
      if (res.ok) {
        console.log("OK");
        getStats();
      } else {
        if (res.status === 404) {
          mensajeError = `No se puede eliminar, la entrada ${year}/${country} no existe`;
        } else if (res.status === 500) {
          mensajeError = "No se ha podido acceder a la base de datos";
        }
      }
    });
    }

    async function deleteAll() {
        console.log(datosRecibidos.length);
        
		
        const peticion = await fetch(BASE_API_PATH, {
			method: "DELETE"
		}).then(function (peticion) {
			
            if (peticion.ok){
                datosRecibidos = [];
			} 
            
            else if (peticion.status==404){ //no data found
                console.log("No data found"); //Posibilidad de redirigir a una ventana similar a la de error 404
			} 
            
            else  { 
				console.log("Error deleting DB stats");
			}
            console.log(datosRecibidos.length);
			
		});
	}

</script>

<main>

    <!-- Creamos un div para incluir dentro dos botones, uno para cargar datos y otro para borrarlos todos -->
    <div style="padding:1%">
            <Row>
                <Col>
                    {#if datosRecibidos.length!=0}
                    <Button style="background-color: green;" disabled>Cargar datos</Button>
                    <Button style="background-color: red;" on:click = {deleteAll}>Borrar datos</Button>
                    {:else}
                    <Button style="background-color: green;" on:click = {loadInitialData}>Cargar datos</Button>
                    <Button style="background-color: red;" disabled>Borrar datos</Button>
                    {/if}
                </Col>           
            </Row>
            <Row>
                <Col md=4>
                </Col>
                <Col md=4 style="text-align: center;">
                    {#if mensajeError.length!=0}
                    <p style="color:tomato">Se ha producido un error:<b> {mensajeError} </b></p>
                    {/if}
                </Col>
                <Col md=4>
                </Col>
                
            </Row>

    </div>

   <br>
    <!--Introducimos salto para separar contenido-->

    <!-- CREO LA ESTRUCTURA DE LA TABLA -->
    {#if datosRecibidos.length!=0}
        <Table>
            <!-- Incluye los nombres de los atributos -->
            <thead>  
                <tr style="text-align: center; " valign="middle">
                    <td valign="middle">Año</td>
                    <td valign="middle">País</td>
                    <td valign="middle">Persona en riesgo de pobreza</td>
                    <td valign="middle">Índice de riesgo de pobreza (persona)</td>
                    <td valign="middle">Índice de riesgo de pobreza (hogares)</td>
                    <td valign="middle">Porcentaje de riesgo de pobreza</td>
                    <td valign="middle"colspan="2"> Acciones </td>
                </tr>
            </thead>
            <tbody>

            <!--Incluimos el espacio de inserts--> 
                
            <tr>
                <!--Por cada campo haremos un input-->
                <td><input type="number" placeholder="2015" min=1900 bind:value={nuevoElemento.year}/></td>
                <td><input type="text" placeholder="Francia" bind:value={nuevoElemento.country}/></td>
                <td><input type="number" placeholder="8.474"  bind:value={nuevoElemento.people_in_risk_of_poverty}/></td>
                <td><input type="number" placeholder="12.849"  bind:value={nuevoElemento.people_poverty_line}/></td>
                <td><input type="number" placeholder="26.983"  bind:value={nuevoElemento.home_poverty_line}/></td>
                <td><input type="number" placeholder="13.6"  bind:value={nuevoElemento.percentage_risk_of_poverty}/></td>
                <td><button on:click={insertData} class="btn btn-success">Insertar</button></td>
                <td></td>
            </tr>

    
            <!-- Incluye cada uno de los elementos en el vector-->

            <!-- RELLENO LA TABLA CON DATOS -->
                {#each datosRecibidos as stat}
                <tr  style="text-align: center;">
                    <th>{stat.year}</th>
                    <th>{stat.country}</th>
                    <th>{stat.people_in_risk_of_poverty}</th>
                    <th>{stat.people_poverty_line}</th>
                    <th>{stat.home_poverty_line}</th>
                    <th>{stat.percentage_risk_of_poverty}</th>
                    <th><button class="btn btn-danger" on:click={deleteElement(stat.year,stat.country)}>Eliminar</button></th>

                </tr>
                {/each}
            </tbody>

    
        </Table>

        {:else}
            <div style="aling-items:center; justify-content:center;">
                <Row>
                    <Col md=12 style="text-align: center;">
                        <h2>No existen datos cargados. Por favor, pulse el botón "Cargar datos".</h2>
                    </Col>
                </Row>
            </div>
            
        {/if}

</main>

<style>
</style>
