module.exports = function (app){

    var assert = require('assert');
    const path = require('path');
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

        let player = new Player({
            name: player_data.name,
            last_name: player_data.last_name,
            birth: player_data.birth,
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
 
            if(err){
                console.log("Error while trying to post the player into the database.");
                console.log("Check the following error: "+err);
                //console.log(err.errors.primary_position.message);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(201, "Created player.");
            }
            
        });
        


    });

    //PUT is not allowed when we are working with collections.
    app.put(BASE_API_URL+"/clubs",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific club.

    //DELETE a specific Club by the name.
    app.delete(BASE_API_URL+"/clubs/:club_name",(request,response) =>{
        var club_name = request.params.club_name;

		Club.deleteOne({name: club_name}, function (err){
            if(err){
                console.log("Error while trying to delete "+club_name);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted "+club_name+" Club.");
            }
        });
		
        
    });

    //GET a specific Club by the name and city.
    app.get(BASE_API_URL+"/clubs/:club_name/:club_city",(request,response) =>{
        var club_name = request.params.club_name;
        var club_city = request.params.club_city;

        Club.findOne({name: club_name, city: club_city}, {_id: 0}, function (err, doc){
            if(isNull(doc)){
                console.log(club_name+" from "+club_city+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific club.
    app.post(BASE_API_URL+"/clubs/:club_name/:club_city",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific Club in the database.
    app.put(BASE_API_URL+"/clubs/:club_name/:club_city",(request,response) =>{

        var club_name = request.params.club_name;
        var club_city = request.params.club_city;
        var updatedData = request.body;

        Club.findOne({name: club_name, city: club_city}, function (err, club){
            if(isNull(club)){
                console.log(club_name+" from "+club_city+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                
                club.name = updatedData.name;
                club.acronym = updatedData.acronym;
                club.country = updatedData.country;
                club.city = updatedData.city;
                club.location = updatedData.location;
                club.stadium = updatedData.stadium;
                club.active_teams = updatedData.active_teams;
                club.former_teams = updatedData.former_teams;
                club.phone = updatedData.phone;
                club.email = updatedData.email;

                club.save();

                response.sendStatus(200, "Updated club "+club_name);
            }
        });

    });

}