module.exports = function (app){

    const path = require('path');
    const { isNull } = require('util');
    const mongoose_util = require(path.join(__dirname, './mongoose_util.js'));
    const { checkToken } = require('../middlewares/authentication');


    //URL to Mongoose package.
    const aqp = require('api-query-params');

    const BASE_API_URL = "/api/v1";

    const Player_stats_seasonModule = require(path.join(__dirname, '/../models/player_stats_season.js'));
    const Player_stats_season = Player_stats_seasonModule.Player_stats_seasonModel;

    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every Player_stats_season in DB.
    app.delete(BASE_API_URL+"/player_stats_season", checkToken ,(request,response) =>{
        Player_stats_season.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete players stats.");
            }
            else{
                response.sendStatus(200, "Deleted players stats.");
            }
        });
    });

    //GET every Player_stats_season in DB.
    app.get(BASE_API_URL+"/player_stats_season", checkToken ,(request,response) =>{

        const { filter, skip, limit, sort, projection, population } = aqp(request.query);

        Player_stats_season.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, player_stats_season) => {
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                }
                else{
                    response.send(JSON.stringify(player_stats_season,null,2));
                }   
            });

    });

    //POST a Player_stats_season in DB.
    app.post(BASE_API_URL+"/player_stats_season", checkToken ,(request,response) =>{
        let player_stats_data = request.body;

        let player_stats = new Player_stats_season({

            player_id: player_stats_data.player_id,
            team_id: player_stats_data.team_id,
            league_id: player_stats_data.league_id,
            season: player_stats_data.season,
            player_name: player_stats_data.player_name,
            player_lastName: player_stats_data.player_lastName,
            player_img: player_stats_data.player_img,
            time_played: player_stats_data.time_played,
            games_played: player_stats_data.games_played,
            points_stats: player_stats_data.points_stats,
            shots_stats: player_stats_data.shots_stats,
            assists_stats: player_stats_data.assists_stats,
            steals_stats: player_stats_data.steals_stats,
            lost_balls_stats: player_stats_data.lost_balls_stats,
            rebounds_stats: player_stats_data.rebounds_stats,
            blocks_stats: player_stats_data.blocks_stats,
            usage: player_stats_data.usage,
            fouls_stats: player_stats_data.fouls_stats

        });

        player_stats.save(function(err,doc){
            if(err){
                console.log("Error while trying to post the player stats into the database.");
                console.log("Check the following error: "+err);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(201, "Created player stats.");
            }
        });


    });

    //PUT is not allowed when we are working with collections.
    app.put(BASE_API_URL+"/player_stats_season", checkToken ,(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific player_stats_data.

    //DELETE a specific stats by the ID.
    app.delete(BASE_API_URL+"/player_stats_season/:player_stats_id", checkToken ,(request,response) =>{
        var player_stats_id = request.params.player_stats_id;

		Player_stats_season.deleteOne({_id: player_stats_id}, function (err){
            if(err){
                console.log("Error while trying to delete the player stats with id: "+player_stats_id);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted player stats with id: "+player_stats_id);
            }
        });
		
        
    });

    //GET a specific stats by the ID.
    app.get(BASE_API_URL+"/player_stats_season/:player_stats_id", checkToken ,(request,response) =>{
        var player_stats_id = request.params.player_stats_id;

        Player_stats_season.findOne({_id: player_stats_id}, function (err, doc){
            if(isNull(doc)){
                console.log("Player_stats_season with id: "+player_stats_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific player_stats_data.
    app.post(BASE_API_URL+"/player_stats_season/:play_id", checkToken ,(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific stats in the database.
    app.put(BASE_API_URL+"/player_stats_season/:player_stats_id", checkToken ,(request,response) =>{

        var player_stats_id = request.params.player_stats_id;
        var updatedData = request.body;

        Player_stats_season.findOne({_id: player_stats_id}, function (err, player_stats_data){
            if(isNull(player_stats_data)){
                console.log("Player_stats_season with id: "+player_stats_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                player_stats_data.player_id = updatedData.player_id,
                player_stats_data.team_id = updatedData.team_id,
                player_stats_data.league_id = updatedData.league_id,
                player_stats_data.season = updatedData.season,
                player_stats_data.player_name = updatedData.player_name,
                player_stats_data.player_lastName = updatedData.player_lastName,
                player_stats_data.player_img = updatedData.player_img,
                player_stats_data.time_played = updatedData.time_played,
                player_stats_data.games_played = updatedData.games_played,
                player_stats_data.points_stats = updatedData.points_stats,
                player_stats_data.shots_stats = updatedData.shots_stats,
                player_stats_data.assists_stats = updatedData.assists_stats,
                player_stats_data.steals_stats = updatedData.steals_stats,
                player_stats_data.lost_balls_stats = updatedData.lost_balls_stats,
                player_stats_data.rebounds_stats = updatedData.rebounds_stats,
                player_stats_data.blocks_stats = updatedData.blocks_stats,
                player_stats_data.usage = updatedData.usage,
                player_stats_data.fouls_stats = updatedData.fouls_stats

                player_stats_data.save();

                response.sendStatus(200, "Updated stats "+player_stats_data._id);
            }
        });

    });

}