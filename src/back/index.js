module.exports = function(app){

    const mongoose = require('mongoose')
    const assert = require('assert');
    const path = require('path');
    require('dotenv').config({path: 'variables.env'});

    const dbName = path.join(__dirname,"stats.db");
    const BASE_API_URL = "/api/v1";
    const mongo_db_url = process.env.DB_URL;

    //Importamos los schemas de MongoDB
    const user = require('./database/models/user.js');

    mongoose.connect(mongo_db_url, {useNewUrlParser: true});

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("DB connected.");
    });

    app.get(BASE_API_URL+"/stats/loadData", (request, response) =>{

        response.sendStatus(200, "CREATED DATA");
    });



}