module.exports = function (app){

    const path = require('path');
    const { isNull } = require('util');
    const mongoose_util = require(path.join(__dirname, '/../mongoose_util.js'));

    const BASE_API_URL = "/api/v1";

    const Player = require(path.join(__dirname, '/../models/player.js'));


    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every Player in DB.
    app.delete(BASE_API_URL+"/players",(request,response) =>{
        Player.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete players.");
            }
            else{
                response.sendStatus(200, "Deleted players.");
            }
        });
    });

    //GET every Player in DB.
    app.get(BASE_API_URL+"/players",(request,response) =>{

        Player.find({}, /*{_id: 0},*/ function (err, clubs){
            if(err){
                console.log("Error while trying to receive the list of players.");
            }
            else{
                response.send(JSON.stringify(clubs,null,2));
            }
        });

    });

    //POST a Player in DB.
    app.post(BASE_API_URL+"/players",(request,response) =>{
        let player_data = request.body;

        console.log(player_data.birth_date);

        let player = new Player({
            name: player_data.name,
            last_name: player_data.last_name,
            birth_date: player_data.birth_date,
            nationality: player_data.nationality,
            birthplace: player_data.birthplace,
            avatar: player_data.avatar,
            email: player_data.email,
            phone: player_data.phone,
            weight: player_data.weight,
            height: player_data.height,
            primary_position: player_data.primary_position,
            secondary_position: player_data.second_position,
            number: player_data.number,
            actual_team: player_data.actual_team,
            former_teams: player_data.former_teams
        });

        
        player.save(function(err,doc){
            //console.log(Player.schema.path('primary_position').enumValues);
            /* If we want to access de error info: console.log(err.errors.primary_position.message); */
 
            if(err){
                console.log("Error while trying to post the player into the database.");
                console.log("Check the following error: "+err);
                
                response.sendStatus(500);
            }
            else{
                response.sendStatus(201, "Created player.");
            }
            
        });
        


    });

    //PUT is not allowed when we are working with collections.
    app.put(BASE_API_URL+"/players",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific player.

    //DELETE a specific player by the ID.
    app.delete(BASE_API_URL+"/players/:player_id",(request,response) =>{
        var player_id = request.params.player_id;

		Player.deleteOne({_id: pplayer_id}, function (err){
            if(err){
                console.log("Error while trying to delete the player with id: "+player_id);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted player with id: "+player_id);
            }
        });
		
        
    });

    //GET a specific player by the ID.
    app.get(BASE_API_URL+"/players/:player_id",(request,response) =>{
        var player_id = request.params.player_id;

        Player.findOne({_id: player_id}, function (err, doc){
            if(isNull(doc)){
                console.log(player_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific player.
    app.post(BASE_API_URL+"/players/:player_id",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific player in the database.
    app.put(BASE_API_URL+"/players/:player_id",(request,response) =>{

        var player_id = request.params.player_id;
        var updatedData = request.body;

        Player.findOne({_id: player_id}, function (err, player){
            if(isNull(player)){
                console.log("The player with id: "+player_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                player.name = updatedData.name;
                player.last_name = updatedData.last_name;
                player.birth_date = updatedData.birth_date;
                player.nationality = updatedData.nationality;
                player.birthplace = updatedData.birthplace;
                player.avatar = updatedData.avatar;
                player.email = updatedData.email;
                player.phone = updatedData.phone;
                player.weight = updatedData.weight;
                player.height = updatedData.height;
                player.primary_position = updatedData.primary_position;
                player.secondary_position = updatedData.secondary_position;
                player.number = updatedData.number;
                player.actual_team = updatedData.actual_team;
                player.former_teams = updatedData.former_teams;

                player.save();

                response.sendStatus(200, "Updated player "+player.name+" "+player.last_name+" with id: "+player.id);
            }
        });

    });

}