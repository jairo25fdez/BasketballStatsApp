module.exports = function(app){

    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    
    const assert = require('assert');
    const path = require('path');
    require('dotenv').config({path: 'variables.env'});

    const BASE_API_URL = "/api/v1";
    const mongo_db_url = process.env.DB_URL;

    //Importamos los schemas de MongoDB
    var userSchema = require('./database/models/user.js');

    var teamSchema = new Schema({
        club: {type: Schema.Types.ObjectId, ref: 'Club'},
        season: Date,
        coach: String,
        coach_2: String,
        roster: [{id: {type: Schema.Types.ObjectId, ref: 'Player'}}]
    });
    var Team = mongoose.model("Team", teamSchema);

    mongoose.connect(mongo_db_url, {useNewUrlParser: true});

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("Connected DB.");
    });


    //Comienzan los métodos de la API.
    app.post(BASE_API_URL+"/team", (request, response) =>{
        var data = request.body;

        
        var team = new Team({ coach: data.coach, coach_2: data.coach_2 });

        team.save(function(err, doc) {
            if (err){
                return console.error(err);
            } 
            response.sendStatus(200, "CREATED DATA");
          });
        
    });



}