module.exports = function (app){

    const path = require('path');
    const mongoose_util = require(path.join(__dirname, './mongoose_util.js'));

    //URL to Mongoose package.
    const aqp = require('api-query-params');

    const BASE_API_URL = "/api/v1";

    const Player_stats_gameModule = require(path.join(__dirname, '/../models/player_stats_game.js'));
    const Player_stats_game = Player_stats_gameModule.Player_stats_gameModel;

    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every Player_stats_game in DB.
    app.delete(BASE_API_URL+"/player_stats_game",(request,response) =>{
        Player_stats_game.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete players stats.");
            }
            else{
                response.sendStatus(200, "Deleted players stats.");
            }
        });
    });

    //GET every Player_stats_game in DB.
    app.get(BASE_API_URL+"/player_stats_game",(request,response) =>{

        const { filter, skip, limit, sort, projection, population } = aqp(request.query);

        Player_stats_game.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, player_stats_game) => {
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                }
                else{
                    response.send(JSON.stringify(player_stats_game,null,2));
                }   
            });

    });

    //POST a Player_stats_game in DB.
    app.post(BASE_API_URL+"/player_stats_game",(request,response) =>{
        let player_stats_data = request.body;

        let player_stats = new Player_stats_game({
            player_id: player_stats_data.player_id,
            game_id: player_stats_data.game_id,
            team_id: player_stats_data.team_id,
            starter: player_stats_data.starter,
            player_name: player_stats_data.player_name,
            player_lastName: player_stats_data.player_lastName,
            player_img: player_stats_data.player_img,
            time_played: player_stats_data.time_played,
            points: player_stats_data.points,
            t2_made: player_stats_data.t2_made,
            t2_attempted: player_stats_data.t2_attempted,
            t2_percentage: player_stats_data.t2_percentage,
            t3_made: player_stats_data.t3_made,
            t3_attempted: player_stats_data.t3_attempted,
            t3_percentage: player_stats_data.t3_percentage,
            t1_made: player_stats_data.t1_made,
            t1_attempted: player_stats_data.t1_attempted,
            t1_percentage: player_stats_data.t1_percentage,
            shots_list: player_stats_data.shots_list, //We will save the shot locations.
            total_rebounds: player_stats_data.total_rebounds,
            defensive_rebounds: player_stats_data.defensive_rebounds,
            offensive_rebounds: player_stats_data.offensive_rebounds,
            assists: player_stats_data.assists,
            steals: player_stats_data.steals,
            turnovers: player_stats_data.turnovers,
            blocks_made: player_stats_data.blocks_made,
            blocks_received: player_stats_data.blocks_received,
            fouls_made: player_stats_data.fouls_made,
            fouls_received: player_stats_data.fouls_received,
            usage: player_stats_data.usage
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
    app.put(BASE_API_URL+"/player_stats_game",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific player_stats_data.

    //DELETE a specific Club by the ID.
    app.delete(BASE_API_URL+"/player_stats_game/:player_stats_id",(request,response) =>{
        var player_stats_id = request.params.player_stats_id;

		Player_stats_game.deleteOne({_id: player_stats_id}, function (err){
            if(err){
                console.log("Error while trying to delete the player stats with id: "+player_stats_id);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted player stats with id: "+player_stats_id);
            }
        });
		
        
    });

    //GET a specific Club by the ID.
    app.get(BASE_API_URL+"/player_stats_game/:player_stats_id",(request,response) =>{
        var player_stats_id = request.params.player_stats_id;

        Player_stats_game.findOne({_id: player_stats_id}, function (err, doc){
            if(isNull(doc)){
                console.log("Player_stats_game with id: "+player_stats_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific player_stats_data.
    app.post(BASE_API_URL+"/player_stats_game/:play_id",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific Club in the database.
    app.put(BASE_API_URL+"/player_stats_game/:player_stats_id",(request,response) =>{

        var player_stats_id = request.params.player_stats_id;
        var updatedData = request.body;

        Player_stats_game.findOne({_id: player_Stats_id}, function (err, play){
            if(isNull(play)){
                console.log("Player_stats_game with id: "+player_stats_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                player_stats_data.player_id = updatedData.player_id,
                player_stats_data.game_id = updatedData.game_id,
                player_stats_data.team_id = updatedData.team_id,
                player_stats_data.starter = updatedData.starter,
                player_stats_data.player_name = updatedData.player_name,
                player_stats_data.player_lastName = updatedData.player_lastName,
                player_stats_data.player_img = updatedData.player_img,
                player_stats_data.time_played = updatedData.time_played,
                player_stats_data.points = updatedData.points,
                player_stats_data.t2_made = updatedData.t2_made,
                player_stats_data.t2_attempted = updatedData.t2_attempted,
                player_stats_data.t2_percentage = updatedData.t2_percentage,
                player_stats_data.t3_made = updatedData.t3_made,
                player_stats_data.t3_attempted = updatedData.t3_attempted,
                player_stats_data.t3_percentage = updatedData.t3_percentage,
                player_stats_data.t1_made = updatedData.t1_made,
                player_stats_data.t1_attempted = updatedData.t1_attempted,
                player_stats_data.t1_percentage = updatedData.t1_percentage,
                player_stats_data.shots_list = updatedData.shots_list, //We will save the shot locations.
                player_stats_data.total_rebounds = updatedData.total_rebounds,
                player_stats_data.defensive_rebounds = updatedData.defensive_rebounds,
                player_stats_data.offensive_rebounds = updatedData.offensive_rebounds,
                player_stats_data.assists = updatedData.assists,
                player_stats_data.steals = updatedData.steals,
                player_stats_data.turnovers = updatedData.turnovers,
                player_stats_data.blocks_made = updatedData.blocks_made,
                player_stats_data.blocks_received = updatedData.blocks_received,
                player_stats_data.fouls_made = updatedData.fouls_made,
                player_stats_data.fouls_received = updatedData.fouls_received,
                player_stats_data.usage = updatedData.usage

                player_stats_data.save();

                response.sendStatus(200, "Updated play "+play_id);
            }
        });

    });

}