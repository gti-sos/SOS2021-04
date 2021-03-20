
/*

****************************
*	    MILESTONE F03      *
****************************
/*								COMENTARIO DE PRUEBA
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

// Recurso Manuel Gonzalez Regadera - education_expenditure

app.get("/info/education_expenditure", (request,response)=>{

	response.send(`<!DOCTYPE html>
				<html>
					<head>
						<title>Education_Expenditure</title>
					</head>

					<body>
						<h3>El Gasto Público en Educación es aquel que destina el Gobierno a instituciones educativas, administración educativa
						 y subsidios para estudiantes y otras entidades privadas a lo largo de un año </h3>
						 </br>

						 <table class="default">

						<tr>
							<td>year</td>
							<td>country</td>
							<td>education_expenditure_perMillions</td>
							<td>education_expenditure_perPublicExpenditure</td>
							<td>education_expenditure_gdp</td>
							<td>education_expenditure_perCapita</td>
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

