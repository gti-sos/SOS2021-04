
/*

****************************
*	  MILESTONE F03      *
****************************

*/

// Creamos una variable express para el desarrollo web

var express = require("express");

var app = express();

//Definimos el puerto al que estará asociado el servidor web

var port = process.env.PORT || 10000;

//Para jugar con rutas usamos el modulo path

var path = require("path");

//Definimos las rutas de recursos

app.use("/", express.static(path.join(__dirname,"./public"))); //La variable __dirname encadena la carpeta actual con la public

//Ponemos el servidor a escuchar

app.listen(port, () =>{
    console.log("Server ready to listen on port " + port);
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

*/