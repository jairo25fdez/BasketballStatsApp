module.exports = function (app){

    const path = require('path');
    const { isNull } = require('util');
    const mongoose_util = require(path.join(__dirname, './mongoose_util.js'));

    const BASE_API_URL = "/api/v1";

    /*
    const teamModule = require(path.join(__dirname, '/../models/team.js'));
    const Team = teamModule.TeamModel;
    */
   const Team = require(path.join(__dirname, '/../models/team.js'));

    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every Team in DB.
    app.delete(BASE_API_URL+"/teams",(request,response) =>{
        Team.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete teams.");
            }
            else{
                response.sendStatus(200, "Deleted teams.");
            }
        });
    });

    //GET every Team in DB.
    app.get(BASE_API_URL+"/teams",(request,response) =>{

        Team.find({}, /*{_id: 0},*/ function (err, teams){
            if(err){
                console.log("Error while trying to receive the list of teams.");
            }
            else{
                response.send(JSON.stringify(teams,null,2));
            }
        });

    });

    //POST a Team in DB.
    app.post(BASE_API_URL+"/teams",(request,response) =>{
        let team_data = request.body;

        let team = new Team({
            club: team_data.club,
            league: team_data.league,
            season: team_data.season,
            coach: team_data.coach,
            coaching_staff: team_data.coaching_staff,
            roster: team_data.roster,
            games_played: team_data.games_played
        });

        team.save(function(err,doc){
            if(err){
                console.log("Error while trying to post the team into the database.");
                console.log("Check the following error: "+err);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(201, "Created team.");
            }
        });


    });

    //PUT is not allowed when we are working with collections.
    app.put(BASE_API_URL+"/teams",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific club.

    //DELETE a specific Club by the ID.
    app.delete(BASE_API_URL+"/teams/:team_id",(request,response) =>{
        var team_id = request.params.team_id;

		Team.deleteOne({_id: team_id}, function (err){
            if(err){
                console.log("Error while trying to delete the team with id: "+team_id);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted club with id: "+team_id);
            }
        });
		
        
    });

    //GET a specific Club by the ID.
    app.get(BASE_API_URL+"/teams/:team_id",(request,response) =>{
        var team_id = request.params.team_id;

        Team.findOne({_id: team_id}, function (err, doc){
            if(isNull(doc)){
                console.log("Team with id: "+team_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific club.
    app.post(BASE_API_URL+"/teams/:team_id",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific Club in the database.
    app.put(BASE_API_URL+"/teams/:team_id",(request,response) =>{

        var team_id = request.params.team_id;
        var updatedData = request.body;

        Team.findOne({_id: team_id}, function (err, team){
            if(isNull(club)){
                console.log("Team with id: "+team_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                team.club = updatedData.club,
                team.league = updatedData.league,
                team.season = updatedData.season,
                team.coach = updatedData.coach,
                team.coaching_staff = updatedData.coaching_staff,
                team.roster = updatedData.roster,
                team.games_played = updatedData.games_played

                team.save();

                response.sendStatus(200, "Updated team "+team_id);
            }
        });

    });

}