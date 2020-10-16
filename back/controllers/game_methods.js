module.exports = function (app){

    const path = require('path');
    const { isNull } = require('util');
    const mongoose_util = require(path.join(__dirname, './mongoose_util.js'));

    //URL to Mongoose package.
    const aqp = require('api-query-params');

    const BASE_API_URL = "/api/v1";

    const Game = require(path.join(__dirname, '/../models/game.js'));

    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every Game in DB.
    app.delete(BASE_API_URL+"/games",(request,response) =>{
        Game.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete games.");
            }
            else{
                response.sendStatus(200, "Deleted Games.");
            }
        });
    });

    //GET every Game in DB.
    app.get(BASE_API_URL+"/games",(request,response) =>{

        const { filter, skip, limit, sort, projection, population } = aqp(request.query);

        Game.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, games) => {
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                }
                else{
                    response.send(JSON.stringify(games,null,2));
                }   
            });

    });

    //POST a Game in DB.
    app.post(BASE_API_URL+"/games",(request,response) =>{
        let game_data = request.body;

        let game = new Game({
            date: game_data.date,
            season: game_data.season,
            league: game_data.league,
            home_team: game_data.home_team,
            visitor_team: game_data.visitor_team,
            home_team_score: game_data.home_team_score,
            visitor_team_score: game_data.visitor_team_score,
            winner_team: game_data.winner_team,
            loser_team: game_data.loser_team,
            minutes_played: game_data.minutes_played,
            overtime: game_data.overtime,
            overtime_count: game_data.overtime_count,
            stats: game_data.stats,
            play_by_play: game_data.plays
        });

        game.save(function(err,doc){
            if(err){
                console.log("Error while trying to post the game into the database.");
                console.log(err);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(201, "Created game.");
            }
        });


    });

    //PUT is not allowed when we are working with collections.
    app.put(BASE_API_URL+"/games",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });

    //Methods to work with a specific game.

    //DELETE a specific Game by the ID.
    app.delete(BASE_API_URL+"/games/:game_id",(request,response) =>{
        var game_id = request.params.game_id;

		Game.deleteOne({_id: game_id}, function (err){
            if(err){
                console.log("Error while trying to delete the game with id: "+game_id);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted game with id: "+game_id);
            }
        });
		
        
    });

    //GET a specific Game by the ID.
    app.get(BASE_API_URL+"/games/:game_id",(request,response) =>{
        var game_id = request.params.game_id;

        Game.findOne({_id: game_id}, function (err, doc){
            if(isNull(doc)){
                console.log("Game with id: "+game_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific game.
    app.post(BASE_API_URL+"/games/:game_id",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific Game in the database.
    app.put(BASE_API_URL+"/games/:game_id",(request,response) =>{

        var game_id = request.params.game_id;
        var updatedData = request.body;

        Game.findOne({_id: game_id}, function (err, game){
            if(isNull(game)){
                console.log("Game with id: "+game_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                game.date = updatedData.date,
                game.season = updatedData.season,
                game.league = updatedData.league,
                game.home_team = updatedData.home_team,
                game.visitor_team = updatedData.visitor_team,
                game.home_team_score = updatedData.home_team_score,
                game.visitor_team_score = updatedData.visitor_team_score,
                game.winner_team = updatedData.winner_team,
                game.loser_team = updatedData.loser_team,
                game.minutes_played = updatedData.minutes_played,
                game.overtime = updatedData.overtime,
                game.overtime_count = updatedData.overtime_count,
                game.stats = updatedData.stats,
                game.play_by_play = updatedData.plays

                game.save();

                response.sendStatus(200, "Updated game "+game_id);
            }
        });

    });

}