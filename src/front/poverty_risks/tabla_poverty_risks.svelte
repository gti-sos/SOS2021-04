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
</script>

<main>
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
