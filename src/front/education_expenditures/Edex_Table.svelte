<script>
    import { Table , Button, Toast, ToastBody, ToastHeader, Col, Row, Container } from 'sveltestrap';

    //Incluimos la ruta donde se ejecuta el backend de la Api
    
    const BASE_API_PATH = "api/v1/education_expenditures";

    //Cargamos los datos iniciales

    var charged = false;
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

    /*
    async function insertStat() {
        console.log("Inserting stat: " + JSON.stringify(newStat));
        newStat.date = parseInt(newStat.date);
        newStat.born = parseInt(newStat.born);
        newStat["men-born"] = parseInt(newStat["men-born"]);
        newStat["women-born"] = parseInt(newStat["women-born"]);
        newStat["natality-rate"] = parseFloat(newStat["natality-rate"]);
        newStat["fertility-rate"] = parseFloat(newStat["fertility-rate"]);
        const res = await fetch(BASE_CONTACT_API_PATH + "/natality-stats/", {
        method: "POST",
        body: JSON.stringify(newStat),
        headers: {
            "Content-Type": "application/json",
        },
        }).then(function (res) {
        if (res.ok) {            
        } else {
            if(res.status===409){
            console.log("Los valores introducidos no conforman un dato valido")
            }else if(res.status ===500){
            console.log("No se han podido acceder a la base de datos");
            }
            else{
                console.log("Error desconocido. Vuelva a intentarlo")
            }        
        }
        });
  }
    */
    

</script>

<main>
    <!-- Creamos un div para incluir dentro dos botones, uno para cargar datos y otro para borrarlos todos -->
    <div style="padding:1%">
            <Row>
                <Col>
                    {#if charged}
                    <Button style="background-color: green;" disabled>Cargar datos</Button>
                    <Button style="background-color: red;" on:click = {deleteAll}>Borrar datos</Button>
                    {:else}
                    <Button style="background-color: green;" on:click = {loadInitialData}>Cargar datos</Button>
                    <Button style="background-color: red;" disable>Borrar datos</Button>
                    {/if}
                </Col>           
            </Row>

    </div>
   <br>
    <!--Introducimos salto para separar contenido-->
    <div>
        {#if charged}
        <Table>
            <!-- Incluye los nombres de los atributos -->
            <thead>  
                <tr style="text-align: center;">
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
                {#each edex_data as stat}
                <tr  style="text-align: center;">
                    <th>{stat.year}</th>
                    <th>{stat.country}</th>
                    <th>{stat.education_expenditure_per_millions}</th>
                    <th>{stat.education_expenditure_per_public_expenditure}</th>
                    <th>{stat.education_expenditure_gdp}</th>
                    <th>{stat.education_expenditure_per_capita}</th>
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