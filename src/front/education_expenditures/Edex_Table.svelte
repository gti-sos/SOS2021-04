<script>
    import { Table , Button, Col, Row,
    Nav,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    NavItem,
    NavLink,
    Pagination,
    PaginationItem,
    PaginationLink, } from 'sveltestrap';

    //Incluimos la ruta donde se ejecuta el backend de la Api
    
    const BASE_API_PATH = "api/v1/education_expenditures";
    
    
    //Creamos un elemento de tipo Json para insertar nuevos datos

    let nuevoElemento = {
        "year" : "",
        "country" : "",
        "education_expenditure_per_millions":"",
        "education_expenditure_per_public_expenditure":"",
        "education_expenditure_gdp":"",
        "education_expenditure_per_capita":""
    };

    let query = {
      "c" :"",    
      "y":"",
      
      "apm":"",            // aquellos que están por encima de un gasto de x millones en educacion
      "upm" :"",   // aquellos que están por debajo de un gasto de x millones en educacion
    
      "app":"",            //aquellos que están por encima de un porcentaje x de gasto publico en educacion
      "upp":"",   //aquellos que están por debajo de un porcentaje x de gasto publico en educacion
            
      "agdp":"",           //aquellos que están por encima de un porcentaje x de pib en gasto publico en educacion
      "ugdp":"",   //aquellos que están por debajo de un porcentaje x de pib en gasto publico en educacion        
    
      "apc":"",            //aquellos que están por encima de una cantidad x per capita de gasto en educacion
      "upc":""    //aquellos que están por debajo de una cantidad x per capita de gasto en educacion

    };

    //Variables auxiliares para la muestra de errores
    let mensajeError = ""

    //Creamos variables para paginación

    let offset_actual = 0;
    let limit = 10; //Limite por defecto, opcional
    let pagina_actual = 1;
    let ultima_pagina = 1; //Se debe actualizar en función de los datos que tengamos
    let totalDatos = 0;
    let esBusqueda = false;

    //Cargamos los datos iniciales

    var charged = false;
    var edex_data = [];

  

    //Función asincrona para la carga de datos

    async function getStats() {
      esBusqueda = false;
      console.log("Fetching data...");
      const res = await fetch(
      BASE_API_PATH + "?&limit=" + limit + "&skip="+offset_actual
      );
      if (res.ok) {
        console.log(BASE_API_PATH + "?&limit=" + limit + "&skip="+offset_actual);
        const json = await res.json();
        if(json.length===undefined){
          edex_data = [];
          edex_data.push(json);
          console.log(edex_data.length + " Datos: "+edex_data);
          ultima_pagina = 1;
        }
        else{
          edex_data = json;
          ultima_pagina = Math.ceil(edex_data.length / limit);
        }
        mensajeError="";
      } else {
        if (res.status === 500) {
          mensajeError = "No se ha podido acceder a la base de datos";
        }
        if (edex_data.length === 0) {
          mensajeError = "No hay datos disponibles";
        }
        
      } 
  }

    async function loadInitialData(){
        //Para cargarlos hacemos un fetch a la direccion donde está el método de carga inicial
        
        
        const peticionCarga = await fetch(BASE_API_PATH + '/loadInitialData'); //Se espera hasta que termine la peticion
        
        if(peticionCarga.ok){
            const peticionMuestra = await fetch(BASE_API_PATH); //Se accede a la toma de todos los elementos

            if(peticionMuestra.ok){
                console.log(" Receiving data, wait a moment ...")
                const data = await peticionMuestra.json();
                edex_data = data;
                console.log(`Done! Received ${data.length} stats.`);
                console.log(edex_data)
            }
            else{
                console.log("No data loaded.");
            }
        }
        else{
            console.log("Error loading data.");
        }
        charged = true;
        console.log(edex_data.length);
        
    
    }
        
    async function deleteAll() {
        console.log(edex_data.length);
        
		
        const peticion = await fetch(BASE_API_PATH, {
			method: "DELETE"
		}).then(function (peticion) {
			
            if (peticion.ok){
                edex_data = [];
                charged = false;
			} 
            
            else if (peticion.status==404){ //no data found
                console.log("No data found"); //Posibilidad de redirigir a una ventana similar a la de error 404
			} 
            
            else  { 
				console.log("Error deleting DB stats");
			}
            console.log(edex_data.length);
			
		});
	}

    function removeDataInserted(){
        nuevoElemento = {
        "year" : "",
        "country" : "",
        "education_expenditure_per_millions":"",
        "education_expenditure_per_public_expenditure":"",
        "education_expenditure_gdp":"",
        "education_expenditure_per_capita":""
        };

    };

    async function insertData() {
    
      nuevoElemento.year = parseInt(nuevoElemento.year);
      nuevoElemento.country = String(nuevoElemento.country);
      nuevoElemento.education_expenditure_per_millions = parseFloat(nuevoElemento.education_expenditure_per_millions);
      nuevoElemento.education_expenditure_per_public_expenditure = parseFloat(nuevoElemento.education_expenditure_per_public_expenditure);
      nuevoElemento.education_expenditure_gdp = parseFloat(nuevoElemento.education_expenditure_gdp);
      nuevoElemento.education_expenditure_per_capita = parseFloat(nuevoElemento.education_expenditure_per_capita);
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

  async function searchStat() {
    esBusqueda = true;

    
    var parametros = new Map(
      Object.entries(query).filter((introducidos) => {
        return introducidos[1] != "";
      })
    );
    let simboloQuery = "?";
    let i = 0; //Contador para saber cuando llega al ultimo par
    for (var [clave, valor] of parametros.entries()) {
      i=i+1;
      if(i===parametros.entries().length){
        simboloQuery += clave + "=" + valor;}
      else{
        simboloQuery += clave + "=" + valor + "&";}
        
    }
    var fullQuery = "";
    fullQuery = (simboloQuery==="?")?"":simboloQuery;
    //Comprobamos si la query está vacía
    if (fullQuery != "") {
      const res = await fetch(
        BASE_API_PATH +
          fullQuery + "&limit=" + limit + "&skip="+offset_actual
      );
      if (res.ok) {
        console.log("OK");
        const json = await res.json();
        if(json.length===undefined){
          edex_data = [];
          edex_data.push(json);
          console.log(edex_data.length + " Datos: "+edex_data);
          ultima_pagina = 1;
        }
        else{
          edex_data = json;
          ultima_pagina = Math.ceil(edex_data.length / limit);
        }
      } else {
        if (res.status === 404) {
          mensajeError = "No existen datos con esos parámetros";
        } else if (res.status === 500) {
          mensajeError = "No se ha podido acceder a la base de datos";
        }
      }
    } else {
      mensajeError = "Debe existir al menos un parámetro para realizar la búsqueda";
    }
    console.log(query);
     //Cargamos los datos en la tabla
  }

  function borrarQuery (){
    query = {
      "c" :"",    
      "y":"",
      "apm":"",          
      "upm" :"",   
      "app":"",            
      "upp":"",   
      "agdp":"",           
      "ugdp":"",         
      "apc":"",            
      "upc":""
    };

    getStats();

  }

  function cambiaPagina(pagina, offset, busqueda){
    ultima_pagina = Math.ceil(totalDatos / limit); //Usamos la función matematica techo -> menor numero entero mayor que el resultado
    offset_actual = offset;
    pagina_actual = pagina;
    if(busqueda){
      searchStat()
    }
    else{
      getStats();
    }
  }
  function range(tamano, inicio = 0) {
    return [...Array(tamano).keys()].map((i) => i + inicio);
  }

</script>

<main>
    <!-- Creamos un div para incluir dentro dos botones, uno para cargar datos y otro para borrarlos todos -->
    <div style="padding:1%">
            <Row>
                <Col>
                    {#if edex_data.length!=0}
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
    <div>
      {#if edex_data.length> 1}
        <Table>
          <!-- Incluye los nombres de los atributos para Búsquedas-->
          <thead>  
            
            <tr style="text-align: center; background-color: rgb(245, 181, 128);" valign="middle">
              <td valign="middle"></td>
              <td valign="middle"></td>
              <td valign="middle"></td>
              <td valign="middle"><h3> Busqueda</h3> </td>
              <td valign="middle"></td>
              <td valign="middle"></td>
              <td valign="middle"colspan="2"></td>
          </tr>

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

          <!--Incluimos el espacio de inserts para búsquedas--> 

              <tr style="text-align: center; align-items: center; max-width: 100%;">
                  <!--Por cada campo haremos un input-->
                  <td><input type="number" placeholder="2010" min=1950 bind:value={query.y}/></td>
                  <td><input type="text" placeholder="Francia" bind:value={query.c}/></td>
                  <td>
                    <input type="number" placeholder="min"  bind:value={query.apm}/>
                    <input type="number" placeholder="max"  bind:value={query.upm}/>
                  
                  </td>
                  <td>
                    <input type="number" placeholder="min"  bind:value={query.app}/>
                    <input type="number" placeholder="max"  bind:value={query.upp}/>
                  </td>
                  <td>
                    <input type="number" placeholder="max"  bind:value={query.agdp}/>
                    <input type="number" placeholder="min"  bind:value={query.ugdp}/>
                  </td>

                  <td>
                    <div class ="row col-xs-12">
                    <input type="number" placeholder="max"  bind:value={query.apc} class="col-xs-12"/>
                    <input type="number" placeholder="min"  bind:value={query.upc} class="col-xs-12"/>
                  </div>
                  </td>

                  <td><button class="btn btn-primary" on:click={searchStat}>Buscar</button></td>
                  <td><button class="btn btn-dark" on:click={borrarQuery}>Restaurar</button></td>
                  
              </tr>

          </tbody>
        </Table>

        <!--Tabla de Datos-->

        <Table>
            <!-- Incluye los nombres de los atributos -->
            <thead>  
              <tr style="text-align: center; background-color: rgb(245, 181, 128); max-width: 100%;" valign="middle">
                <td valign="middle"></td>
                <td valign="middle"></td>
                <td valign="middle"></td>
                <td valign="middle"> <h3>Datos</h3></td>
                <td valign="middle"></td>
                <td valign="middle"></td>
                <td valign="middle" colspan="2"></td>
                
                
            </tr>
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

            <!--Incluimos el espacio de inserts--> 

                <tr>
                    <!--Por cada campo haremos un input-->
                      <td><input type="number" placeholder="2010" min=1900 bind:value={nuevoElemento.year}/></td>
                      <td><input type="text" placeholder="Francia" bind:value={nuevoElemento.country}/></td>
                      <td><input type="number" placeholder="250.4"  bind:value={nuevoElemento.education_expenditure_per_millions}/></td>
                      <td><input type="number" placeholder="112.3"  bind:value={nuevoElemento.education_expenditure_per_public_expenditure}/></td>
                      <td><input type="number" placeholder="2.5"  bind:value={nuevoElemento.education_expenditure_gdp}/></td>
                      <td><input type="number" placeholder="2010"  bind:value={nuevoElemento.education_expenditure_per_capita}/></td>
                      <td><button on:click={insertData} class="btn btn-success">Insertar</button></td>
                      <td></td>
                </tr>

                {#each edex_data as stat}
                  <tr  style="text-align: center;">
                      <th>{stat.year}</th>
                      <th>{stat.country}</th>
                      <th>{stat.education_expenditure_per_millions}</th>
                      <th>{stat.education_expenditure_per_public_expenditure}</th>
                      <th>{stat.education_expenditure_gdp}</th>
                      <th>{stat.education_expenditure_per_capita}</th>
                      <th><button class="btn btn-danger" on:click={deleteElement(stat.year,stat.country)}>Eliminar</button></th>
                      <th><a href='#/education_expenditures/{stat.country}/{stat.year}'><button class="btn btn-warning">Modificar</button></a></th>

                  </tr>
                {/each}


        </Table>

        <div>
          <!-- Pagination -->
          <Pagination ariaLabel="Web pagination">
            <PaginationItem class={pagina_actual === 1 ? "disabled" : ""}>
              <PaginationLink
                previous
                href="#/education_expenditures"
                on:click={() =>
                  cambiaPagina(pagina_actual - 1, offset_actual - 10, esBusqueda)}
              />
            </PaginationItem>
            {#each range(ultima_pagina,1) as pagina}
              <PaginationItem class={pagina_actual === pagina ? "active" : ""}>
                <PaginationLink
                  previous
                  href="#/education_expenditures"
                  on:click={() => cambiaPagina(pagina, (pagina - 1) * 10, esBusqueda)}
                  >{pagina}</PaginationLink
                >
              </PaginationItem>
            {/each}
            <PaginationItem class={pagina_actual === ultima_pagina ? "disabled" : ""}>
              <PaginationLink
                next
                href="#/education_expenditures"
                on:click={() =>
                  cambiaPagina(pagina_actual + 1, offset_actual + 10, esBusqueda)}
              />
            </PaginationItem>
          </Pagination>
        </div>



      {/if}
      

    
            <!-- Incluye cada uno de los elementos en el vector-->
          

      {#if edex_data.length==1}

        <Table>
          <!-- Incluye los nombres de los atributos para Búsquedas-->
          <thead>  
            
            <tr style="text-align: center; background-color: rgb(245, 181, 128);" valign="middle">
              <td valign="middle"></td>
              <td valign="middle"></td>
              <td valign="middle"></td>
              <td valign="middle"><h3> Busqueda</h3> </td>
              <td valign="middle"></td>
              <td valign="middle"></td>
              <td valign="middle"colspan="2"></td>
          </tr>

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

          <!--Incluimos el espacio de inserts para búsquedas--> 

              <tr style="text-align: center; align-items: center; max-width: 100%;">
                  <!--Por cada campo haremos un input-->
                  <td><input type="number" placeholder="2010" min=1950 bind:value={query.y}/></td>
                  <td><input type="text" placeholder="Francia" bind:value={query.c}/></td>
                  <td>
                    <input type="number" placeholder="min"  bind:value={query.apm}/>
                    <input type="number" placeholder="max"  bind:value={query.upm}/>
                  
                  </td>
                  <td>
                    <input type="number" placeholder="min"  bind:value={query.app}/>
                    <input type="number" placeholder="max"  bind:value={query.upp}/>
                  </td>
                  <td>
                    <input type="number" placeholder="max"  bind:value={query.agdp}/>
                    <input type="number" placeholder="min"  bind:value={query.ugdp}/>
                  </td>

                  <td>
                    <div class ="row col-xs-12">
                    <input type="number" placeholder="max"  bind:value={query.apc} class="col-xs-12"/>
                    <input type="number" placeholder="min"  bind:value={query.upc} class="col-xs-12"/>
                  </div>
                  </td>

                  <td><button class="btn btn-primary" on:click={searchStat}>Buscar</button></td>
                  <td><button class="btn btn-dark" on:click={borrarQuery}>Restaurar</button></td>
                  
              </tr>

          </tbody>
        </Table>
                <!--Para evitar errores, en el caso de que solo haya un elemento se introduce manualmente-->
                <Table>
                  <!-- Incluye los nombres de los atributos -->
                  <thead>  
                    <tr style="text-align: center; background-color: rgb(245, 181, 128); max-width: 100%;" valign="middle">
                      <td valign="middle"></td>
                      <td valign="middle"></td>
                      <td valign="middle"></td>
                      <td valign="middle"> <h3>Datos</h3></td>
                      <td valign="middle"></td>
                      <td valign="middle"></td>
                      <td valign="middle" colspan="2"></td>
                      
                      
                  </tr>
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
      
                  <!--Incluimos el espacio de inserts--> 

                  <tr>
                    <!--Por cada campo haremos un input-->
                      <td><input type="number" placeholder="2010" min=1900 bind:value={nuevoElemento.year}/></td>
                      <td><input type="text" placeholder="Francia" bind:value={nuevoElemento.country}/></td>
                      <td><input type="number" placeholder="250.4"  bind:value={nuevoElemento.education_expenditure_per_millions}/></td>
                      <td><input type="number" placeholder="112.3"  bind:value={nuevoElemento.education_expenditure_per_public_expenditure}/></td>
                      <td><input type="number" placeholder="2.5"  bind:value={nuevoElemento.education_expenditure_gdp}/></td>
                      <td><input type="number" placeholder="2010"  bind:value={nuevoElemento.education_expenditure_per_capita}/></td>
                      <td><button on:click={insertData} class="btn btn-success">Insertar</button></td>
                      <td></td>
                </tr>
      
                  <tr  style="text-align: center;">
                    <th>{edex_data[0].year}</th>
                      <th>{edex_data[0].country}</th>
                      <th>{edex_data[0].education_expenditure_per_millions}</th>
                      <th>{edex_data[0].education_expenditure_per_public_expenditure}</th>
                      <th>{edex_data[0].education_expenditure_gdp}</th>
                      <th>{edex_data[0].education_expenditure_per_capita}</th>
                      <th><button class="btn btn-danger" on:click={deleteElement(edex_data[0].year,edex_data[0].country)}>Eliminar</button></th>
                      <th><a href='#/education_expenditures/{edex_data[0].country}/{edex_data[0].year}'><button class="btn btn-warning">Modificar</button></a></th>
                          </tr>
                </tbody>
              </Table>
              <div>
                <!-- Pagination -->
                <Pagination ariaLabel="Web pagination">
                  <PaginationItem class={pagina_actual === 1 ? "disabled" : ""}>
                    <PaginationLink
                      previous
                      href="#/education_expenditures"
                      on:click={() =>
                        cambiaPagina(pagina_actual - 1, offset_actual - 10, esBusqueda)}
                    />
                  </PaginationItem>
                  {#each range(ultima_pagina,1) as pagina}
                    <PaginationItem class={pagina_actual === pagina ? "active" : ""}>
                      <PaginationLink
                        previous
                        href="#/education_expenditures"
                        on:click={() => cambiaPagina(pagina, (pagina - 1) * 10, esBusqueda)}
                        >{pagina}</PaginationLink
                      >
                    </PaginationItem>
                  {/each}
                  <PaginationItem class={pagina_actual === ultima_pagina ? "disabled" : ""}>
                    <PaginationLink
                      next
                      href="#/education_expenditures"
                      on:click={() =>
                        cambiaPagina(pagina_actual + 1, offset_actual + 10, esBusqueda)}
                    />
                  </PaginationItem>
                </Pagination>
              </div>                

      {/if}

      {#if edex_data.length==0}
        <div style="aling-items:center; justify-content:center;">
          <Row>
              <Col md=12 style="text-align: center;">
                  <h2>No existen datos cargados. Por favor, pulse el botón "Cargar datos".</h2>
              </Col>
          </Row>
          <Row>
              <Col md=3>
              </Col>
              <Col md=4>
                  <img src="images/noDatos.jpg" alt="noDatos">
              </Col>
              <Col md=4>
              </Col>
          </Row>
        </div>
      {/if}

    </div>
    
    
    <div class="foot" style="min-width: 100%;
    color: white;
    background-color:#343c44;
    min-width: 100%;
    
    bottom: 0;
    background-color:#343c44;
    left: 0;
    position: relative;">
    <footer>
       

         <div>
            <a href="/"><Button style="background-color: blue;">Página Principal</Button></a>
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