const express = require("express");
const bodyParser = require("body-parser"); 
const path = require("path");

const cors = require("cors");

const app = express();
app.use(bodyParser.json());
/*
const multer = require("multer");
app.use(multer({dest:'upload/temp'}).single('file'));
*/

const port = process.env.PORT || 8000;
//app.use("/", express.static(path.join(__dirname,"/front/myteam-app/src")));

app.use(cors());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname,'front/myteam/dist/myteam')));
}


app.get('/', (request, response) => {
	//response.sendFile(path.join(__dirname,"/front/myteam/dist/myteam/index.html"));
	response.sendFile(path.join(__dirname,"front","myteam","dist","myteam","index.html"));
});

const stats_API = require(path.join(__dirname,"/back"));
stats_API(app);

app.listen(port, () => {
	console.log("- PORT: "+port);
	console.log("Server ready!");
});