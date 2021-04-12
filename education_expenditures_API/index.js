/*

****************************
*	    MILESTONE F04      *
*   LAB 07-MODULARIZACIÓN  *
****************************

*/

// Api Manuel González Regadera - education_expenditures


    module.exports.register = (app, BASE_API_PATH) => {
            //Creamos el array de objetos relativos al gasto en educación, inicialmente vacío.

        var education_expenditure_array = [];

        //Generamos las distintas peticiones

        //Get del array completo
        app.get(BASE_API_PATH+"/education_expenditures", (req,res)=>{ //Cuando llamen a /api/v1/education_expenditures
            //Debemos enviar el objeto pero pasandolo a JSON
            
            res.send(JSON.stringify(education_expenditure_array,null,2));
        });

        //Get para incluir los elementos iniciales
        app.get(BASE_API_PATH+"/education_expenditures/loadInitialData", (req,res)=>{ 
            
            //Definimos los datos iniciales
            
            var datosIniciales_EE =  [
                {
                    "year":"2016",
                    "country":"Spain",
                    "education_expenditure_per_millions": "46.882,8" ,
                    "education_expenditure_per_public_expenditure":"9,97",
                    "education_expenditure_gdp":"4,21",
                    "education_expenditure_per_capita":"1,009.00"
                },

                {
                    "year":"2016",
                    "country":"Germany",
                    "education_expenditure_per_millions": "150.496,7" ,
                    "education_expenditure_per_public_expenditure":"10,93",
                    "education_expenditure_gdp":"4,8",
                    "education_expenditure_per_capita":"1,828.00"
                },

                {
                    "year":"2015",
                    "country":"France",
                    "education_expenditure_per_millions": "118.496,3" ,
                    "education_expenditure_per_public_expenditure":"9,66",
                    "education_expenditure_gdp":"5,46",
                    "education_expenditure_per_capita":"1,804.00"
                }
            ];

            // Incluimos los datos en el array 

            for(var e in datosIniciales_EE){
                education_expenditure_array.push(datosIniciales_EE[e]);
            }

            //Eliminamos repetidos en caso de que se hayan cargado previamente

            education_expenditure_array = education_expenditure_array.map(e => JSON.stringify(e)); //Lo pasamos a JSON para poder compararlos

            education_expenditure_array = new Set(education_expenditure_array); //Lo convertimos a conjunto para eliminar repetidos

            education_expenditure_array = [...education_expenditure_array] //Lo convertimos de nuevo a array

            education_expenditure_array = education_expenditure_array.map(e => JSON.parse(e)) //Lo pasamos de nuevo a objetos

            
            //Indicamos al usuario que se han cargado exitosamente los datos
            
            res.status(200).send(`<!DOCTYPE html>
                        <html>
                            <head>
                                <title>Education expenditures initial data</title>
                            </head>
                            <body>
                                <h3>Initial data loaded successfully</h3>
                            </body>
                        </html>`);
            
            
        });

        //Get para tomar elementos por pais
        
        app.get(BASE_API_PATH+'/education_expenditures/:country', (req,res)=>{ //Cuando llamen a /api/v1/education_expenditures/(pais)
            
            //Crearemos un nuevo array resultado de filtrar el array completo
            var filtraPaises = education_expenditure_array.filter(function(e){ 
                return e.country==String(req.params.country);
            });

            if (filtraPaises.length==0){
                //Debemos enviar el objeto pero pasandolo a JSON
                res.status(404);
            }
            else{
                //Debemos enviar el objeto pero pasandolo a JSON
                res.status(200).send(JSON.stringify(filtraPaises,null,2));
            }
            
            
                    
        });

        //Get para tomar elementos por pais y año
        
        app.get(BASE_API_PATH+"/education_expenditures/:country/:year", (req,res)=>{ //Cuando llamen a /api/v1/education_expenditures/(pais)
            
            //Crearemos un nuevo array resultado de filtrar el array completo
            var filtraPA = education_expenditure_array.filter(function(e){ 
                return e.country==String(req.params.country) && e.year==String(req.params.year);
            });

            if (filtraPA.length==0){
                //No se encuentra el archivo
                res.sendStatus(404);
            }
            else{
                //Debemos enviar el objeto pero pasandolo a JSON
                res.status(200).send(JSON.stringify(filtraPA,null,2));
            }
            
        });

        //Post al array completo para incluir datos como los de la ficha de propuestas

        app.post(BASE_API_PATH+"/education_expenditures", (req,res)=>{
            
            var newData = req.body; //Se toma el cuerpo de la peticion donde estan los datos
            education_expenditure_array.push(newData); //Se introduce el nuevo elemento

            //Eliminamos repetidos en caso de que se hayan cargado previamente

            education_expenditure_array = education_expenditure_array.map(e => JSON.stringify(e)); //Lo pasamos a JSON para poder compararlos

            education_expenditure_array = new Set(education_expenditure_array); //Lo convertimos a conjunto para eliminar repetidos

            education_expenditure_array = [...education_expenditure_array] //Lo convertimos de nuevo a array

            education_expenditure_array = education_expenditure_array.map(e => JSON.parse(e)) //Lo pasamos de nuevo a objetos

            //Devolvemos el estado
            res.sendStatus(201);
        
        });

        //Post ERRONEO de elemento

        app.post(BASE_API_PATH+"/education_expenditures/:country/:year", function(req, res) { 

            res.status(405).send("Metodo no permitido"); //Method not allowed
        });

        //Delete del array completo

        app.delete(BASE_API_PATH+"/education_expenditures", (req,res)=>{
            
            education_expenditure_array = []; // vaciamos el array
            res.status(200).send("Eliminacion correcta");
        
        });

        //Delete de elementos por pais

        app.delete(BASE_API_PATH+"/education_expenditures/:country", function(req, res) { 

            //Se hace un filtrado por pais, eliminando aquellos que coinciden con el pais dado
            var tamIni = education_expenditure_array.length;
            
            education_expenditure_array = education_expenditure_array.filter(function(e){ 
                return e.country!==String(req.params.country);
            });

            var tamFin = education_expenditure_array; 

            if (tamFin === tamIni){
                //No se encuentra el archivo
                res.sendStatus(404);
            }
            else{
                res.status(200).send("Eliminacion correcta");
            }

        });

        //Delete elemento por pais y año

        app.delete(BASE_API_PATH+"/education_expenditures/:country/:year", function(req, res) { 
            //Tomamos una variable para indicar si se encuentra el elemento
            var encontrado = false;
            //Recorremos el array en busca del elemento a eliminar
            for(var e in education_expenditure_array){
                if(education_expenditure_array[e].country == String(req.params.country) &&
                    education_expenditure_array[e].year == String(req.params.year)){
                        education_expenditure_array.splice(e,1);//Eliminamos 1 elemento desde la posicion e
                        encontrado = true;
                        break;
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

        //Put modificar elemento

        app.put(BASE_API_PATH+"/education_expenditures/:country/:year", function(req, res) { 

            //Recorremos el array en busca del elemento a modificar
            for(var e in education_expenditure_array){
                if(education_expenditure_array[e].country == String(req.params.country) &&
                    education_expenditure_array[e].year == String(req.params.year)){
                        var newData = req.body;
                        education_expenditure_array[e] = newData;
                        break;
                }
            }

            //Eliminamos repetidos en caso de que se haya realizado un cambio para añadirlo

            education_expenditure_array = education_expenditure_array.map(e => JSON.stringify(e)); //Lo pasamos a JSON para poder compararlos

            education_expenditure_array = new Set(education_expenditure_array); //Lo convertimos a conjunto para eliminar repetidos

            education_expenditure_array = [...education_expenditure_array] //Lo convertimos de nuevo a array

            education_expenditure_array = education_expenditure_array.map(e => JSON.parse(e)) //Lo pasamos de nuevo a objetos

            res.status(200).send("Modificacion/Inserción correcta");
        });

        //Put ERRONEO array de elementos

        app.put(BASE_API_PATH+"/education_expenditures", function(req, res) { 

            res.status(405).send("Metodo no permitido"); //Method not allowed
        });
    };