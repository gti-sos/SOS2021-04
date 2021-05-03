<script>
    import { Table , Button, Toast, ToastBody, ToastHeader, Col, Row, Container } from 'sveltestrap';

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

    //Variables auxiliares para la muestra de errores
    let mensajeError = ""

    //Creamos variables para almacenar datos para la actualización de un elemento

    //Cargamos los datos iniciales

    var charged = true;
    var edex_data = [];

    //Función asincrona para la carga de datos

    async function loadInitialData(){
        //Para cargarlos hacemos un fetch a la direccion donde está el método de carga inicial
        if(edex_data.length==0){
        charged = true;
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
        }}
        
    }

    async function deleteAll() {
        charged = false;
		
        const peticion = await fetch(BASE_API_PATH, {
			method: "DELETE"
		}).then(function (peticion) {
			
            if (peticion.ok){
                edex_data = [];
			} 
            
            else if (peticion.status==404){ //no data found
                console.log("No data found"); //Posibilidad de redirigir a una ventana similar a la de error 404
			} 
            
            else  { 
				console.log("Error deleting DB stats");
			}
			
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
    });
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
        {#if edex_data.length!=0}
        <Table>
            <!-- Incluye los nombres de los atributos -->
            <thead>  
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

    
            <!-- Incluye cada uno de los elementos en el vector-->

            
                {#each edex_data as stat}
                <tr  style="text-align: center;">
                    <th>{stat.year}</th>
                    <th>{stat.country}</th>
                    <th>{stat.education_expenditure_per_millions}</th>
                    <th>{stat.education_expenditure_per_public_expenditure}</th>
                    <th>{stat.education_expenditure_gdp}</th>
                    <th>{stat.education_expenditure_per_capita}</th>
                    <th><button class="btn btn-danger">Eliminar</button></th>
                    <th><button class="btn btn-warning">Modificar</button></th>

                </tr>
                {/each}
            </tbody>

    
        </Table>

        {:else}
            <div style="aling-items:center; justify-content:center;">
                <Row>
                    <Col md=12 style="text-align: center;">
                        <h2>No existen datos cargados. Por favor, pulse el botón "Cargar datos"</h2>
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
    
    margin-bottom: 0;
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