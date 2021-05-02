<script>
    import { Table , Button, Toast, ToastBody, ToastHeader } from 'sveltestrap';

    //Incluimos la ruta donde se ejecuta el backend de la Api
    
    const BASE_API_PATH = "api/v1/education_expenditures";

    //Cargamos los datos iniciales

    var charged = false;
    var edex_data = [];

    //Función asincrona para la carga de datos

    async function loadInitialData(){
        //Para cargarlos hacemos un fetch a la direccion donde está el método de carga inicial
        const peticionCarga = await fetch(BASE_API_PATH + '/loadInitialData'); //Se espera hasta que termine la peticion

        if(peticionCarga.ok){
            const peticionMuestra = await fetch(BASE_API_PATH); //Se accede a la toma de todos los elementos

            if(peticionMuestra.ok){
                console.log(" Receiving data, wait a moment ...")
                const data = await res.json();
                lifeStats = data;
                console.log('Done! Received ${data.length} stats.');
            }
            else{
                console.log("No data loaded.");
            }
        }
        else{
            console.log("Error loading data.");
        }
    }

    async function deleteAll() {
        charged = false;
		
        const peticion = await fetch(BASE_API_URL, {
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

</script>

<main>
    <!-- Creamos un div para incluir dentro dos botones, uno para cargar datos y otro para borrarlos todos -->>
    <div>
        {#if charged}
        <Button style="background-color: green;" disabled>Cargar datos</Button>
        <Button style="background-color: red;" on:click = {deleteAll}>Borrar datos</Button>
        {:else}
        <Button style="background-color: green;" on:click = {loadInitialData}>Cargar datos</Button>
        <Button style="background-color: red;" disable>Borrar datos</Button>
        {/if}
    </div>
    <!--Introducimos salto para separar contenido-->
    <div>
        {#if charged}
        <Table>
            <!-- Incluye los nombres de los atributos -->
            <thead>  
                <tr>
                    <th>Año</th>
                    <th>País</th>
                    <th>Gasto en millones de euros</th>
                    <th>Porcentaje del gasto público</th>
                    <th>Porcentaje del PIB</th>
                    <th>Gasto per capita</th>
                </tr>
            </thead>
    
            <!-- Incluye cada uno de los elementos en el vector-->

            <tbody>
                {#each edex_data as data}
                <tr>
                    <th>{data.year}</th>
                    <th>{data.country}}</th>
                    <th>{data["education_expenditure_per_millions"]}</th>
                    <th>{data["education_expenditure_per_public_expenditure"]}</th>
                    <th>{data["education_expenditure_gdp"]}</th>
                    <th>{data["education_expenditure_per_capita"]}</th>
                </tr>
                {/each}
            </tbody>

    
        </Table>

        {:else}
            <div style="aling-items:center; justify-content:center;">
                <h2>No existen datos cargados. Por favor, pulse el botón "Cargar datos"</h2>
            </div>
            <div style="aling-items:center; justify-content:center;">
                <img src="images/noDatos.jpg" alt="noDatos">
            </div>
            
        {/if}

    </div>
    <div>
        <a href="/"><Button style="background-color: blue;">Página Principal</Button></a>
    </div>
    
</main>

<style>

</style>