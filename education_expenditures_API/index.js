/*

****************************
*	    MILESTONE F04      *
*   LAB 07-MODULARIZACIÓN  *
****************************
*/

// Api Manuel González Regadera - education_expenditures


/*

            var c = req.params.country!=undefined?String(req.params.country):"";
            var y = req.params.year!=undefined?String(req.params.year):"";
            var pm = req.params.education_expenditure_per_millions!=undefined?parseInt(req.params.education_expenditure_per_millions):0;
            var pp= req.params.education_expenditure_per_public_expenditure!=undefined?parseInt(req.params.education_expenditure_per_public_expenditure):0;
            var gdp = req.params.education_expenditure_gdp!=undefined?parseInt(req.params.education_expenditure_gdp):0;
            var pc = req.params.education_expenditure_per_capita!=undefined?parseInt(req.params.education_expenditure_per_capita):0;




*/

    module.exports.register = (app, BASE_API_PATH,dataBase) => {

        //Definimos los datos iniciales
            
    var datos_EE =  [
        {
            "year": 2016,
            "country":"Spain",
            "education_expenditure_per_millions": 46882.8 ,
            "education_expenditure_per_public_expenditure":9.97,
            "education_expenditure_gdp":4.21,
            "education_expenditure_per_capita":1009.00
        },

        {
            "year": 2016,
            "country":"Germany",
            "education_expenditure_per_millions": 150496.7,
            "education_expenditure_per_public_expenditure":10.93,
            "education_expenditure_gdp":4.8,
            "education_expenditure_per_capita":1828.00
        },

        {
            "year":2015,
            "country":"France",
            "education_expenditure_per_millions": 120127.6 ,
            "education_expenditure_per_public_expenditure":9.66,
            "education_expenditure_gdp":5.46,
            "education_expenditure_per_capita":1804.00
        },

        {
            "year":2015,
            "country":"Spain",
            "education_expenditure_per_millions": 46038.8 ,
            "education_expenditure_per_public_expenditure":9.77,
            "education_expenditure_gdp":4.27,
            "education_expenditure_per_capita":992.00
        },

        {
            "year":2015,
            "country":"Germany",
            "education_expenditure_per_millions": 145413.4 ,
            "education_expenditure_per_public_expenditure":10.98,
            "education_expenditure_gdp":4.81,
            "education_expenditure_per_capita":1780.00
        },
        
        {
            "year":2014,
            "country":"France",
            "education_expenditure_per_millions": 118496.3 ,
            "education_expenditure_per_public_expenditure":9.66,
            "education_expenditure_gdp":5.51,
            "education_expenditure_per_capita":1787.00
        }

    ];

        // Insertamos los datos iniciales en la base de datos

        app.get(BASE_API_PATH+"/education_expenditures/loadInitialData", (req,res)=>{ 
            
            //Cuando llamen a /api/v1/education_expenditures
            //Debemos enviar el objeto pero pasandolo a JSON

            
                dataBase.find({}, (error, ee_db)=>{ // Comprobamos si los elementos están

                    if(error){
                        console.log("Se ha producido un error de servdor al hacer petición Get all");
                        res.sendStatus(500); //Error de servidor
                    }
                    else{
                        dataBase.insert(datos_EE);
                        res.sendStatus(200);                        
                    }
                });          
        });

        

        //Generamos las distintas peticiones

        //Get del array completo
        app.get(BASE_API_PATH+"/education_expenditures", (req,res)=>{ 
            
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
            console.log(upc);

            //Hacemos uso de bases de datos
            dataBase.find({$and:[{education_expenditure_per_millions : {$gt : apm,$lt:upm}}, {education_expenditure_per_public_expenditure: {$gt : app,$lt:upp}},{education_expenditure_gdp:{$gt : agdp,$lt:ugdp}}, {education_expenditure_per_capita:{$gt : apc,$lt:upc}}]})
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
                                education_expenditure_per_public_expenditure:objeto.education_expenditure_per_public_expenditure,
                                education_expenditure_gdp:objeto.education_expenditure_gdp,
                                education_expenditure_per_capita:objeto.education_expenditure_per_capita};

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
                                education_expenditure_per_public_expenditure:objeto.education_expenditure_per_public_expenditure,
                                education_expenditure_gdp:objeto.education_expenditure_gdp,
                                education_expenditure_per_capita:objeto.education_expenditure_per_capita};

                            });
                        res.status(200).send(JSON.stringify(dataToSend,null,2)); //Tamaño de la página y salto;
                    }
                    
                }

                
            });
        });

        //Get para tomar elementos por pais
        
        app.get(BASE_API_PATH+'/education_expenditures/:country', (req,res)=>{ //Cuando llamen a /api/v1/education_expenditures/(pais)
            
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
                                    education_expenditure_per_public_expenditure:objeto.education_expenditure_per_public_expenditure,
                                    education_expenditure_gdp:objeto.education_expenditure_gdp,
                                    education_expenditure_per_capita:objeto.education_expenditure_per_capita};
    
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
                                    education_expenditure_per_public_expenditure:objeto.education_expenditure_per_public_expenditure,
                                    education_expenditure_gdp:objeto.education_expenditure_gdp,
                                    education_expenditure_per_capita:objeto.education_expenditure_per_capita};
    
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
                                    education_expenditure_per_public_expenditure:objeto.education_expenditure_per_public_expenditure,
                                    education_expenditure_gdp:objeto.education_expenditure_gdp,
                                    education_expenditure_per_capita:objeto.education_expenditure_per_capita};
    
                                });
                            res.status(200).send(JSON.stringify(dataToSend[0],null,2)); //Tamaño de la página y salto;
                        
                    }
                }
            });
            
        });

        //Post al array completo para incluir datos como los de la ficha de propuestas

        app.post(BASE_API_PATH+"/education_expenditures", (req,res)=>{

            var rep = false;
            
            dataBase.find({}, (error, ee_db)=>{ //Comprobamos si existe el elemento ya

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get elemento");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    //Comprobamos que se cumple la estructura JSON predefinida

                    var c = req.body.country!=undefined;
                    var p = req.body.year!=undefined;
                    var pm = req.body.education_expenditure_per_millions!=undefined;
                    var pp= req.body.education_expenditure_per_public_expenditure!=undefined;
                    var gdp = req.body.education_expenditure_gdp!=undefined;
                    var pc = req.body.education_expenditure_per_capita!=undefined;

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
                            dataBase.insert(req.body);
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

        app.post(BASE_API_PATH+"/education_expenditures/:country/:year", function(req, res) { 

            res.status(405).send("Metodo no permitido"); //Method not allowed
        });

        //Delete del array completo

        app.delete(BASE_API_PATH+"/education_expenditures", (req,res)=>{ //Elimina todos los elementos de la base de datos
            
            dataBase.remove({},{multi: true},(error, numRemov)=>{
                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get elemento");
                    res.sendStatus(500); //Error de servidor

                }else {
                    res.sendStatus(200);
                }
            });
        
        });

        //Delete de elementos por pais

        app.delete(BASE_API_PATH+"/education_expenditures/:country", function(req, res) { 

            //Se hace un filtrado por pais, eliminando aquellos que coinciden con el pais dado
            dataBase.find({country : String(req.params.country)}, (error, ee_db)=>{ //Comprobamos si existe el elemento ya

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get elemento");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    if(ee_db.length == 0){  //Comprobamos si existen aquellos elementos que se desean eliminar
                        res.sendStatus(404); //No se han encontrado elementos
                    }
                    else{
                        dataBase.remove({country : String(req.params.country)},{multi: true},(error, numRemov)=>{
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

        app.delete(BASE_API_PATH+"/education_expenditures/:country/:year", function(req, res) { 
            dataBase.find({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]}, (error, ee_db)=>{ //Comprobamos si existe el elemento ya

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get elemento");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    if(ee_db.length == 0){  //Comprobamos si existen aquellos elementos que se desean eliminar
                        res.sendStatus(404); //No se han encontrado elementos
                    }
                    else{
                        dataBase.remove({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]},{},(error, numRemov)=>{ //Se elimina aquel cuyo país y año coincida
                            
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

        app.put(BASE_API_PATH+"/education_expenditures/:country/:year", function(req, res) { 
            dataBase.find({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]}, (error, ee_db)=>{ //Comprobamos si existe el elemento ya

                if(error){
                    console.log("Se ha producido un error de servdor al hacer petición Get elemento");
                    res.sendStatus(500); //Error de servidor
                }
                else{
                    if(ee_db.length == 0){  //Comprobamos si existen aquellos elementos que se desean eliminar
                        dataBase.insert(req.body); //Si no existe el elemento se crea
                        res.sendStatus(201);
                    }
                    else{ 
                        dataBase.update({$and: [{country : String(req.params.country)}, {year : parseInt(req.params.year)}]},{$set: req.body},{},(error, numReplaced)=>{
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

        app.put(BASE_API_PATH+"/education_expenditures", function(req, res) { 

            res.status(405).send("Metodo no permitido"); //Method not allowed
        });
    };