/*
****************************
*	       COMUNES         *
****************************
*/ 

// Creamos una variable express para el desarrollo web

const e = require("express");
var express = require("express");



var app = express();

// Creamos una variable dataBase para la gestion de bases de datos

var dataBase = require("nedb");

var educationExpenditures_DB = new dataBase();

//Definimos el puerto al que estará asociado el servidor web

var port = process.env.PORT || 10000;

//Para jugar con rutas usamos el modulo path

var path = require("path");

//Definimos las rutas de recursos y el uso de bodyParser

app.use("/", express.static(path.join(__dirname,"./public"))); //La variable __dirname encadena la carpeta actual con la public

app.use(express.json());

//Definimos el path inicial de la API

var BASE_API_PATH = "/api/v1";

/*

*****************************
*	  MILESTONE F04-F05     *
*****************************

*/

// Api Manuel González Regadera - education_expenditures

var education_expenditures_api = require("./education_expenditures_API");
education_expenditures_api.register(app,BASE_API_PATH, educationExpenditures_DB);

// Api Miguel Gómez Vázquez - illiteracy

	var illiteracy_array = [];

	//Generamos las distintas peticiones

	//Get del array completo
	app.get(BASE_API_PATH+"/illiteracy", (req,res)=>{ //Cuando llamen a /api/v1/illiteracy
		//Debemos enviar el objeto pero pasandolo a JSON
		
		res.send(200, JSON.stringify(illiteracy_array,null,2));
	});

	//Get para incluir los elementos iniciales
	app.get(BASE_API_PATH+"/illiteracy/loadInitialData", (req,res)=>{ 
		
		//Definimos los datos iniciales
		
		var datosIniciales_miguel =  [
			{
				"year":"2018",
				"country":"Spain",
				"female_illiteracy_rate": "97,97%" ,
				"male_illiteracy_rate":"98,93%",
				"adult_illiteracy_rate":"98,44%",
				"young_illiteracy_rate":"99,72%"
			},

			{
				"year":"2018",
				"country":"Italy",
				"female_illiteracy_rate": "98.97%" ,
				"male_illiteracy_rate":"99,35%",
				"adult_illiteracy_rate":"99,16%",
				"young_illiteracy_rate":"99,93%"
			},

			{
				"year":"2018",
				"country":"Portugal",
				"female_illiteracy_rate": "95,05%" ,
				"male_illiteracy_rate":"97,35%",
				"adult_illiteracy_rate":"96,14%",
				"young_illiteracy_rate":"99,66%"
			}
		];

		// Incluimos los datos en el array 

		for(var e in datosIniciales_miguel){
			illiteracy_array.push(datosIniciales_miguel[e]);
		}

		//Eliminamos repetidos en caso de que se hayan cargado previamente
		//Lo pasamos a JSON para poder compararlos
		illiteracy_array = illiteracy_array.map(e => JSON.stringify(e));
		
		//Lo convertimos a conjunto para eliminar repetidos
		illiteracy_array = new Set(illiteracy_array); 
		
		//Lo convertimos de nuevo a array
		illiteracy_array = [...illiteracy_array] 
		
		//Lo pasamos de nuevo a objetos
		illiteracy_array = illiteracy_array.map(e => JSON.parse(e))
		
		
		//Indicamos al usuario que se han cargado exitosamente los datos
		
		res.send(200,`<!DOCTYPE html>
					<html>
						<head>
							<title>illiteracy initial data</title>
						</head>
						<body>
							<h3>Initial data loaded successfully illiteracy</h3>
						</body>
					</html>`);
		
		
	});

	//Get para tomar elementos por pais y año
	
	app.get(BASE_API_PATH+"/illiteracy/:country/:year", (req,res)=>{ 
		//Cuando llamen a /api/v1/poverty_risks/(pais)/(año)
		
		//Crearemos un nuevo array resultado de filtrar el array completo
		var filtraPA = illiteracy_array.filter(function(e){ 
			return e.country===String(req.params.country) && e.year===String(req.params.year);
		});
		
		//Debemos enviar el objeto pero pasandolo a JSON
		if(filtraPA.length==0){
			res.sendStatus(404);
		}
		else{
			res.status(200).send(JSON.stringify(filtraPA,null,2));
		}
		
	});

	//Post al array completo para incluir datos como los de la ficha de propuestas

	app.post(BASE_API_PATH+"/illiteracy", (req,res)=>{
		
		var newData = req.body; //Se toma el cuerpo de la peticion donde estan los datos
		illiteracy_array.push(newData); //Se introduce el nuevo elemento

		//Eliminamos repetidos en caso de que se hayan cargado previamente
		//Lo pasamos a JSON para poder compararlos
		illiteracy_array = illiteracy_array.map(e => JSON.stringify(e));

		//Lo convertimos a conjunto para eliminar repetidos
		illiteracy_array = new Set(illiteracy_array);

		//Lo convertimos de nuevo a array
		illiteracy_array = [...illiteracy_array]

		//Lo pasamos de nuevo a objetos
		illiteracy_array = illiteracy_array.map(e => JSON.parse(e)) 

		//Devolvemos el estado
		res.sendStatus(201);
		console.log(JSON.stringify(newData,null,2));
	
	});

	//Post ERRONEO de elemento

	app.post(BASE_API_PATH+"/illiteracy/:country/:year", function(req, res) { 
		
		res.status(405).send("Metodo no permitido"); //Method not allowed
		

		
	});

	//Delete del array completo

	app.delete(BASE_API_PATH+"/illiteracy", (req,res)=>{
		
		illiteracy_array = []; // vaciamos el array
		res.status(200).send("Eliminacion correcta");
	
	});

	//Delete elemento por pais y año

	app.delete(BASE_API_PATH+"/illiteracy/:country/:year", function(req, res) { 
		
		//variable para indicar si se ha enconrado el elemento
		var encontrado = false;

		//Recorremos el array en busca del elemento a eliminar

		for(var e in illiteracy_array){
			if(illiteracy_array[e].country == String(req.params.country) &&
			illiteracy_array[e].year == String(req.params.year)){
				//Eliminamos 1 elemento desde la posicion e
				illiteracy_array.splice(e,1);
				encontrado = true;
				
				
			}
		}
		//Tomamos una variable para el codigo y cadena
		var codigo = 200;
		var cadena = "Eliminacion correcta";

		if(!encontrado){
			codigo = 404;
			cadena = "Recurso no encontrado";
		}
		res.status(codigo).send(cadena);
		
		
	});
	/*
	aapp.delete(BASE_API_PATH_EDU+"/:country/:year", (request, response) => {
	var oldCountry;
	console.log("[!] Deletion requested for resource: /"+request.params.country+"/"+request.params.year+"\n [?] Checking existence.");
		mh_countries.forEach(function(obj) {
		if (obj.country == request.params.country && obj.year == request.params.year) {
			oldCountry = obj;
		}
	});
	if (oldCountry != null) {
		console.log("[-] Delete: "+ JSON.stringify(oldCountry,null));
		delete mh_countries[oldCountry];
		response.status(200).send("<p>Resource deleted</p>");	
	} else {
		console.log("[!] Someone has tried to delete a non-existent resource: \n-->" + JSON.stringify(oldCountry, null));
		response.status(400).send("<p>Resource not found, can't delete.</p>");
	}
});
	*/ 

	//Put modificar elemento

	app.put(BASE_API_PATH+"/illiteracy/:country/:year", function(req, res) { 

		//Recorremos el array en busca del elemento a modificar
		for(var e in illiteracy_array){
			if(illiteracy_array[e].country === String(req.params.country) &&
			illiteracy_array[e].year === String(req.params.year)){
					var newData = req.body;
					illiteracy_array[e] = newData;
					break;
			}
		}

		//Eliminamos repetidos en caso de que se haya realizado un cambio para añadirlo
		//Lo pasamos a JSON para poder compararlos
		illiteracy_array = illiteracy_array.map(e => JSON.stringify(e));

		//Lo convertimos a conjunto para eliminar repetidos
		illiteracy_array = new Set(illiteracy_array); 
		
		//Lo convertimos de nuevo a array
		illiteracy_array = [...illiteracy_array] 

		//Lo pasamos de nuevo a objetos
		illiteracy_array = illiteracy_array.map(e => JSON.parse(e)) 


		
		if(illiteracy_array.length==0){
			res.sendStatus(404);
		}
		else{
			res.status(200).send("Modificacion correcta");
		}
	});

	//Put ERRONEO array de elementos

	app.put(BASE_API_PATH+"/illiteracy", function(req, res) { 

		res.status(405).send("Metodo no permitido"); //Method not allowed
	});



// API Javier Carmona Andrés - poverty_risks

	/*Necesario para crear la modularidad adecuada de la API. El require se usa para "importar lo necesario"
	 de mi carpeta, de mi módulo. Función register que tiene como parámetro la aplicación.*/

	var poverty_risks_api = require("./poverty_risks_API");
	poverty_risks_api.register(app,BASE_API_PATH);



/*

****************************
*	    MILESTONE F03      *
****************************

*/

// Recurso Manuel Gonzalez Regadera - education_expenditures

app.get("/info/education_expenditures", (request,response)=>{

	response.send(`<!DOCTYPE html>
				<html>
					<head>
						<title>Education_Expenditures</title>

						<style>
							table, tr, td {
								border: 1px solid black;
								border-collapse: collapse;
							}
							tr, td {
								padding: 5px;
								text-align: center;    
							}
						</style>

					</head>

					<body>
						<h3>El Gasto Público en Educación es aquel que destina el Gobierno a instituciones educativas, administración educativa
						 y subsidios para estudiantes y otras entidades privadas a lo largo de un año </h3>
						 </br>

						 <table class="default" style="width:100%">

						<tr>
							<td>year</td>
							<td>country</td>
							<td>education_expenditure_per_millions</td>
							<td>education_expenditure_per_public_expenditure</td>
							<td>education_expenditure_gdp</td>
							<td>education_expenditure_per_capita</td>
						</tr>
						<tr>
							<td>2016</td>
							<td>Spain</td>
							<td>46.882,8</td>
							<td>9,97</td>
							<td>4,21</td>
							<td>1.009,00</td>
						</tr>
						<tr>
							<td>2016</td>
							<td>Germany</td>
							<td>150.496,7</td>
							<td>10,93</td>
							<td>4,8</td>
							<td>1.828,00</td>
						</tr>
						<tr>
							<td>2015</td>
							<td>France</td>
							<td>118.496,3</td>
							<td>9,66</td>
							<td>5,46</td>
							<td>1.804,00</td>
						</tr>
						<tr>
							<td>2016</td>
							<td>Italy</td>
							<td>63.936,1</td>
							<td>7,81</td>
							<td>3,83</td>
							<td>1.071,00</td>
						</tr>
						<tr>
							<td>2015</td>
							<td>Portugal</td>
							<td>8.775,3</td>
							<td>10,15</td>
							<td>4,88</td>
							<td>847,00</td>
						</tr>

						</table>
					</body>
					</html>`
					);

});

// Recurso Miguel Gómez Vázquez - illiteracy

app.get("/info/illiteracy", (request,response)=>{

	response.send(`<!DOCTYPE html>
				<html>
					<head>
						<title>illiteracy</title>

						<style>
							table, tr, td {
								border: 1px solid black;
								border-collapse: collapse;
							}
							tr, td {
								padding: 5px;
								text-align: center;    
							}
						</style>

					</head>

					<body>
						<h3>El índice o tasa de alfabetización es el porcentaje de la población que sabe leer o escribir después de determinada edad.
						 No existe una convención internacional acerca de la edad a tomar en cuenta ni el nivel cualitativo de lectura o escritura.
						  La alfabetización es uno de los principales indicadores utilizados para la medición del IDH. </h3>
						 </br>

						 <table class="default" style="width:100%">

						<tr>
							<td>year</td>
							<td>country</td>
							<td>female_illiteracy_rate</td>
							<td>male_illiteracy_rate</td>
							<td>adult_illiteracy_rate</td>
							<td>young_illiteracy_rate</td>
						</tr>
						<tr>
							<td>2018</td>
							<td>Spain</td>
							<td>97,97%</td>
							<td>98,93%</td>
							<td>98,44%</td>
							<td>99,72%</td>
						</tr>
						<tr>
							<td>2018</td>
							<td>Italy</td>
							<td>98.97%</td>
							<td>99,35%</td>
							<td>99,16%</td>
							<td>99,93%</td>
						</tr>
						<tr>
							<td>2018</td>
							<td>Portugal</td>
							<td>95,05%</td>
							<td>97,35%</td>
							<td>96,14%</td>
							<td>99,66%</td>
						</tr>
						<tr>
							<td>2018</td>
							<td>Greece</td>
							<td>97,39%</td>
							<td>98,51%</td>
							<td>97,94%</td>
							<td>99,16%</td>
						</tr>
						<tr>
							<td>2016</td>
							<td>Andorra</td>
							<td>100%</td>
							<td>100%</td>
							<td>100%</td>
							<td>100%</td>
						</tr>

						</table>
					</body>
					</html>`
					);

});


// Recurso Javier Carmona Andrés - poverty_risks

app.get("/info/poverty_risks", (request,response)=>{

	response.send(`<!DOCTYPE html>
				<html>
					<head>
						<title>Poverty_Risks</title>

						<style>
							table, tr, td {
								border: 1px solid black;
								border-collapse: collapse;
							}
							tr, td {
								padding: 5px;
								text-align: center;    
							}
						</style>

					</head>

					<body>
						<h3>
						El umbral de la pobreza, son los ingresos por debajo de los cuales se considera que una persona o familia está en riesgo de pobreza. </h3>
						 </br>

						 <table class="default" style="width:100%">

						<tr>
							<td>year</td>
							<td>country</td>
							<td>people_in_risk_of_poverty</td>
							<td>people's_poverty_line</td>
							<td>homes'_poverty_line</td>
							<td>percentage_risk_of_poverty</td>
						</tr>
						<tr>
							<td>2019</td>
							<td>Spain</td>
							<td>9.610 m.</td>
							<td>9.009</td>
							<td>18.919</td>
							<td>20,7%</td>
						</tr>
						<tr>
							<td>2015</td>
							<td>Germany</td>
							<td>13.428 m.</td>
							<td>12.401</td>
							<td>26.041</td>
							<td>16,7%</td>
						</tr>
						<tr>
							<td>2015</td>
							<td>France</td>
							<td>8.474 m.</td>
							<td>12.849</td>
							<td>26.983</td>
							<td>13,6%</td>
						</tr>
						<tr>
							<td>2015</td>
							<td>Italy</td>
							<td>12.130 m.</td>
							<td>9.508</td>
							<td>19.966</td>
							<td>19,9%</td>
						</tr>
						<tr>
							<td>2015</td>
							<td>Portugal</td>
							<td>2.019 m.</td>
							<td>5.061</td>
							<td>10.628</td>
							<td>19,5%</td>
						</tr>

						</table>
					</body>
					</html>`
					);

});




/* 

****************************
*	    MILESTONE F02      *
****************************


//Cuando inicializamos un paquete debemos crear una variable y usar la función require("nombre de la carpeta contenedora del modulo");

var cool = require("cool-ascii-faces");

Para el desarrollo de webs sencillas usaremos el modulo express. Al igual que 
el anterior, debemos incluirlo en una variable con la función require. Express aporta
una función constructora


var express = require("express");

var app = express();

//Definimos los puertos

var port = 10000;

//Definimos la fecha para conocer cuando se realizan las peticiones

var date = new Date();

//Definimos las rutas

app.get("/cool", (request,response) => {
	//La respuesta que se enviará a la peticion /cool sera una carita de cool-ascii-faces
	response.send(cool());
	//Sacamos por pantalla que se ha recibido la petición
	var fecha = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
	var hora = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	console.log("New Request " + fecha + " " + hora);
});

//Indicamos que hará el servidor a la escucha

app.listen(port,() => {
	console.log("Server is listening on port " + port);
});

/*
//Se debe llamar como si se tratase de una función
console.log(cool());
*/

//El comando npm install instala todos los paquetes que necesita el proyecto si se clona desde git


/*
****************************
*	      COMUNES 2        *
****************************
*/ 

//Ponemos el servidor a escuchar

app.listen(port, () =>{
    console.log("Server ready to listen on port " + port);
});

