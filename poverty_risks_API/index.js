/*
*******************************
*	    MILESTONE F06      *
*   LAB 07/08 - MODULARIZACIÓN *
*******************************
*/

// Api Javier Carmona Andrés - poverty_risks

/* Cuando alguien invoque a register me pasa un objeto app y
con ese objeto app es con la que yo puedo registrar los métodos de mi API.*/
module.exports.register = (app, BASE_API_PATH, povertyRisks_DB) => {

    //Definimos el array de datos iniciales relativos al riesgo de pobreza.

	var initialData_povertyRisks = [
		{
			"year": 2019,
			"country":"Spain",
			"people_in_risk_of_poverty": 9610000,
			"people_poverty_line": 9010,
			"home_poverty_line": 18920,
			"percentage_risk_of_poverty": 20.7
		},
		{
			"year": 2015,
			"country":"Germany",
			"people_in_risk_of_poverty": 13428000 ,
			"people_poverty_line": 12400,
			"home_poverty_line": 26040,
			"percentage_risk_of_poverty": 16.7
		},
		{
			"year": 2015,
			"country":"France",
			"people_in_risk_of_poverty": 8474000 ,
			"people_poverty_line": 12850,
			"home_poverty_line": 26980,
			"percentage_risk_of_poverty": 13.6
		}

	];

	
	// GET para insertar los datos iniciales en la base de datos

	app.get(BASE_API_PATH+"/poverty_risks/loadInitialData", (req,res)=>{ 
            
		// Cuando llamen a /api/v1/poverty_risks/loadInitialData
		// Comprobamos si los elementos están
		povertyRisks_DB.find({}, (error,resultFind)=>{ 

				if(error){
					console.log("Se ha producido un error de servdor al hacer petición Get all");
					res.sendStatus(500); //Error de servidor
				}
				else{
					povertyRisks_DB.insert(initialData_povertyRisks);
					res.sendStatus(200);                        
				}
			});          
	});

	/*
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
	*/

	
	//Generamos las distintas peticiones

	//Get del array completo
	app.get(BASE_API_PATH+"/poverty_risks", (req,res)=>{
		//Cuando llamen a /api/v1/poverty_risks
		
		//Permitimos búsquedas con skip y limit
		var skip = req.query.skip!=undefined?parseInt(req.query.skip):0 ;
		var limit = req.query.limit!=undefined?parseInt(req.query.limit):Infinity;

		//Definimos los distintos parametros de búsqueda
		
		// aquellos que están por encima de un nº de personas en riesgo de pobreza
		var aprp = req.query.aprp!=undefined?parseFloat(req.query.aprp):0; 
		// aquellos que están por debajo de un nº de personas en riesgo de pobreza
		var uprp = req.query.uprp!=undefined?parseFloat(req.query.uprp):100000000;
		
		//aquellos que están por encima del índice de pobreza de las personas
		var appl= req.query.appl!=undefined?parseFloat(req.query.appl):0; 
		//aquellos que están por debajo del índice de pobreza de las personas
		var uppl= req.query.uppl!=undefined?parseFloat(req.query.uppl):1000000000; 
		
		//aquellos que están por encima del índice de pobreza de los hogares
		var ahpl = req.query.ahpl!=undefined?parseFloat(req.query.ahpl):0;
		//aquellos que están por debajo del índice de pobreza de los hogares
		var uhpl = req.query.uhpl!=undefined?parseFloat(req.query.uhpl):100000000;

		//aquellos que están por encima del porcentaje del riesgo de pobreza
		var apercnt = req.query.apercnt!=undefined?parseFloat(req.query.apercnt):0;
		//aquellos que están por debajo del porcentaje del riesgo de pobreza
		var upercnt = req.query.upercnt!=undefined?parseFloat(req.query.upercnt):1000000000; 

		//Hacemos uso de bases de datos
		dataBase.find({$and:[{people_in_risk_of_poverty : {$gt : aprp,$lt:uprp}}, {people_poverty_line: {$gt : appl,$lt:uppl}},{home_poverty_line:{$gt : ahpl,$lt:uhpl}}, {percentage_risk_of_poverty:{$gt : apercnt,$lt:upercnt}}]})
		.skip(skip).limit(limit)
		.exec( (error, resultFind)=>{ //No establecemos patrón, por lo que se toman todos

		if(error){
			console.log("Se ha producido un error de servdor al hacer petición Get all");
			res.sendStatus(500); //Error de servidor
		}
		else{
			if(resultFind.length == 1){
				var dataToSend = resultFind.map((objeto) =>
					{
						//Ocultamos el atributo id
						return {year:objeto.year,
						country:objeto.country,
						people_in_risk_of_poverty: objeto.people_in_risk_of_poverty,
						people_poverty_line:objeto.people_poverty_line,
						home_poverty_line:objeto.home_poverty_line,
						percentage_risk_of_poverty:objeto.percentage_risk_of_poverty};

					});
				res.status(200).send(JSON.stringify(dataToSend[0],null,2)); //Tamaño de la página y salto;
			
			}
			else{
				var dataToSend = resultFind.map((objeto) =>
					{
						//Ocultamos el atributo id
						return {year:objeto.year,
						country:objeto.country,
						people_in_risk_of_poverty: objeto.people_in_risk_of_poverty ,
						people_poverty_line:objeto.people_poverty_line,
						home_poverty_line:objeto.home_poverty_line,
						percentage_risk_of_poverty:objeto.percentage_risk_of_poverty};

					});
				res.status(200).send(JSON.stringify(dataToSend,null,2)); //Tamaño de la página y salto;
			}
			
		}

		
	});



	});

	/*
	//Get del array completo
	app.get(BASE_API_PATH+"/poverty_risks", (req,res)=>{
		//Cuando llamen a /api/v1/poverty_risks
		//Debemos enviar el objeto pero pasandolo a JSON
		
		res.send(200, JSON.stringify(poverty_risks_array,null,2));
	});
	*/


	//Get para tomar elementos por pais
        
	app.get(BASE_API_PATH+'/poverty_risks/:country', (req,res)=>{ 
		//Cuando llamen a /api/v1/poverty_risks/(pais)
            
		//Permitimos búsquedas con skip y limit
		var skip = req.query.skip!=undefined?parseInt(req.query.skip):0 ;
		var limit = req.query.limit!=undefined?parseInt(req.query.limit):Infinity;

		//Crearemos un nuevo array resultado de filtrar el array completo
		povertyRisks_DB.find({country : String(req.params.country)}).skip(skip).limit(limit).exec((error, resultFind)=>{
			//Se establece patron por país

			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get country");
				res.sendStatus(500); //Error de servidor
			}
			else{
				if(resultFind.length == 0){
					res.sendStatus(404); //No se encuentra el elemento 
				}
				else{
					if(resultFind.length == 1){
						var dataToSend = resultFind.map((objeto) =>
							{
								//Ocultamos el atributo id
								return {year:objeto.year,
								country:objeto.country,
								people_in_risk_of_poverty: objeto.people_in_risk_of_poverty ,
								people_poverty_line:objeto.people_poverty_line,
								home_poverty_line:objeto.home_poverty_line,
								percentage_risk_of_poverty:objeto.percentage_risk_of_poverty};

							});
						res.status(200).send(JSON.stringify(dataToSend[0],null,2)); //Tamaño de la página y salto;
					
					}
					else{
						var dataToSend = resultFind.map((objeto) =>
							{
								//Ocultamos el atributo id
								return {year:objeto.year,
								country:objeto.country,
								people_in_risk_of_poverty: objeto.people_in_risk_of_poverty ,
								people_poverty_line:objeto.people_poverty_line,
								home_poverty_line:objeto.home_poverty_line,
								percentage_risk_of_poverty:objeto.percentage_risk_of_poverty};

							});
						res.status(200).send(JSON.stringify(dataToSend,null,2)); //Tamaño de la página y salto;
					}
				}
			}
		});    
	});


	//Get para tomar elementos por pais y año
	
	app.get(BASE_API_PATH+"/education_expenditures/:country/:year", (req,res)=>{ //Cuando llamen a /api/v1/education_expenditures/(pais)

		//Crearemos un nuevo array resultado de filtrar el array completo
		povertyRisks_DB.find({country : String(req.params.country), year: parseInt(req.params.year)}).exec((error, ee_db)=>{ //Se establece patron por país y año

			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get country");
				res.sendStatus(500); //Error de servidor
			}
			else{
				if(resultFind.length == 0){
					res.sendStatus(404); //No se encuentra el elemento 
				}
				else{
					var dataToSend = resultFind.map((objeto) =>
							{
								//Ocultamos el atributo id
								return {year:objeto.year,
								country:objeto.country,
								people_in_risk_of_poverty: objeto.people_in_risk_of_poverty ,
								people_poverty_line:objeto.people_poverty_line,
								home_poverty_line:objeto.home_poverty_line,
								percentage_risk_of_poverty:objeto.percentage_risk_of_poverty};

							});
						res.status(200).send(JSON.stringify(dataToSend[0],null,2)); //Tamaño de la página y salto;
					
				}
			}
		});
		
	});


	/*
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
	*/

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