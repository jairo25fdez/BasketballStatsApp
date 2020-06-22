module.exports = function(app){

    const mongoose = require('mongoose');
    
    const assert = require('assert');
    const path = require('path');
    require('dotenv').config({path: 'variables.env'});

    const BASE_API_URL = "/api/v1";
    const mongo_db_url = process.env.DB_URL;

    //Importamos los schemas de MongoDB
    var userSchema = require('./database/models/user.js');

    var Team = require('./database/models/team.js');

    mongoose.connect(mongo_db_url, {useNewUrlParser: true});

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("Connected DB.");
    });


    //Comienzan los métodos de la API.

    //POST al conjunto de Teams.
    app.post(BASE_API_URL+"/team", (request, response) =>{
        var data = request.body;

        var team = new Team({ coach: data.coach, coach_2: data.coach_2 });

        team.save(function(err, doc) {
            if (err){
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "CREATED DATA");
            } 
            
          });
        
    });



}