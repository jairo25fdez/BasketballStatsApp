module.exports = function (app){

    const path = require('path');
    const { isNull } = require('util');
    const mongoose_util = require(path.join(__dirname, '/../mongoose_util.js'));

    const BASE_API_URL = "/api/v1";

    /*
    const ClubModule = require(path.join(__dirname, '/../models/club.js'));
    const Club = ClubModule.ClubModel;
    */
   const Club = require(path.join(__dirname, '/../models/club.js'));

    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every Club in DB.
    app.delete(BASE_API_URL+"/clubs",(request,response) =>{
        Club.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete clubs.");
            }
            else{
                response.sendStatus(200, "Deleted clubs.");
            }
        });
    });

    //GET every Club in DB.
    app.get(BASE_API_URL+"/clubs",(request,response) =>{

        Club.find({}, /*{_id: 0},*/ function (err, clubs){
            if(err){
                console.log("Error while trying to receive the list of clubs.");
            }
            else{
                response.send(JSON.stringify(clubs,null,2));
            }
        });

    });

    //POST a Club in DB.
    app.post(BASE_API_URL+"/clubs",(request,response) =>{
        let club_data = request.body;

        let club = new Club({
            name: club_data.name,
            acronym: club_data.acronym,
            country: club_data.country,
            city: club_data.city,
            location: club_data.location,
            stadium: club_data.stadium,
            active_teams: club_data.active_teams,
            former_teams: club_data.former_teams,
            phone: club_data.phone,
            email: club_data.email
        });

        club.save(function(err,doc){
            if(err){
                console.log("Error while trying to post the club into the database.");
                console.log("Check the following error: "+err);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(201, "Created club");
            }
        });


    });

    //PUT is not allowed when we are working with collections.
    app.put(BASE_API_URL+"/clubs",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific club.

    //DELETE a specific Club by the ID.
    app.delete(BASE_API_URL+"/clubs/:club_id",(request,response) =>{
        var club_id = request.params.club_id;

		Club.deleteOne({_id: club_id}, function (err){
            if(err){
                console.log("Error while trying to delete the club with id: "+club_id);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted club with id: "+club_id);
            }
        });
		
        
    });

    //GET a specific Club by the ID.
    app.get(BASE_API_URL+"/clubs/:club_id",(request,response) =>{
        var club_id = request.params.club_id;

        Club.findOne({_id: club_id}, function (err, doc){
            if(isNull(doc)){
                console.log("Club with id: "+club_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific club.
    app.post(BASE_API_URL+"/clubs/:club_id",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific Club in the database.
    app.put(BASE_API_URL+"/clubs/:club_id",(request,response) =>{

        var club_id = request.params.club_id;
        var updatedData = request.body;

        Club.findOne({_id: club_id}, function (err, club){
            if(isNull(club)){
                console.log("Club with id: "+club_id+" doesn't exists in the database.");
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

                response.sendStatus(200, "Updated club "+club_id);
            }
        });

    });

}