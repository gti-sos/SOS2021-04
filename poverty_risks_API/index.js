/*
****************************
*	    MILESTONE F04      *
*   LAB 07-MODULARIZACIÓN  *
****************************
*/

// Api Javier Carmona Andrés - poverty_risks

//Cuando alguien invoque a register me pasa un objeto app y con ese objeto app es con el que yo puedo registrar los métodos de mi API
module.exports.register = (app, BASE_API_PATH) => {

    //Creamos el array de objetos relativos al riesgo de pobreza, inicialmente vacío.

	var poverty_risks_array = [];

	//Generamos las distintas peticiones

	//Get del array completo
	app.get(BASE_API_PATH+"/poverty_risks", (req,res)=>{
		//Cuando llamen a /api/v1/poverty_risks
		//Debemos enviar el objeto pero pasandolo a JSON
		
		res.send(200, JSON.stringify(poverty_risks_array,null,2));
	});

	//Get para incluir los elementos iniciales
	app.get(BASE_API_PATH+"/poverty_risks/loadInitialData", (req,res)=>{ 
		
		//Definimos los datos iniciales
		
		var datosIniciales_PovertyRisks =  [
			{
				"year":"2019",
				"country":"Spain",
				"people_in_risk_of_poverty": "9610000" ,
				"people_poverty_line":"9010",
				"home_poverty_line":"18920",
				"percentage_risk_of_poverty":"20,7"
			},
			{
				"year":"2015",
				"country":"Germany",
				"people_in_risk_of_poverty": "13428000" ,
				"people_poverty_line":"12400",
				"home_poverty_line":"26040",
				"percentage_risk_of_poverty":"16,7"
			},
			{
				"year":"2015",
				"country":"France",
				"people_in_risk_of_poverty": "8474000" ,
				"people_poverty_line":"12850",
				"home_poverty_line":"26980",
				"percentage_risk_of_poverty":"13,6"
			},
		];

		// Incluimos los datos en el array 

		for(var e in datosIniciales_PovertyRisks){
			poverty_risks_array.push(datosIniciales_PovertyRisks[e]);
		}

		//Eliminamos repetidos en caso de que se hayan cargado previamente
		//Lo pasamos a JSON para poder compararlos
		poverty_risks_array = poverty_risks_array.map(e => JSON.stringify(e));
		
		//Lo convertimos a conjunto para eliminar repetidos
		poverty_risks_array = new Set(poverty_risks_array); 
		
		//Lo convertimos de nuevo a array
		poverty_risks_array = [...poverty_risks_array] 
		
		//Lo pasamos de nuevo a objetos
		poverty_risks_array = poverty_risks_array.map(e => JSON.parse(e))
		
		//Indicamos al usuario que se han cargado exitosamente los datos
		
		res.status(200).send(`<!DOCTYPE html>
					<html>
						<head>
							<title>Education expenditures initial data</title>
						</head>
						<body>
							<h3>Initial data loaded successfully RIESGOS DE POBREZA</h3>
						</body>
					</html>`);
		
		
	});

	//Get para tomar elementos por pais y año
	
	app.get(BASE_API_PATH+"/poverty_risks/:country/:year", (req,res)=>{ 
		//Cuando llamen a /api/v1/poverty_risks/(pais)/(año)
		
		//Crearemos un nuevo array resultado de filtrar el array completo
		var filtraPA = poverty_risks_array.filter(function(e){ 
			return e.country===String(req.params.country) && e.year===String(req.params.year);
		});
		
		//Debemos enviar el objeto pero pasandolo a JSON
		res.status(200).send(JSON.stringify(filtraPA,null,2));
	});

	//Post al array completo para incluir datos como los de la ficha de propuestas

	app.post(BASE_API_PATH+"/poverty_risks", (req,res)=>{
		
		var newData = req.body; //Se toma el cuerpo de la peticion donde estan los datos
		poverty_risks_array.push(newData); //Se introduce el nuevo elemento

		//Eliminamos repetidos en caso de que se hayan cargado previamente
		//Lo pasamos a JSON para poder compararlos
		poverty_risks_array = poverty_risks_array.map(e => JSON.stringify(e));

		//Lo convertimos a conjunto para eliminar repetidos
		poverty_risks_array = new Set(poverty_risks_array);

		//Lo convertimos de nuevo a array
		poverty_risks_array = [...poverty_risks_array]

		//Lo pasamos de nuevo a objetos
		poverty_risks_array = poverty_risks_array.map(e => JSON.parse(e)) 

		//Devolvemos el estado
		res.sendStatus(201);
		console.log(JSON.stringify(newData,null,2));
	
	});

	//Post ERRONEO de elemento

	app.post(BASE_API_PATH+"/poverty_risks/:country/:year", function(req, res) { 

		res.status(405).send("Metodo no permitido"); //Method not allowed
	});

	//Delete del array completo

	app.delete(BASE_API_PATH+"/poverty_risks", (req,res)=>{
		
		poverty_risks_array = []; // vaciamos el array
		res.status(200).send("Eliminacion correcta");
	
	});

	//Delete elemento por pais y año

	app.delete(BASE_API_PATH+"/poverty_risks/:country/:year", function(req, res) { 

		//Recorremos el array en busca del elemento a eliminar
		for(var e in poverty_risks_array){
			if(poverty_risks_array[e].country == String(req.params.country) &&
			poverty_risks_array[e].year == String(req.params.year)){
				//Eliminamos 1 elemento desde la posicion e
					poverty_risks_array.splice(e,1);
					break;
			}
		}
		res.status(200).send("Eliminacion correcta");
	});

	//Put modificar elemento

	app.put(BASE_API_PATH+"/poverty_risks/:country/:year", function(req, res) { 

		//Recorremos el array en busca del elemento a modificar
		for(var e in poverty_risks_array){
			if(poverty_risks_array[e].country === String(req.params.country) &&
				poverty_risks_array[e].year === String(req.params.year)){
					var newData = req.body;
					poverty_risks_array[e] = newData;
					break;
			}
		}

		//Eliminamos repetidos en caso de que se haya realizado un cambio para añadirlo
		//Lo pasamos a JSON para poder compararlos
		poverty_risks_array = poverty_risks_array.map(e => JSON.stringify(e));

		//Lo convertimos a conjunto para eliminar repetidos
		poverty_risks_array = new Set(poverty_risks_array); 
		
		//Lo convertimos de nuevo a array
		poverty_risks_array = [...poverty_risks_array] 

		//Lo pasamos de nuevo a objetos
		poverty_risks_array = poverty_risks_array.map(e => JSON.parse(e)) 


		res.status(200).send("Modificacion correcta");
	});

	//Put ERRONEO array de elementos

	app.put(BASE_API_PATH+"/poverty_risks", function(req, res) { 

		res.status(405).send("Metodo no permitido"); //Method not allowed
	});

};