<script>
    import { Table , Button, Col, Row } from 'sveltestrap';

    //Incluimos la ruta donde se ejecuta el backend de la Api
    const BASE_API_PATH = "api/v1/poverty_risks";

    /* Creo un array para almacenar los datos
    guardados de las consultas al backend*/
    let datosRecibidos = [];

    //Variables auxiliares para la muestra de errores
    let msjError = ""
    let msjOK = ""

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
            msjError = "";
            msjOK = "Datos cargados correctamente";
        } else {
            if (datosRecibidos.length == 0) {
                msjError = "No hay datos disponibles";
            }
            if (res.status === 500) {
                msjError = "No se ha podido acceder a la base de datos";
            }
        }
    }

    getStats(); // Se carga la función cuando se cargan los scripts.

    /*Creamos un elemento de tipo JSON para BUSCAR los datos,
    Porque mi API sólo funciona a partir de objetos JSON
    No lo puedo hacer de forma separada*/
    let parametrosBusqueda = {
        "c" : "",
        "y" : "",
        "aprp":"",
        "uprp":"",
        "appl":"",
        "uppl":"",
        "ahpl":"",
        "uhpl":"",
        "apercnt":"",
        "upercnt":""
    };

    /* Creo un array para almacenar los datos
    guardados de las BÚSQUEDAS*/
    let datosBusqueda = [];

    async function searchData() {
        console.log("Searching stat...");
        //Variable con la que luego crearemos las URL de las querys
        let queryVar = "?";

        /*Me devuelve los que tienen valores correctos, NO tienen valor "" (vacío).
        
        filter() llama a la función callback  sobre cada elemento del array,
        y construye un nuevo array con todos los valores para los cuales 
        callback devuelve un valor verdadero */
        var parameters = new Map(
        Object.entries(parametrosBusqueda).filter((cadaParametro) => {
        return cadaParametro[1] != "";
            })
        );
    
        for (var [clave, valor] of parameters.entries()) {
            queryVar += clave + "=" + valor + "&";
        }
        var theQuery = queryVar.slice(0, -1);
        console.log(theQuery);

        theQuery = (queryVar==="?")?"":queryVar;
        //Comprobamos si la query está vacía
        if (theQuery != "") {
        const res = await fetch(
        BASE_API_PATH +
          theQuery
      );
      if (res.ok) {
        console.log("OK");
        const json = await res.json();
       /* msjError = "";
        msjOK = "Estos son los resultados de la búsqueda:";*/
        console.log(JSON.stringify(json,null,2))
        if(json.length===undefined){
          datosBusqueda.push(json);
          console.log(datosBusqueda.length + " Datos: "+datosBusqueda);
            }
            else{
            datosBusqueda = json;
            }
            if (datosBusqueda.length==0) {
            msjError = "No existen datos con esos parámetros";
            }else{
                msjError = "";
                msjOK = "Estos son los resultados de la búsqueda"
            }
        } else {
            if (res.status === 404) {
            msjError = "No existen datos con esos parámetros";
            } else if (res.status === 500) {
            msjError = "Error al acceder a la base de datos";
                    }
                }
            } else {
            msjError = "Debe introducir por lo menos 1 parámetro de búsqueda";
            }

        }

    function resetQuery (){
    parametrosBusqueda = {
        "y" : "",
        "c" : "",
        "aprp":"",
        "uprp":"",
        "appl":"",
        "uppl":"",
        "ahpl":"",
        "uhpl":"",
        "apercnt":"",
        "upercnt":""
    };

    datosBusqueda = [];

    getStats();
  }


    //Creamos un elemento de tipo JSON para insertar nuevos datos,
    //Porque mi API sólo funciona a partir de objetos JSON
    //No lo puedo hacer de forma separada
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
        msjError = "";
        msjOK = "Dato cargado correctamente";
      } else {
        if (res.status === 409) {
          msjError = `Ya existe un dato con valores idénticos para los mismos campos.`;
        } else if (res.status === 500) {
          msjError = "No se ha podido acceder a la base de datos.";
        }else if(res.status === 400){
          msjError = "Todos los campos deben estar rellenados según el patron predefinido.";
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
                msjError = "";
                msjOK = "Datos insertados correctamente";
            }
            else{
                console.log("No data loaded.");
                msjError="Los datos no han podido cargarse";
            }
        }
        else{
            console.log("Error loading data.");
            msjError = "Error de acceso a BD";
        }
        console.log(datosRecibidos.length);
        
    
    }

    async function deleteElement(year, country) {
    let msjError = "";
    let msjOK = "";

    const res = await fetch(
      BASE_API_PATH + "/" + country + "/" + year,
      {
        method: "DELETE",
      }
    ).then(function (res) {
      if (res.ok) {
        console.log("OK");
        getStats();
        msjError = "";
        msjOK = "Dato eliminado correctamente";
      } else {
        if (res.status === 404) {
          msjError = `No se puede eliminar, la entrada ${year}/${country} no existe`;
        } else if (res.status === 500) {
          msjError = "Error al acceder a la base de datos";
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
                msjError = "";
                msjOK = "Datos eliminados correctamente";
			} 
            
            else if (peticion.status==404){ //no data found
                console.log("No data found");
                msjError = "No hay datos que eliminar";
			} 
            
            else  { 
				console.log("Error deleting DB stats");
                msjError = "No se puede acceder a la base de datos";
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
                    <a href="#/poverty_risks"><Button style="background-color: blue;">Página principal</Button></a>
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
                    {#if msjError.length!=0}
                    <p style="color:tomato">Se ha producido un error:<b> {msjError} </b></p>
                    {/if}
                    {#if msjOK.length!=0}
                    <p class="msjOK"><b> {msjOK} </b></p>
                    {/if}
                </Col>
                <Col md=4>
                </Col>
                
            </Row>

    </div>

   <br>
    <!--Introducimos salto para separar contenido-->

    <h3>Búsqueda</h3>

    <!-- CREO LA ESTRUCTURA DE LA TABLA DE BÚSQUEDAS -->
        <Table>
            <!-- Incluye los nombres de los atributos -->
            <thead>  
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

            <!--Incluimos el espacio de inserts--> 
                
            <tr>
                <!--Por cada campo haremos un input-->
                <td><input type="number" placeholder="2015" min=1900 bind:value={parametrosBusqueda.y}/></td>
                <td><input type="text" placeholder="Francia" bind:value={parametrosBusqueda.c}/></td>
                <td>
                    <input type="text" placeholder="min"  bind:value={parametrosBusqueda.aprp}/>
                    <input type="text" placeholder="max"  bind:value={parametrosBusqueda.uprp}/>
                </td>
                <td>
                    <input type="text" placeholder="min"  bind:value={parametrosBusqueda.appl}/>
                    <input type="text" placeholder="max"  bind:value={parametrosBusqueda.uppl}/>
                </td>
                <td>
                    <input type="text" placeholder="min"  bind:value={parametrosBusqueda.ahpl}/>
                    <input type="text" placeholder="max"  bind:value={parametrosBusqueda.uhpl}/>
                </td>
                <td>
                    <input type="text" placeholder="min"  bind:value={parametrosBusqueda.apercnt}/>
                    <input type="text" placeholder="max"  bind:value={parametrosBusqueda.upercnt}/>
                </td>
                <td><button on:click={searchData} class="btn btn-primary">Buscar</button></td>
                <td><button on:click={resetQuery} class="btn btn-secondary">Resetear</button></td>
                <td></td>
            </tr>

            </tbody>

    
        </Table>

    <!--Introducimos salto para separar contenido-->

    <h3>Listado de datos</h3>

    <!-- CREO LA ESTRUCTURA DE LA TABLA -->

    {#if datosBusqueda.length!=0}
        {#if datosBusqueda.length!=0}
        <Table>
            <!-- Incluye los nombres de los atributos -->
            <thead>  
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
    
            <!-- Incluye cada uno de los elementos en el vector-->

            <!-- RELLENO LA TABLA CON DATOS -->
                {#each datosBusqueda as stat}
                <tr  style="text-align: center;">
                    <th>{stat.year}</th>
                    <th>{stat.country}</th>
                    <th>{stat.people_in_risk_of_poverty}</th>
                    <th>{stat.people_poverty_line}</th>
                    <th>{stat.home_poverty_line}</th>
                    <th>{stat.percentage_risk_of_poverty}</th>
                    <th><button class="btn btn-danger" on:click={deleteElement(stat.year,stat.country)}>Borrar</button></th>
                    <th><a href='#/poverty_risks/{stat.country}/{stat.year}'><button class="btn btn-warning">Editar</button></a></th>
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
    
    {:else}
    {#if datosRecibidos.length!=0} <!--Por el contrario si no se ha hecho ninguna búsqueda -->
        <Table>
            <!-- Incluye los nombres de los atributos -->
            <thead>  
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
                    <th><button class="btn btn-danger" on:click={deleteElement(stat.year,stat.country)}>Borrar</button></th>
                    <th><a href='#/poverty_risks/{stat.country}/{stat.year}'><button class="btn btn-warning">Editar</button></a></th>
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
    {/if}

</main>

<style>

main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

</style>
