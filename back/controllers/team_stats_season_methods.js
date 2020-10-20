module.exports = function (app){

    const path = require('path');
    const mongoose_util = require(path.join(__dirname, './mongoose_util.js'));

    //URL to Mongoose package.
    const aqp = require('api-query-params');

    const BASE_API_URL = "/api/v1";

    const Team_stats_seasonModule = require(path.join(__dirname, '/../models/team_stats_season.js'));
    const Team_stats_season = Team_stats_seasonModule.Team_stats_seasonModel;

    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every Team_stats_season in DB.
    app.delete(BASE_API_URL+"/team_stats_season",(request,response) =>{
        Team_stats_season.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete teams stats.");
            }
            else{
                response.sendStatus(200, "Deleted teams stats.");
            }
        });
    });

    //GET every Team_stats_season in DB.
    app.get(BASE_API_URL+"/team_stats_season",(request,response) =>{

        const { filter, skip, limit, sort, projection, population } = aqp(request.query);

        Team_stats_season.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, team_stats_season) => {
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                }
                else{
                    response.send(JSON.stringify(team_stats_season,null,2));
                }   
            });

    });

    //POST a Team_stats_season in DB.
    app.post(BASE_API_URL+"/team_stats_season",(request,response) =>{
        let team_stats_data = request.body;

        let team_stats = new Team_stats_season({

            team_id: team_stats_data.team_id,
            season: team_stats_data.season,
            team_name: team_stats_data.team_name,
            time_played: team_stats_data.time_played,
            games_played: team_stats_data.games_played,
            wins: team_stats_data.wins,
            losses: team_stats_data.losses,
            points_stats: team_stats_data.points_stats,
            shots_stats: team_stats_data.shots_stats,
            assists_stats: team_stats_data.assists_stats,
            steals_stats: team_stats_data.steals_stats,
            lost_balls_stats: team_stats_data.lost_balls_stats,
            rebounds_stats: team_stats_data.rebounds_stats,
            blocks_stats: team_stats_data.blocks_stats,
            usage: team_stats_data.usage,
            fouls_stats: team_stats_data.fouls_stats

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
    app.put(BASE_API_URL+"/team_stats_season",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific team_stats_data.

    //DELETE a specific stats by the ID.
    app.delete(BASE_API_URL+"/team_stats_season/:team_stats_id",(request,response) =>{
        var team_stats_id = request.params.team_stats_id;

		Team_stats_season.deleteOne({_id: team_stats_id}, function (err){
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
    app.get(BASE_API_URL+"/team_stats_season/:team_stats_id",(request,response) =>{
        var team_stats_id = request.params.team_stats_id;

        Team_stats_season.findOne({_id: team_stats_id}, function (err, doc){
            if(isNull(doc)){
                console.log("Team_stats_season with id: "+team_stats_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific team_stats_data.
    app.post(BASE_API_URL+"/team_stats_season/:play_id",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific stats in the database.
    app.put(BASE_API_URL+"/team_stats_season/:team_stats_id",(request,response) =>{

        var team_stats_id = request.params.team_stats_id;
        var updatedData = request.body;

        Team_stats_season.findOne({_id: team_Stats_id}, function (err, play){
            if(isNull(play)){
                console.log("Team_stats_season with id: "+team_stats_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                team_id = updatedData.team_id,
                season = updatedData.season,
                team_name = updatedData.team_name,
                time_played = updatedData.time_played,
                games_played = updatedData.games_played,
                wins = updatedData.wins,
                losses = updatedData.losses,
                points_stats = updatedData.points_stats,
                shots_stats = updatedData.shots_stats,
                assists_stats = updatedData.assists_stats,
                steals_stats = updatedData.steals_stats,
                lost_balls_stats = updatedData.lost_balls_stats,
                rebounds_stats = updatedData.rebounds_stats,
                blocks_stats = updatedData.blocks_stats,
                possessions = updatedData.possessions,
                fouls_stats = updatedData.fouls_stats

                team_stats_data.save();

                response.sendStatus(200, "Updated stats "+team_Stats_id);
            }
        });

    });

}