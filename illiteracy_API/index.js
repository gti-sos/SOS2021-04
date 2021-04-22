






	module.exports.register = (app,BASE_API_PATH,illiteracy_DB) => {

        //Definimos los datos iniciales
            
    var datos_EE =  [
        {
			"year":2018,
			"country":"Spain",
			"female_illiteracy_rate":97.97,
			"male_illiteracy_rate":98.93,
			"adult_illiteracy_rate":98.44,
			"young_illiteracy_rate":99.72
		},

		{
			"year":2018,
			"country":"Italy",
			"female_illiteracy_rate":98.97,
			"male_illiteracy_rate":99.35,
			"adult_illiteracy_rate":99.16,
			"young_illiteracy_rate":99.99
		},

		{
			"year":2018,
			"country":"Portugal",
			"female_illiteracy_rate":95.05,
			"male_illiteracy_rate":97.35,
			"adult_illiteracy_rate":96.14,
			"young_illiteracy_rate":99.66
		}

    ];

        // Insertamos los datos iniciales en la base de datos

        app.get(BASE_API_PATH+"/illiteracy/loadInitialData", (req,res)=>{ 
            
            //Cuando llamen a /api/v1/education_expenditures
            //Debemos enviar el objeto pero pasandolo a JSON
			console.log("patata");

            
			illiteracy_DB.find({}, (error, ee_db)=>{ // Comprobamos si los elementos están

                    if(error){
                        console.log("Se ha producido un error de servdor al hacer petición Get all");
                        res.sendStatus(500); //Error de servidor
                    }
                    else{
                        illiteracy_DB.insert(datos_EE);
                        res.sendStatus(200);                        
                    }
                });          
        });

        

        //Generamos las distintas peticiones

        //Get del array completo
        app.get(BASE_API_PATH+"/illiteracy", (req,res)=>{ 
            
            //Cuando llamen a /api/v1/education_expenditures
            //Debemos enviar el objeto pero pasandolo a JSON

            //Permitimos búsquedas con skip y limit
            var skip = req.query.skip!=undefined?parseInt(req.query.skip):0 ;
            var limit = req.query.limit!=undefined?parseInt(req.query.limit):Infinity;

            //Definimos los distintos parametros de búsqueda

            var apm = req.query.apm!=undefined?parseFloat(req.query.apm):0; // aquellos que están por encima de un gasto de x millones en educacion
            var upm = req.query.upm!=undefined?parseFloat(req.query.apm):100000000;// aquellos que están por debajo de un gasto de x millones en educacion
            
            var app= req.query.app!=undefined?parseFloat(req.query.app):0; //aquellos que están por encima de un porcentaje x de gasto publico en educacion
            var upp= req.query.upp!=undefined?parseFloat(req.query.upp):1000000000; //aquellos que están por debajo de un porcentaje x de gasto publico en educacion
            
            var agdp = req.query.agdp!=undefined?parseFloat(req.query.agdp):0;//aquellos que están por encima de un porcentaje x de pib en gasto publico en educacion
            var ugdp = req.query.ugdp!=undefined?parseFloat(req.query.ugdp):100000000;//aquellos que están por debajo de un porcentaje x de pib en gasto publico en educacion
            
            var apc = req.query.apc!=undefined?parseFloat(req.query.apc):0; //aquellos que están por encima de una cantidad x per capita de gasto en educacion
            var upc = req.query.upc!=undefined?parseFloat(req.query.upc):1000000000; //aquellos que están por debajo de una cantidad x per capita de gasto en educacion

            
            console.log(agdp);
			console.log(skip);
			console.log(limit);
            console.log(upc);

            //Hacemos uso de bases de datos
            illiteracy_DB.find({$and:[{female_illiteracy_rate : {$gt : apm,$lt:upm}},{male_illiteracy_rate:{$gt : app,$lt:upp}},{adult_illiteracy_rate:{$gt : agdp,$lt:ugdp}},{young_illiteracy_rate:{$gt : apc,$lt:upc}}]})
                .skip(skip).limit(limit)
                .exec( (error, ee_db)=>{ //No establecemos patrón, por lo que se toman todos

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get all");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    if(ee_db.length == 1){
                        var dataToSend = ee_db.map((objeto) =>
                            {
                                //Ocultamos el atributo id
                                return {year:objeto.year,
                                country:objeto.country,
                                female_illiteracy_rate: objeto.female_illiteracy_rate ,
                                male_illiteracy_rate:objeto.male_illiteracy_rate,
                                adult_illiteracy_rate:objeto.adult_illiteracy_rate,
                                young_illiteracy_rate:objeto.young_illiteracy_rate};

                            });
                        res.status(200).send(JSON.stringify(dataToSend[0],null,2)); //Tamaño de la página y salto;
                    
                    }
                    else{
                        var dataToSend = ee_db.map((objeto) =>
                            {
                                //Ocultamos el atributo id
                                return {year:objeto.year,
									country:objeto.country,
									female_illiteracy_rate: objeto.female_illiteracy_rate ,
									male_illiteracy_rate:objeto.male_illiteracy_rate,
									adult_illiteracy_rate:objeto.adult_illiteracy_rate,
									young_illiteracy_rate:objeto.young_illiteracy_rate};
                            });
                        res.status(200).send(JSON.stringify(dataToSend,null,2)); //Tamaño de la página y salto;
                    }
                }

                
            });
        });

        //Get para tomar elementos por pais
        
        app.get(BASE_API_PATH+'/illiteracy/:country', (req,res)=>{ //Cuando llamen a /api/v1/illiteracy/(pais)
            
            //Permitimos búsquedas con skip y limit
            var skip = req.query.skip!=undefined?parseInt(req.query.skip):0 ;
            var limit = req.query.limit!=undefined?parseInt(req.query.limit):Infinity;

            //Crearemos un nuevo array resultado de filtrar el array completo
            illiteracy_DB.find({country : String(req.params.country)}).skip(skip).limit(limit).exec((error, ee_db)=>{ //Se establece patron por país

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get country");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    if(ee_db.length == 0){
                        res.sendStatus(404); //No se encuentra el elemento 
                    }
                    else{
                        if(ee_db.length == 1){
                            var dataToSend = ee_db.map((objeto) =>
                                {
                                    //Ocultamos el atributo id
                                    return{year:objeto.year,
										country:objeto.country,
										female_illiteracy_rate: objeto.female_illiteracy_rate ,
										male_illiteracy_rate:objeto.male_illiteracy_rate,
										adult_illiteracy_rate:objeto.adult_illiteracy_rate,
										young_illiteracy_rate:objeto.young_illiteracy_rate};
    
                                });
                            res.status(200).send(JSON.stringify(dataToSend[0],null,2)); //Tamaño de la página y salto;
                        
                        }
                        else{
                            var dataToSend = ee_db.map((objeto) =>
                                {
                                    //Ocultamos el atributo id
                                    return {year:objeto.year,
										country:objeto.country,
										female_illiteracy_rate: objeto.female_illiteracy_rate ,
										male_illiteracy_rate:objeto.male_illiteracy_rate,
										adult_illiteracy_rate:objeto.adult_illiteracy_rate,
										young_illiteracy_rate:objeto.young_illiteracy_rate};
    
                                });
                            res.status(200).send(JSON.stringify(dataToSend,null,2)); //Tamaño de la página y salto;
                        }
                    }
                }
            });    
        });


        //Get para tomar elementos por pais y año
        
        app.get(BASE_API_PATH+"/illiteracy/:country/:year", (req,res)=>{ //Cuando llamen a /api/v1/illiteracy/(pais)

            //Crearemos un nuevo array resultado de filtrar el array completo
            illiteracy_DB.find({country : String(req.params.country), year: parseInt(req.params.year)}).exec((error, ee_db)=>{ //Se establece patron por país y año

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get country");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    if(ee_db.length == 0){
                        res.sendStatus(404); //No se encuentra el elemento 
                    }
                    else{
                        var dataToSend = ee_db.map((objeto) =>
                                {
                                    //Ocultamos el atributo id
                                    return {year:objeto.year,
										country:objeto.country,
										female_illiteracy_rate: objeto.female_illiteracy_rate ,
										male_illiteracy_rate:objeto.male_illiteracy_rate,
										adult_illiteracy_rate:objeto.adult_illiteracy_rate,
										young_illiteracy_rate:objeto.young_illiteracy_rate};
    
                                });
                            res.status(200).send(JSON.stringify(dataToSend[0],null,2)); //Tamaño de la página y salto;
                        
                    }
                }
            });
            
        });

        //Post al array completo para incluir datos como los de la ficha de propuestas

        app.post(BASE_API_PATH+"/illiteracy", (req,res)=>{

            var rep = false;
            
            illiteracy_DB.find({}, (error, ee_db)=>{ //Comprobamos si existe el elemento ya

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get elemento");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    //Comprobamos que se cumple la estructura JSON predefinida

                    var c = req.body.country!=undefined;
                    var p = req.body.year!=undefined;
                    var pm = req.body.female_illiteracy_rate!=undefined;
                    var pp= req.body.male_illiteracy_rate!=undefined;
                    var gdp = req.body.adult_illiteracy_rate!=undefined;
                    var pc = req.body.young_illiteracy_rate!=undefined;

                    var cumple = c && p && pm && pp && gdp && pc;

                    if(cumple){

                        for(elemento in ee_db){
                            rep = rep || (ee_db[elemento].country===String(req.body.country) && ee_db[elemento].year===parseInt(req.body.year));
                        }
    
                        if(rep){
                            res.sendStatus(409);
                            console.log("Elemento Repetido");
                        }
                        else{
                            illiteracy_DB.insert(req.body);
                            res.sendStatus(201);
                        }
                    }
                    else{
                        res.sendStatus(400); //BAD REQUEST
                    }                  
                }
            });        
        });

        //Post ERRONEO de elemento

        app.post(BASE_API_PATH+"/illiteracy/:country/:year", function(req, res) { 

            res.status(405).send("Metodo no permitido"); //Method not allowed
        });

        //Delete del array completo

        app.delete(BASE_API_PATH+"/illiteracy", (req,res)=>{ //Elimina todos los elementos de la base de datos
            
            illiteracy_DB.remove({},{multi: true},(error, numRemov)=>{
                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get elemento");
                    res.sendStatus(500); //Error de servidor

                }else {
                    res.sendStatus(200);
                }
            });
        
        });

        //Delete de elementos por pais

        app.delete(BASE_API_PATH+"/illiteracy/:country", function(req, res) { 

            //Se hace un filtrado por pais, eliminando aquellos que coinciden con el pais dado
            illiteracy_DB.find({country : String(req.params.country)}, (error, ee_db)=>{ //Comprobamos si existe el elemento ya

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get elemento");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    if(ee_db.length == 0){  //Comprobamos si existen aquellos elementos que se desean eliminar
                        res.sendStatus(404); //No se han encontrado elementos
                    }
                    else{
                        illiteracy_DB.remove({country : String(req.params.country)},{multi: true},(error, numRemov)=>{
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

        app.delete(BASE_API_PATH+"/illiteracy/:country/:year", function(req, res) { 
            illiteracy_DB.find({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]}, (error, ee_db)=>{ //Comprobamos si existe el elemento ya

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get elemento");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    if(ee_db.length == 0){  //Comprobamos si existen aquellos elementos que se desean eliminar
                        res.sendStatus(404); //No se han encontrado elementos
                    }
                    else{
                        illiteracy_DB.remove({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]},{},(error, numRemov)=>{ //Se elimina aquel cuyo país y año coincida
                            
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

        //Put modificar elemento

        app.put(BASE_API_PATH+"/illiteracy/:country/:year", function(req, res) { 
            illiteracy_DB.find({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]}, (error, ee_db)=>{ //Comprobamos si existe el elemento ya

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get elemento");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    if(ee_db.length == 0){  //Comprobamos si existen aquellos elementos que se desean eliminar
                        illiteracy_DB.insert(req.body); //Si no existe el elemento se crea
                        res.sendStatus(201);
                    }
                    else{ 
                        illiteracy_DB.update({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]},{$set: req.body},{},(error, numReplaced)=>{
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

        //Put ERRONEO array de elementos

        app.put(BASE_API_PATH+"/illiteracy", function(req, res) { 

            res.status(405).send("Metodo no permitido"); //Method not allowed
        });
    };

































	/*

	
module.exports.register = (app, BASE_API_PATH,illiteracy_DB) => {
    // Api Miguel Gómez Vázquez - illiteracy
	var datos_Illiteracy = [
		{
			"year":2018,
			"country":"Spain",
			"female_illiteracy_rate":97.97,
			"male_illiteracy_rate":98.93,
			"adult_illiteracy_rate":98.44,
			"young_illiteracy_rate":99.72
		},

		{
			"year":2018,
			"country":"Italy",
			"female_illiteracy_rate":98.97,
			"male_illiteracy_rate":99.35,
			"adult_illiteracy_rate":99.16,
			"young_illiteracy_rate":99.99
		},

		{
			"year":2018,
			"country":"Portugal",
			"female_illiteracy_rate":95.05,
			"male_illiteracy_rate":97.35,
			"adult_illiteracy_rate":96.14,
			"young_illiteracy_rate":99.66
		}

	];
	 // Insertamos los datos iniciales en la base de datos

	app.get(BASE_API_PATH+"/illiteracy/loadInitialData", (req,res)=>{ 
            
		//Cuando llamen a /api/v1/illiteracy
		//Debemos enviar el objeto pero pasandolo a JSON
		illiteracy_DB.find({}, (error, ee_db)=>{ // Comprobamos si los elementos están
			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get all");
				window.alert(error);
				res.sendStatus(500); //Error de servidor
			}
			else{
				illiteracy_DB.insert(datos_Illiteracy);
				res.sendStatus(200);                        
			}
		});
		          
	});

	//Get del array completo
	app.get(BASE_API_PATH+"/illiteracy", (req,res)=>{ 
            
		//Cuando llamen a /api/v1/illiteracy
		//Debemos enviar el objeto pero pasandolo a JSON

		//Permitimos búsquedas con skip y limit
		var skip = req.query.skip!=undefined?parseInt(req.query.skip):0 ;
		var limit = req.query.limit!=undefined?parseInt(req.query.limit):Infinity;

		//Definimos los distintos parametros de búsqueda

		var afi = req.query.afi!=undefined?parseFloat(req.query.afi):0; // aquellos que están por encima de un gasto de x millones en educacion
		var ufi = req.query.ufi!=undefined?parseFloat(req.query.afi):100000000;// aquellos que están por debajo de un gasto de x millones en educacion
		
		var ami= req.query.ami!=undefined?parseFloat(req.query.ami):0; //aquellos que están por encima de un porcentaje x de gasto publico en educacion
		var umi= req.query.umi!=undefined?parseFloat(req.query.umi):1000000000; //aquellos que están por debajo de un porcentaje x de gasto publico en educacion
		
		var aai = req.query.aai!=undefined?parseFloat(req.query.aai):0;//aquellos que están por encima de un porcentaje x de pib en gasto publico en educacion
		var uai = req.query.uai!=undefined?parseFloat(req.query.uai):100000000;//aquellos que están por debajo de un porcentaje x de pib en gasto publico en educacion
		
		var ayi = req.query.ayi!=undefined?parseFloat(req.query.ayi):0; //aquellos que están por encima de una cantidad x per capita de gasto en educacion
		var uyi = req.query.uyi!=undefined?parseFloat(req.query.uyi):1000000000; //aquellos que están por debajo de una cantidad x per capita de gasto en educacion

		
		console.log(aai);
		console.log(uyi);

		//Hacemos uso de bases de datos
		dataBase.find({$and:[{female_illiteracy_rate : {$gt : afi,$lt:ufi}},{male_illiteracy_rate: {$gt : ami,$lt:umi}},{adult_illiteracy_rate:{$gt : aai,$lt:uai}},{young_illiteracy_rate:{$gt : ayi,$lt: uyi}}]})
			.skip(skip).limit(limit)
			.exec( (error, ee_db)=>{ //No establecemos patrón, por lo que se toman todos

			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get all");
				res.sendStatus(500); //Error de servidor
			}
			else{
				if(ee_db.length == 1){
					var dataToSend = ee_db.map((objeto) =>
						{
							//Ocultamos el atributo id
							return {year:objeto.year,
							country:objeto.country,
							education_expenditure_per_millions: objeto.education_expenditure_per_millions ,
							male_illiteracy_rate:objeto.male_illiteracy_rate,
							adult_illiteracy_rate:objeto.adult_illiteracy_rate,
							young_illiteracy_rate:objeto.young_illiteracy_rate};

						});
					res.status(200).send(JSON.stringify(dataToSend[0],null,2)); //Tamaño de la página y salto;
				
				}
				else{
					var dataToSend = ee_db.map((objeto) =>
						{
							//Ocultamos el atributo id
							return {year:objeto.year,
								country:objeto.country,
								education_expenditure_per_millions: objeto.education_expenditure_per_millions,
								male_illiteracy_rate:objeto.male_illiteracy_rate,
								adult_illiteracy_rate:objeto.adult_illiteracy_rate,
								young_illiteracy_rate:objeto.young_illiteracy_rate};

						});
					res.status(200).send(JSON.stringify(dataToSend,null,2)); //Tamaño de la página y salto;
				}
				
			}

			
		});
	});

	 //Get para tomar elementos por pais
        
	 app.get(BASE_API_PATH+'/illiteracy/:country', (req,res)=>{ //Cuando llamen a /api/v1/education_expenditures/(pais)
            
		//Permitimos búsquedas con skip y limit
		var skip = req.query.skip!=undefined?parseInt(req.query.skip):0 ;
		var limit = req.query.limit!=undefined?parseInt(req.query.limit):Infinity;

		//Crearemos un nuevo array resultado de filtrar el array completo
		dataBase.find({country : String(req.params.country)}).skip(skip).limit(limit).exec((error, ee_db)=>{ //Se establece patron por país

			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get country");
				res.sendStatus(500); //Error de servidor
			}
			else{
				if(ee_db.length == 0){
					res.sendStatus(404); //No se encuentra el elemento 
				}
				else{
					if(ee_db.length == 1){
						var dataToSend = ee_db.map((objeto) =>
							{
								//Ocultamos el atributo id
								return {year:objeto.year,
									country:objeto.country,
									education_expenditure_per_millions: objeto.education_expenditure_per_millions ,
									male_illiteracy_rate:objeto.male_illiteracy_rate,
									adult_illiteracy_rate:objeto.adult_illiteracy_rate,
									young_illiteracy_rate:objeto.young_illiteracy_rate};

							});
						res.status(200).send(JSON.stringify(dataToSend[0],null,2)); //Tamaño de la página y salto;
					
					}
					else{
						var dataToSend = ee_db.map((objeto) =>
							{
								//Ocultamos el atributo id
								return {year:objeto.year,
									country:objeto.country,
									education_expenditure_per_millions: objeto.education_expenditure_per_millions ,
									male_illiteracy_rate:objeto.male_illiteracy_rate,
									adult_illiteracy_rate:objeto.adult_illiteracy_rate,
									young_illiteracy_rate:objeto.young_illiteracy_rate};

							});
						res.status(200).send(JSON.stringify(dataToSend,null,2)); //Tamaño de la página y salto;
					}
				}
			}
		});    
	});


	//Get para tomar elementos por pais y año
	
	app.get(BASE_API_PATH+"/illiteracy/:country/:year", (req,res)=>{ //Cuando llamen a /api/v1/illiteracy/(pais)

		//Crearemos un nuevo array resultado de filtrar el array completo
		dataBase.find({country : String(req.params.country), year: parseInt(req.params.year)}).exec((error, ee_db)=>{ //Se establece patron por país y año

			if(error){
				console.log("Se ha producido un error de servdor al hacer petición Get country");
				res.sendStatus(500); //Error de servidor
			}
			else{
				if(ee_db.length == 0){
					res.sendStatus(404); //No se encuentra el elemento 
				}
				else{
					var dataToSend = ee_db.map((objeto) =>
							{
								//Ocultamos el atributo id
								return {year:objeto.year,
									country:objeto.country,
									education_expenditure_per_millions: objeto.education_expenditure_per_millions ,
									male_illiteracy_rate:objeto.male_illiteracy_rate,
									adult_illiteracy_rate:objeto.adult_illiteracy_rate,
									young_illiteracy_rate:objeto.young_illiteracy_rate};

							});
						res.status(200).send(JSON.stringify(dataToSend[0],null,2)); //Tamaño de la página y salto;
					
				}
			}
		});
		
	});

	
};
	
	
	
                    
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
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
/*
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


*/

