/*
********************************
*	    MILESTONE F06      *
*   LAB 07/08 - MODULARIZACIÓN *
********************************
*/

// Api Javier Carmona Andrés - poverty_risks

/* Cuando alguien invoque a register me pasa un objeto app y
con ese objeto app es con la que yo puedo registrar los métodos de mi API.*/
module.exports.register = (app, BASE_API_PATH, povertyRisks_DB) => {

    //Definimos el array de datos iniciales relativos al riesgo de pobreza.

	var initialData_povertyRisks = [
		{
			"year": 2019,
			"country":"España",
			"people_in_risk_of_poverty": 9610000,
			"people_poverty_line": 9009,
			"home_poverty_line": 18919,
			"percentage_risk_of_poverty": 20.7
		},
		{
			"year": 2015,
			"country":"Alemania",
			"people_in_risk_of_poverty": 13428000 ,
			"people_poverty_line": 12401,
			"home_poverty_line": 26041,
			"percentage_risk_of_poverty": 16.7
		},
		{
			"year": 2015,
			"country":"Francia",
			"people_in_risk_of_poverty": 8474000 ,
			"people_poverty_line": 12849,
			"home_poverty_line": 26983,
			"percentage_risk_of_poverty": 13.6
		},
		{
			"year": 2015,
			"country":"Italia",
			"people_in_risk_of_poverty": 12130000 ,
			"people_poverty_line": 9508,
			"home_poverty_line": 19966,
			"percentage_risk_of_poverty": 19.9
		},
		{
			"year": 2015,
			"country":"Portugal",
			"people_in_risk_of_poverty": 2019000 ,
			"people_poverty_line": 5061,
			"home_poverty_line": 10628,
			"percentage_risk_of_poverty": 19.5
		},
		{
			"year": 2015,
			"country":"República Checa",
			"people_in_risk_of_poverty": 1006000 ,
			"people_poverty_line": 4454,
			"home_poverty_line": 9353,
			"percentage_risk_of_poverty": 9.7
		},{
			"year": 2015,
			"country":"Dinamarca",
			"people_in_risk_of_poverty": 686000 ,
			"people_poverty_line": 17019,
			"home_poverty_line": 35739,
			"percentage_risk_of_poverty": 12.2
		},{
			"year": 2015,
			"country":"Estonia",
			"people_in_risk_of_poverty": 281000 ,
			"people_poverty_line": 4733,
			"home_poverty_line": 9940,
			"percentage_risk_of_poverty": 21.6
		},{
			"year": 2015,
			"country":"Grecia",
			"people_in_risk_of_poverty": 2293000 ,
			"people_poverty_line": 4512,
			"home_poverty_line": 9475,
			"percentage_risk_of_poverty": 21.4
		},{
			"year": 2015,
			"country":"Croacia",
			"people_in_risk_of_poverty": 837000 ,
			"people_poverty_line": 3272,
			"home_poverty_line": 6871,
			"percentage_risk_of_poverty": 20.0
		},{
			"year": 2016,
			"country":"Finlandia",
			"people_in_risk_of_poverty": 630000 ,
			"people_poverty_line": 14190,
			"home_poverty_line": 29799,
			"percentage_risk_of_poverty": 11.6
		},{
			"year": 2016,
			"country":"Hungría",
			"people_in_risk_of_poverty": 1398000 ,
			"people_poverty_line": 2861,
			"home_poverty_line": 6007,
			"percentage_risk_of_poverty": 14.5
		},{
			"year": 2015,
			"country":"Irlanda",
			"people_in_risk_of_poverty": 760000 ,
			"people_poverty_line": 12978,
			"home_poverty_line": 27253,
			"percentage_risk_of_poverty": 16.3
		},{
			"year": 2015,
			"country":"Islandia",
			"people_in_risk_of_poverty": 29000 ,
			"people_poverty_line": 14732,
			"home_poverty_line": 30938,
			"percentage_risk_of_poverty": 9.6
		},{
			"year": 2015,
			"country":"Lituania",
			"people_in_risk_of_poverty": 649000 ,
			"people_poverty_line": 3108,
			"home_poverty_line": 6527,
			"percentage_risk_of_poverty": 22.2
		},{
			"year": 2015,
			"country":"Luxemburgo",
			"people_in_risk_of_poverty": 79000 ,
			"people_poverty_line": 21162,
			"home_poverty_line": 44441,
			"percentage_risk_of_poverty": 15.3
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
					res.sendStatus(200)                  
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

		var query = req.query;
		var skip = query.skip;
		var limit = query.limit;
		
		//Permitimos búsquedas con skip y limit
		if (query.hasOwnProperty("skip")) {
			query.skip = parseInt(query.skip);
		}
		if (query.hasOwnProperty("limit")) {
			query.limit = parseInt(query.limit);
		}

		/*Definimos los distintos parametros de búsqueda.
		Si le marcas unos parámetros de búsqueda el db.find intentará
		mostrarte los datos que cumplan dichos parámetros si no hay ninguno,
		no mostrará nada.
		*/	// Sino es undefined, úsalo, si es undefined pon "", para un mejor manejo posterior.
			var c = req.query.c!=undefined?String(req.query.c):"";
			var y = req.query.y!=undefined?parseFloat(req.query.y):0;

			// aquellos que están por encima de un nº de personas en riesgo de pobreza
			var aprp = req.query.aprp!=undefined?parseInt(req.query.aprp):0; 
			// aquellos que están por debajo de un nº de personas en riesgo de pobreza
			var uprp = req.query.uprp!=undefined?parseInt(req.query.uprp):100000000;

			//aquellos que están por encima del índice de pobreza de las personas
			var appl= req.query.appl!=undefined?parseInt(req.query.appl):0; 
			//aquellos que están por debajo del índice de pobreza de las personas
			var uppl= req.query.uppl!=undefined?parseInt(req.query.uppl):1000000000; 

			//aquellos que están por encima del índice de pobreza de los hogares
			var ahpl = req.query.ahpl!=undefined?parseInt(req.query.ahpl):0;
			//aquellos que están por debajo del índice de pobreza de los hogares
			var uhpl = req.query.uhpl!=undefined?parseInt(req.query.uhpl):100000000;

			//aquellos que están por encima del porcentaje del riesgo de pobreza
			var apercnt = req.query.apercnt!=undefined?parseFloat(req.query.apercnt):0;
			//aquellos que están por debajo del porcentaje del riesgo de pobreza
			var upercnt = req.query.upercnt!=undefined?parseFloat(req.query.upercnt):100;

			console.log(aprp);
			console.log(uprp);
			console.log(appl);
			console.log(uppl);
			console.log(ahpl);
			console.log(uhpl);
			console.log(apercnt);
			console.log(upercnt);

			if(c!="" && y!=0){

				//Hacemos uso de bases de datos
		povertyRisks_DB.find({$and:[{people_in_risk_of_poverty : {$gt : aprp,$lt:uprp}}, {people_poverty_line: {$gt : appl,$lt:uppl}},{home_poverty_line:{$gt : ahpl,$lt:uhpl}}, {percentage_risk_of_poverty:{$gt : apercnt,$lt:upercnt}},{country : c}, {year: y}]})
		.skip(skip).limit(limit)
		.exec( (error, resultFind)=>{ //No establecemos patrón, por lo que se toman todos
			console.log("Query: "+query);
		if(error){
			console.log("Se ha producido un error de servdor al hacer petición Get all");
			res.sendStatus(500); //Error de servidor
			console.log("Error GET general: "+error);
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
				console.log("Sólo 1 resultado GET general: "+dataToSend[0]);
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
				console.log(("Resultados GET general: ")+resultFind);
			}
		
		}

	
	});


			} else if(c!="" && y==0){

				//Hacemos uso de bases de datos
		povertyRisks_DB.find({$and:[{people_in_risk_of_poverty : {$gt : aprp,$lt:uprp}}, {people_poverty_line: {$gt : appl,$lt:uppl}},{home_poverty_line:{$gt : ahpl,$lt:uhpl}}, {percentage_risk_of_poverty:{$gt : apercnt,$lt:upercnt}},{country : c}]})
		.skip(skip).limit(limit)
		.exec( (error, resultFind)=>{ //No establecemos patrón, por lo que se toman todos
			console.log("Query: "+query);
		if(error){
			console.log("Se ha producido un error de servdor al hacer petición Get all");
			res.sendStatus(500); //Error de servidor
			console.log("Error GET general: "+error);
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
				console.log("Sólo 1 resultado GET general: "+dataToSend[0]);
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
				console.log(("Resultados GET general: ")+resultFind);
			}
		
		}

	
	});


			}else if(c=="" && y!=0){

				//Hacemos uso de bases de datos
		povertyRisks_DB.find({$and:[{people_in_risk_of_poverty : {$gt : aprp,$lt:uprp}}, {people_poverty_line: {$gt : appl,$lt:uppl}},{home_poverty_line:{$gt : ahpl,$lt:uhpl}}, {percentage_risk_of_poverty:{$gt : apercnt,$lt:upercnt}}, {year: y}]})
		.skip(skip).limit(limit)
		.exec( (error, resultFind)=>{ //No establecemos patrón, por lo que se toman todos
			console.log("Query: "+query);
		if(error){
			console.log("Se ha producido un error de servdor al hacer petición Get all");
			res.sendStatus(500); //Error de servidor
			console.log("Error GET general: "+error);
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
				console.log("Sólo 1 resultado GET general: "+dataToSend[0]);
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
				console.log(("Resultados GET general: ")+resultFind);
			}
		
		}

	
	});


			}else{

				//Hacemos uso de bases de datos
		povertyRisks_DB.find({$and:[{people_in_risk_of_poverty : {$gt : aprp,$lt:uprp}}, {people_poverty_line: {$gt : appl,$lt:uppl}},{home_poverty_line:{$gt : ahpl,$lt:uhpl}}, {percentage_risk_of_poverty:{$gt : apercnt,$lt:upercnt}}]})
		.skip(skip).limit(limit)
		.exec( (error, resultFind)=>{ //No establecemos patrón, por lo que se toman todos
			console.log("Query: "+query);
		if(error){
			console.log("Se ha producido un error de servdor al hacer petición Get all");
			res.sendStatus(500); //Error de servidor
			console.log("Error GET general: "+error);
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
				console.log("Sólo 1 resultado GET general: "+dataToSend[0]);
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
				console.log(("Resultados GET general: ")+resultFind);
			}
		
		}

	
	});


			}

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

		var query = req.query;
		var skip = query.skip;
		var limit = query.limit;
		
		//Permitimos búsquedas con skip y limit
		if (query.hasOwnProperty("skip")) {
			query.skip = parseInt(query.skip);
		}
		if (query.hasOwnProperty("limit")) {
			query.limit = parseInt(query.limit);
		}

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
					console.log(("Query GET para tomar elementos por pais: ")+query);
					console.log(("Resultados GET para tomar elementos por pais: ")+dataToSend); 
				}
			}
		});    
	});


	//Get para tomar elementos por pais y año
	
	app.get(BASE_API_PATH+"/poverty_risks/:country/:year", (req,res)=>{ //Cuando llamen a /api/v1/education_expenditures/(pais)

		//Crearemos un nuevo array resultado de filtrar el array completo
		povertyRisks_DB.find({country : String(req.params.country), year: parseInt(req.params.year)}).exec((error, resultFind)=>{ //Se establece patron por país y año

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

		var elemRepetido = false;
		
		povertyRisks_DB.find({}, (error, resultFind)=>{ //Comprobamos si existe el elemento ya

			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get elemento");
				res.sendStatus(500); //Error de servidor
			}
			else{
				//Comprobamos que se cumple la estructura JSON predefinida

				var country = req.body.country!=undefined;
				var year = req.body.year!=undefined;
				var prp = req.body.people_in_risk_of_poverty!=undefined;
				var ppl= req.body.people_poverty_line!=undefined;
				var hpl = req.body.home_poverty_line!=undefined;
				var percentrp = req.body.percentage_risk_of_poverty!=undefined;

				console.log(country);console.log(year);console.log(prp);console.log(ppl);console.log(hpl);console.log(percentrp);

				var condicion = country && year && prp && ppl && hpl && percentrp;

				if(condicion){

					for(elemento in resultFind){
						elemRepetido = elemRepetido || (resultFind[elemento].country===String(req.body.country) && resultFind[elemento].year===parseInt(req.body.year));
					}

					if(elemRepetido){
						res.sendStatus(409);
						console.log("Elemento Repetido");
					}
					else{
						povertyRisks_DB.insert(req.body);
						res.sendStatus(201);
					}
				}
				else{
					res.sendStatus(400); //BAD REQUEST
				}                  
			}
		});        
	});


	/*
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
	
	});*/

	//Post ERRONEO de elemento

	app.post(BASE_API_PATH+"/poverty_risks/:country/:year", function(req, res) { 

		res.status(405).send("Metodo no permitido"); //Method not allowed
	});



	//Delete del array completo

	app.delete(BASE_API_PATH+"/poverty_risks", (req,res)=>{
		//Elimina todos los elementos de la base de datos
            
		povertyRisks_DB.remove({},{multi: true},(error, numRemov)=>{
			//numRemov indica el nº de elementos borrados

			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get elemento");
				res.sendStatus(500); //Error de servidor

			}else {
				res.sendStatus(200);
			}
		});
	
	});


	/*
	//Delete del array completo

	app.delete(BASE_API_PATH+"/poverty_risks", (req,res)=>{
		
		poverty_risks_array = []; // vaciamos el array
		res.status(200).send("Eliminacion correcta");
	
	});
	*/

	//Delete de elementos por pais

	app.delete(BASE_API_PATH+"/poverty_risks/:country", function(req, res) { 

		//Se hace un filtrado por pais, eliminando aquellos que coinciden con el pais dado
		povertyRisks_DB.find({country : String(req.params.country)}, (error, resultFind)=>{ //Comprobamos si existe el elemento ya

			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get elemento");
				res.sendStatus(500); //Error de servidor
			}
			else{
				if(resultFind.length == 0){  //Comprobamos si existen aquellos elementos que se desean eliminar
					res.sendStatus(404); //No se han encontrado elementos
				}
				else{
					povertyRisks_DB.remove({country : String(req.params.country)},{multi: true},(error, numRemov)=>{
						if(error){
							console.log("Se ha producido un error de servdor al hacer petición Get elemento");
							res.sendStatus(500); //Error de servidor

						}else {
							res.sendStatus(200);
						} 
					});
				}
			   
			}
		});

	});

	//Delete elemento por pais y año

	app.delete(BASE_API_PATH+"/poverty_risks/:country/:year", function(req, res) { 
		povertyRisks_DB.find({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]}, (error, resultFind)=>{
			//Comprobamos si existe el elemento ya

			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get elemento");
				res.sendStatus(500); //Error de servidor
			}
			else{
				if(resultFind.length == 0){  //Comprobamos si existen aquellos elementos que se desean eliminar
					res.sendStatus(404); //No se han encontrado elementos
				}
				else{
					povertyRisks_DB.remove({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]},{},(error, numRemov)=>{
					//Se elimina aquel cuyo país y año coincida
						
						if(error){
							console.log("Se ha producido un error de servdor al hacer petición Get elemento");
							res.sendStatus(500); //Error de servidor

						}else {
							res.sendStatus(200);
						}
					});
				}
			}
		});
	});


	/*
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
	*/

	//Put modificar elemento

	app.put(BASE_API_PATH+"/poverty_risks/:country/:year", function(req, res) { 
		povertyRisks_DB.find({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]}, (error, resultFind)=>{
			//Comprobamos si existe el elemento ya

			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get elemento");
				res.sendStatus(500); //Error de servidor
			}
			else{
				if(resultFind.length == 0){  //Comprobamos si existen aquellos elementos que se desean eliminar
					povertyRisks_DB.insert(req.body); //Si no existe el elemento se crea
					res.sendStatus(201);
				}
				else{ 
					povertyRisks_DB.update({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]},{$set: req.body},{},(error, numReplaced)=>{
						if(error){
							console.log("Se ha producido un error de servdor al hacer petición Get elemento");
							res.sendStatus(500); //Error de servidor

						}else {
							res.sendStatus(200); //Elemento Modificado
						}

					});
					
				}
			}
		});
		
	});


	/*
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
	*/

	//Put ERRONEO array de elementos

	app.put(BASE_API_PATH+"/poverty_risks", function(req, res) { 

		res.status(405).send("Metodo no permitido"); //Method not allowed
	});

};