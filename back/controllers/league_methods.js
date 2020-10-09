const league = require('../models/league');

module.exports = function (app){

    const path = require('path');
    const { isNull } = require('util');
    const fs = require('fs');
    const mongoose_util = require(path.join(__dirname, './mongoose_util.js'));

    //URL to Mongoose package.
    const aqp = require('api-query-params');

    const BASE_API_URL = "/api/v1";

    /*
    const leagueModule = require(path.join(__dirname, '/../models/league.js'));
    const League = leagueModule.LeagueModel;
    */
   const League = require(path.join(__dirname, '/../models/league.js'));

    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every League in DB.
    app.delete(BASE_API_URL+"/leagues",(request,response) =>{
        League.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete leagues.");
            }
            else{
                response.sendStatus(200, "Deleted leagues.");
            }
        });
    });

    //GET every League in DB.
    app.get(BASE_API_URL+"/leagues",(request,response) =>{

        const { filter, skip, limit, sort, projection, population } = aqp(request.query);

        League.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, leagues) => {
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                }
                else{
                    response.send(JSON.stringify(leagues,null,2));
                }   
            });

    });

    //POST a League in DB.
    app.post(BASE_API_URL+"/leagues",(request,response) =>{
        let league_data = request.body;

        let league = new League({
            name: league_data.name,
            img: league_data.img,
            location: league_data.location,
            quarters_num: league_data.quarters_num,
            quarter_length: league_data.quarter_length,
            overtime_length: league_data.overtime_length,
            shot_clock: league_data.shot_clock,
            max_personal_fouls: league_data.max_personal_fouls,
            max_team_fouls: league_data.max_team_fouls
        });

        league.save(function(err,doc){
            if(err){
                console.log("Error while trying to post the league into the database.");
                console.log("Check the following error: "+err);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(201, "Created league.");
            }
        });


    });

    //PUT is not allowed when we are working with collections.
    app.put(BASE_API_URL+"/leagues",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific club.

    //DELETE a specific Club by the ID.
    app.delete(BASE_API_URL+"/leagues/:league_id",(request,response) =>{
        var league_id = request.params.league_id;

		League.deleteOne({_id: league_id}, function (err){
            if(err){
                console.log("Error while trying to delete the league with id: "+league_id);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted club with id: "+league_id);
            }
        });
		
        
    });

    //GET a specific League by the ID.
    app.get(BASE_API_URL+"/leagues/:league_id",(request,response) =>{
        var league_id = request.params.league_id;

        League.findOne({_id: league_id}, function (err, doc){
            if(isNull(doc)){
                console.log("League with id: "+league_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific league.
    app.post(BASE_API_URL+"/leagues/:league_id",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC LEAGUE.")
    });

    //PUT a specific League in the database.
    app.put(BASE_API_URL+"/leagues/:league_id",(request,response) =>{

        var league_id = request.params.league_id;
        var updatedData = request.body;

        League.findOne({_id: league_id}, function (err, league){
            if(isNull(league)){
                console.log("League with id: "+league_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                league.name = updatedData.name,
                league.img = updatedData.img,
                league.location = updatedData.location,
                league.quarters_num = updatedData.quarters_num,
                league.quarter_length = updatedData.quarter_length,
                league.overtime_length = updatedData.overtime_length,
                league.shot_clock = updatedData.shot_clock,
                league.max_personal_fouls = updatedData.max_personal_fouls,
                league.max_team_fouls = updatedData.max_team_fouls

                league.save();

                response.sendStatus(200, "Updated league "+league_id);
            }
        });

    });

}