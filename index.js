const express = require("express");
const bodyParser = require("body-parser"); 
const path = require("path");

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 8000;
//app.use("/", express.static(path.join(__dirname,"/front/myteam-app/src")));

//Prueba Heroku
if (process.env.NODE_ENV === 'production') {
	console.log("Entro en production");
	app.use(express.static('front/myteam/dist/myteam'));
}

app.get('*', (request, response) => {
	//response.sendFile(path.join(__dirname, "/front/myteam/dist/myteam/index.html"));
	response.sendFile("./front/myteam/dist/myteam/index.html");
});

console.log("RUTA: "+path.join(__dirname,"/front/myteam/dist/myteam"));

const stats_API = require(path.join(__dirname,"/back"));
stats_API(app);

app.listen(port, () => {
	console.log("Server ready!");
});