module.exports = function (app){

    const path = require('path');
    const { isNull } = require('util');
    const mongoose_util = require(path.join(__dirname, './mongoose_util.js'));

    //URL to Mongoose package.
    const aqp = require('api-query-params');

    const BASE_API_URL = "/api/v1";

    const Team_stats_gameModule = require(path.join(__dirname, '/../models/team_stats_game.js'));
    const Team_stats_game = Team_stats_gameModule.Team_stats_gameModel;

    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every Team_stats_game in DB.
    app.delete(BASE_API_URL+"/team_stats_game",(request,response) =>{
        Team_stats_game.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete teams stats.");
            }
            else{
                response.sendStatus(200, "Deleted teams stats.");
            }
        });
    });

    //GET every Team_stats_game in DB.
    app.get(BASE_API_URL+"/team_stats_game",(request,response) =>{

        const { filter, skip, limit, sort, projection, population } = aqp(request.query);

        Team_stats_game.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, team_stats_game) => {
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                }
                else{
                    response.send(JSON.stringify(team_stats_game,null,2));
                }   
            });

    });

    //POST a Team_stats_game in DB.
    app.post(BASE_API_URL+"/team_stats_game",(request,response) =>{
        let team_stats_data = request.body;

        let team_stats = new Team_stats_game({

            team_id: team_stats_data.team_id,
            team_name: team_stats_data.team_name,
            game_id: team_stats_data.game_id,
            season: team_stats_data.season,
            time_played: team_stats_data.time_played,
            points: team_stats_data.points,
            t2_made: team_stats_data.t2_made,
            t2_attempted: team_stats_data.t2_attempted,
            t2_percentage: team_stats_data.t2_percentage,
            t3_made: team_stats_data.t3_made,
            t3_attempted: team_stats_data.t3_attempted,
            t3_percentage: team_stats_data.t3_percentage,
            t1_made: team_stats_data.t1_made,
            t1_attempted: team_stats_data.t1_attempted,
            t1_percentage: team_stats_data.t1_percentage,
            shots_list: team_stats_data.shots_listSchema,
            total_rebounds: team_stats_data.total_rebounds,
            defensive_rebounds: team_stats_data.defensive_rebounds,
            offensive_rebounds: team_stats_data.offensive_rebounds,
            assists: team_stats_data.assists,
            steals: team_stats_data.steals,
            turnovers: team_stats_data.turnovers,
            blocks_made: team_stats_data.blocks_made,
            blocks_received: team_stats_data.blocks_received,
            fouls_made: team_stats_data.fouls_made,
            fouls_received: team_stats_data.fouls_received,
            possessions: team_stats_data.possessions

        });

        team_stats.save(function(err,doc){
            if(err){
                console.log("Error while trying to post the team stats into the database.");
                console.log("Check the following error: "+err);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(201, "Created team stats.");
            }
        });


    });

    //PUT is not allowed when we are working with collections.
    app.put(BASE_API_URL+"/team_stats_game",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific team_stats_data.

    //DELETE a specific stats by the ID.
    app.delete(BASE_API_URL+"/team_stats_game/:team_stats_id",(request,response) =>{
        var team_stats_id = request.params.team_stats_id;

		Team_stats_game.deleteOne({_id: team_stats_id}, function (err){
            if(err){
                console.log("Error while trying to delete the team stats with id: "+team_stats_id);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted team stats with id: "+team_stats_id);
            }
        });
		
        
    });

    //GET a specific stats by the ID.
    app.get(BASE_API_URL+"/team_stats_game/:team_stats_id",(request,response) =>{
        var team_stats_id = request.params.team_stats_id;

        Team_stats_game.findOne({_id: team_stats_id}, function (err, doc){
            if(isNull(doc)){
                console.log("Team_stats_game with id: "+team_stats_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific team_stats_data.
    app.post(BASE_API_URL+"/team_stats_game/:play_id",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific stats in the database.
    app.put(BASE_API_URL+"/team_stats_game/:team_stats_id",(request,response) =>{

        var team_stats_id = request.params.team_stats_id;
        var updatedData = request.body;

        Team_stats_game.findOne({_id: team_stats_id}, function (err, team_stats_data){
            if(isNull(team_stats_data)){
                console.log("Team_stats_game with id: "+team_stats_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                team_stats_data.team_id = updatedData.team_id,
                team_stats_data.team_name = updatedData.team_name,
                team_stats_data.game_id = updatedData.game_id,
                team_stats_data.season = updatedData.season,
                team_stats_data.time_played = updatedData.time_played,
                team_stats_data.points = updatedData.points,
                team_stats_data.t2_made = updatedData.t2_made,
                team_stats_data.t2_attempted = updatedData.t2_attempted,
                team_stats_data.t2_percentage = updatedData.t2_percentage,
                team_stats_data.t3_made = updatedData.t3_made,
                team_stats_data.t3_attempted = updatedData.t3_attempted,
                team_stats_data.t3_percentage = updatedData.t3_percentage,
                team_stats_data.t1_made = updatedData.t1_made,
                team_stats_data.t1_attempted = updatedData.t1_attempted,
                team_stats_data.t1_percentage = updatedData.t1_percentage,
                team_stats_data.shots_list = updatedData.shots_listSchema,
                team_stats_data.total_rebounds = updatedData.total_rebounds,
                team_stats_data.defensive_rebounds = updatedData.defensive_rebounds,
                team_stats_data.offensive_rebounds = updatedData.offensive_rebounds,
                team_stats_data.assists = updatedData.assists,
                team_stats_data.steals = updatedData.steals,
                team_stats_data.turnovers = updatedData.turnovers,
                team_stats_data.blocks_made = updatedData.blocks_made,
                team_stats_data.blocks_received = updatedData.blocks_received,
                team_stats_data.fouls_made = updatedData.fouls_made,
                team_stats_data.fouls_received = updatedData.fouls_received,
                team_stats_data.possessions = updatedData.possessions

                team_stats_data.save();

                response.sendStatus(200, "Updated stats "+team_stats_id);
            }
        });

    });

}