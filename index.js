const express = require("express");
const bodyParser = require("body-parser"); 
const path = require("path");

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 8000;
//app.use("/", express.static("./public"));

const stats_API = require(path.join(__dirname,"/src/back"));
stats_API(app);

app.listen(port, () => {
	console.log("Server ready!");
});