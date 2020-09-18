const express = require("express");
const bodyParser = require("body-parser"); 
const path = require("path");

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 8000;
//app.use("/", express.static(path.join(__dirname,"/front/myteam-app/src")));

//Prueba Heroku
app.use("/", express.static(path.join(__dirname,"/front/myteam/dist/myteam")));
//app.use("/", express.static(path.join(__dirname,"/front/myteam-app/src")));

const stats_API = require(path.join(__dirname,"/back"));
stats_API(app);

app.listen(port, () => {
	console.log("Server ready!");
});