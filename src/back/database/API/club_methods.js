module.exports = function (app){

    const path = require('path');
    const mongoose_util = require(path.join(__dirname, '/../mongoose_util.js'));

    const BASE_API_URL = "/api/v1";

    const Club = require(path.join(__dirname, '/../models/club.js'));

    //Get DB data.
    mongoose_util.getDB();

    //var team = new Team({ coach: data.coach, coach_2: data.coach_2 });

    //Methods to work with the whole collection.

    app.delete(BASE_API_URL+"/clubs",(request,response) =>{

    });

    app.get(BASE_API_URL+"/clubs",(request,response) =>{

    });

    app.post(BASE_API_URL+"/clubs",(request,response) =>{
        let club_data = request.body;

        let club = new Club({
            name: club_data.name,
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

    app.delete(BASE_API_URL+"/clubs/:club_id",(request,response) =>{

    });

    app.get(BASE_API_URL+"/clubs/:club_id",(request,response) =>{

    });

    //POST is not allowed when we are working with a specific club.
    app.post(BASE_API_URL+"/clubs/:club_id",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    app.put(BASE_API_URL+"/clubs/:club_id",(request,response) =>{

    });

}