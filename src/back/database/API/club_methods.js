const { isNull } = require('util');
const { update } = require('../models/club');

module.exports = function (app){

    const path = require('path');
    const mongoose_util = require(path.join(__dirname, '/../mongoose_util.js'));

    const BASE_API_URL = "/api/v1";

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
                response.sendStatus(200, "Deleted Clubs");
            }
        });
    });

    //GET every Club in DB.
    app.get(BASE_API_URL+"/clubs",(request,response) =>{

        Club.find({}, function (err, docs){
            if(err){
                console.log("Error while trying to receive the list of clubs.");
            }
            else{
                response.send(JSON.stringify(docs,null,2));
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
            teams: club_data.teams,
            phone: club_data.phone,
            email: club_data.email
        });

        club.save(function(err,doc){
            if(err){
                console.log("Error while trying to post the club into the DB.");
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Created club");
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

        Club.findOne({name: club_name, city: club_city}, function (err, doc){
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
                club.teams = updatedData.teams;
                club.name = updatedData.name;
                club.acronym = updatedData.acronym;
                club.country = updatedData.country;
                club.city = updatedData.city;
                club.location = updatedData.location;
                club.stadium = updatedData.stadium;
                club.phone = updatedData.phone;
                club.email = updatedData.email;

                club.save();

                response.sendStatus(200, "Updated club "+club_name);
            }
        });

    });

}