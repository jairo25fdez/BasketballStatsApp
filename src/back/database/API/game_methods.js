module.exports = function (app){

    const path = require('path');
    const mongoose_util = require(path.join(__dirname, '/../mongoose_util.js'));

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

        Game.find({}, /*{_id: 0},*/ function (err, games){
            if(err){
                console.log("Error while trying to receive the list of games.");
            }
            else{
                /* Debo buscar una alternativa a devolver los IDs o hacerlo solo en caso de que sea necesario. */
                response.send(JSON.stringify(games,null,2));
            }
        });

    });

    //POST a Game in DB.
    app.post(BASE_API_URL+"/games",(request,response) =>{
        let game_data = request.body;

        /* Debo comprobar: 
            - Nombre de liga.
            - Nombres de los clubes.
            - Ganador y perdedor.
            - 


        */

        let game = new Game({
            date: game_data.date,
            league: {
                league_name: game_data.league.league_name,
                season: game_data.league.season
            },
            home_team: game_data.home_team,
            visitor_team: game_data.visitor_team,
            home_team_score: game_data.home_team_score,
            visitor_team_score: game_data.visitor_team_score,
            winner_team: game_data.winner_team,
            loser_team: game_data.loser_team,
            minutes_played: game_data.minutes_played,
            overtime: game_data.overtime,
            overtime_count: game_data.overtime_count,
            boxscore: game_data.boxscore,
            play_by_play: game_data.plays
        });

        game.save(function(err,doc){
            if(err){
                console.log("Error while trying to post the game into the database.");
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

}