<script>
    import { Table , Button, Col, Row } from 'sveltestrap';
    import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';

    //Incluimos la ruta donde se ejecuta el backend de la Api
    const BASE_API_PATH = "api/v1/poverty_risks";

    /* Creo un array para almacenar los datos
    guardados de las consultas al backend*/
    let datosRecibidos = [];
    let datosRecibidosSinLimit=[];
    let superBusqueda=[];

    //Variables auxiliares para la muestra de errores
    let msjError = ""
    let msjOK = ""

    //Variables de paginacion
	let limit = 10;
	let offset = 0;
	let masDatos = true;
    /* No la utilizamos pero nos sirve para saber
    en que pagina estamos (quizas en un futuro)*/
	let currentPage=1;

     //Variables de paginacion
	let limitBusqueda = 10;
	let offsetBusqueda = 0;
	let masDatosBusqueda = true;
    /* No la utilizamos pero nos sirve para saber
    en que pagina estamos (quizas en un futuro)*/
	let currentPageBusqueda=1;


    async function getStats() {
        console.log("Fetching data...");
        /* Busqueda a la URL que se necesite
        (se le pueden pasar parámetros para modificar las consultas)
        Voy a tener una función para cada petición que quiera hacer.*/
        const res = await fetch(BASE_API_PATH+"?"+"limit="+limit+"&skip="+(offset*limit));
        const resSinLimit = await fetch(BASE_API_PATH); 
        if (res.ok) {
            const json = await res.json();
            const jsonSinLimit = await resSinLimit.json();
            /*Que espere la respuesta de la consulta y la guarde en
            un JSON.*/
            datosRecibidos = json;
            datosRecibidosSinLimit = jsonSinLimit;
            /*Y ahora la guardas en el array datosRecibidos.*/
            msjError = "";
            msjOK = "Datos cargados correctamente";
            console.log(JSON.stringify(datosRecibidos,null,2));
            console.log(datosRecibidos.length +" Datos Recibidos");
            console.log(datosRecibidosSinLimit.length +": Nº Datos Totales");
            console.log((Math.ceil(datosRecibidosSinLimit.length / limit))+": Nº max pag(Math.ceil)");
            console.log(currentPage+": currentPage");
            console.log(res);
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
    let datosBusquedaSinLimit=[];
    let queryVarConLimitOffset= "";

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
        queryVarConLimitOffset +=queryVar+ "limit" + "=" + limitBusqueda + "&" + "skip" + "="+(offsetBusqueda*limitBusqueda);
        console.log((offsetBusqueda*limitBusqueda)+ " : offsetBusqueda*limitBusqueda");
        //var theQuery = queryVarConLimitOffset.slice(0, -1);
        var theQuery = "";
        // console.log(queryVar+ " : queryVar");
        //console.log(queryVarConLimitOffset+ " : queryVarConLimitOffset");

        theQuery = (queryVarConLimitOffset==="?")?"":queryVarConLimitOffset;
        //console.log(theQuery+ " : theQuery");
        console.log(BASE_API_PATH + theQuery + " : BASE_API_PATH + theQuery");
        //Comprobamos si la query está vacía
        if (theQuery != "") {
        const res = await fetch(
        BASE_API_PATH +
          theQuery
      );

      const resBusqueda = await fetch(
        BASE_API_PATH +
          queryVar
      );

      if (res.ok) {
        console.log("OK");
        const json = await res.json();
        const jsonBusqueda = await resBusqueda.json();
       /* msjError = "";
        msjOK = "Estos son los resultados de la búsqueda:";*/
        console.log(JSON.stringify(json,null,2))
        if(json.length===undefined){
          datosBusqueda.push(json);
          console.log(datosBusqueda.length + " Datos: "+datosBusqueda);
            }
            else{
            datosBusqueda = json;
            datosBusquedaSinLimit=jsonBusqueda;
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
          alert("Ya existe un dato con valores idénticos para los mismos campos.");
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
        //const numTotalDatos = await fetch(BASE_API_PATH);
        if(peticionCarga.ok){
            const peticionMuestra = await fetch(BASE_API_PATH+"?"+"limit="+limit+"&offset="+(offset*limit)); //Se accede a la toma de todos los elementos

            if(peticionMuestra.ok){
                console.log(" Receiving data, wait a moment ...")
                const data = await peticionMuestra.json();
                datosRecibidos = data;
                //const numData= await numTotalDatos.json();
                //datosRecibidosSinLimit = numTotalDatos;
                console.log(`Done! Received ${data.length} stats.`);
                //console.log( datosRecibidosSinLimit.length+": Datos Totales Búsqueda");
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

        console.log(datosRecibidos.length +" Datos Recibidos");
        console.log(currentPage+": currentPage");
        console.log(datosRecibidosSinLimit.length +": Nº Datos Totales");
        console.log((Math.ceil(datosRecibidosSinLimit.length) / limit)+": Math.ceil");   

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

    function changePage(increment){
		offset += increment;
		currentPage += increment;
        console.log("Cambiando de página");
		getStats();
	}

    function changePageBusqueda(increment){
		offsetBusqueda += increment;
		currentPageBusqueda += increment;
        console.log("Cambiando de página en búsqueda");

        if(increment>0){
            superBusquedaPositiva();
        }else{
            superBusquedaNegativa();
        }
		
	}

    async function superBusquedaPositiva(increment){
		offsetBusqueda += increment;
		currentPageBusqueda += increment;
        console.log("Cambiando de página en búsqueda");
		
        const ressuperBusqueda = await fetch(BASE_API_PATH+"?"+ "apercnt=0&upercnt=90&limit="+limit+"&skip="+(0));
        if (ressuperBusqueda.ok) {
            const jsonsuperBusqueda = await ressuperBusqueda.json();
            /*Que espere la respuesta de la consulta y la guarde en
            un JSON.*/
            superBusqueda = jsonsuperBusqueda;
            /*Y ahora la guardas en el array datosRecibidos.*/
            msjError = "";
            msjOK = "Datos cargados correctamente";
            console.log(JSON.stringify(superBusqueda,null,2));
            console.log(superBusqueda.length +" Datos Recibidos");
            console.log(currentPageBusqueda+": currentPage");
            console.log(superBusqueda);
        } else {
            if (superBusqueda.length == 0) {
                msjError = "No hay datos disponibles";
            }
            if (ressuperBusqueda.status === 500) {
                msjError = "No se ha podido acceder a la base de datos";
            }
        }

	}


    async function superBusquedaNegativa(increment){
		offsetBusqueda += increment;
		currentPageBusqueda += increment;
        console.log("Cambiando de página en búsqueda");
		
        const ressuperBusqueda = await fetch(BASE_API_PATH+"?"+ "apercnt=0&upercnt=90&limit="+limit+"&skip="+(10));
        if (ressuperBusqueda.ok) {
            const jsonsuperBusqueda = await ressuperBusqueda.json();
            /*Que espere la respuesta de la consulta y la guarde en
            un JSON.*/
            superBusqueda = jsonsuperBusqueda;
            /*Y ahora la guardas en el array datosRecibidos.*/
            msjError = "";
            msjOK = "Datos cargados correctamente";
            console.log(JSON.stringify(superBusqueda,null,2));
            console.log(superBusqueda.length +" Datos Recibidos");
            console.log(currentPageBusqueda+": currentPage");
            console.log(superBusqueda);
        } else {
            if (superBusqueda.length == 0) {
                msjError = "No hay datos disponibles";
            }
            if (ressuperBusqueda.status === 500) {
                msjError = "No se ha podido acceder a la base de datos";
            }
        }

	}


</script>

<main>

    <!-- Creamos un div para incluir dentro dos botones, uno para cargar datos y otro para borrarlos todos -->
    <div style="padding:1%">
            <Row>
                <Col>
                    {#if datosRecibidos.length!=0}
                    <Button style="background-color: green;" disabled>Cargar datos</Button>
                    <Button id="borrarDatos"style="background-color: red;" on:click = {deleteAll}>Borrar datos</Button>
                    <!-- <a href="#/poverty_risks"><Button style="background-color: blue;">Página principal</Button></a> -->
                    {:else}
                    <Button id="cargarDatos" style="background-color: green;" on:click = {loadInitialData}>Cargar datos</Button>
                    <Button style="background-color: red;" disabled>Borrar datos</Button>
                    {/if}
                </Col>           
            </Row>
            <br>
            <br>
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
                <td><input id='#query_input_date' type="number" placeholder="2015" min=1900 bind:value={parametrosBusqueda.y}/></td>
                <td><input id='#query_input_country' type="text" placeholder="Francia" bind:value={parametrosBusqueda.c}/></td>
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
                <td><button id='#query_button' on:click={searchData} class="btn btn-primary">Buscar</button></td>
                <td><button on:click={resetQuery} class="btn btn-secondary">Resetear</button></td>
                <td></td>
            </tr>

            </tbody>

    
        </Table>

    <!--Introducimos salto para separar contenido-->

    <h3>Listado de datos</h3>

    <!-- CREO LA ESTRUCTURA DE LA TABLA -->
    {#if superBusqueda.length!=0}
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
                {#each superBusqueda as stat}
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

        <!-- Funcionando -->
            
            <Pagination ariaLabel ="Web Pagination">
                <PaginationItem class="{currentPageBusqueda===1? 'disabled' : ''}">
                    <PaginationLink previous href="#/poverty_risks" on:click="{() =>changePageBusqueda(-1)}" />
                </PaginationItem>
                {#if masDatosBusqueda}
                <PaginationItem class="{currentPageBusqueda===(Math.ceil(datosBusquedaSinLimit.length / limit))? 'disabled' : ''}">
                    <PaginationLink next href="#/poverty_risks" on:click="{() => changePageBusqueda(1)}"/>
                </PaginationItem>
                {/if}
            </Pagination>
    
        </Table>
        {/if}

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

        <!-- Funcionando -->
            
            <Pagination ariaLabel ="Web Pagination">
                <PaginationItem class="{currentPageBusqueda===1? 'disabled' : ''}">
                    <PaginationLink previous href="#/poverty_risks" on:click="{() =>changePageBusqueda(-1)}" />
                </PaginationItem>
                {#if masDatosBusqueda}
                <PaginationItem class="{currentPageBusqueda===(Math.ceil(datosBusquedaSinLimit.length / limit))? 'disabled' : ''}">
                    <PaginationLink next href="#/poverty_risks" on:click="{() => changePageBusqueda(1)}"/>
                </PaginationItem>
                {/if}
            </Pagination>
    
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
                <td><input id='#insert_input_year' type="number" placeholder="2015" min=1900 bind:value={nuevoElemento.year}/></td>
                <td><input id='#insert_input_country' type="text" placeholder="Francia" bind:value={nuevoElemento.country}/></td>
                <td><input id='#insert_input_people_in_risk_of_poverty' type="number" placeholder="8.474"  bind:value={nuevoElemento.people_in_risk_of_poverty}/></td>
                <td><input id='#insert_input_country' type="number" placeholder="12.849"  bind:value={nuevoElemento.people_poverty_line}/></td>
                <td><input id='#insert_input_country' type="number" placeholder="26.983"  bind:value={nuevoElemento.home_poverty_line}/></td>
                <td><input id='#insert_input_country' type="number" placeholder="13.6"  bind:value={nuevoElemento.percentage_risk_of_poverty}/></td>
                <td><button id='#insert_button' on:click={insertData} class="btn btn-success">Insertar</button></td>
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

            <!--  Funcionando   -->

            <Pagination ariaLabel ="Web Pagination">
                <PaginationItem id="#pagination_forward" class="{currentPage===1? 'disabled' : ''}">
                    <PaginationLink previous href="#/poverty_risks" on:click="{() =>changePage(-1)}" />
                </PaginationItem>
                {#if masDatos}
                <PaginationItem id="#pagination_back" class="{currentPage===(Math.ceil(datosRecibidosSinLimit.length / limit))? 'disabled' : ''}">
                    <PaginationLink next href="#/poverty_risks" on:click="{() => changePage(1)}"/>
                </PaginationItem>
                {/if}
            </Pagination>
    
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
