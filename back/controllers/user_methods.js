module.exports = function (app){

    const path = require('path');
    const { isNull } = require('util');
    const mongoose_util = require(path.join(__dirname, './mongoose_util.js'));

    //URL to Mongoose package.
    const aqp = require('api-query-params');

    const BASE_API_URL = "/api/v1";

    const User = require(path.join(__dirname, '/../models/user.js'));

    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every User in DB.
    app.delete(BASE_API_URL+"/users",(request,response) =>{
        User.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete users.");
            }
            else{
                response.sendStatus(200, "Deleted users.");
            }
        });
    });

    //GET every User in DB.
    app.get(BASE_API_URL+"/users",(request,response) =>{

        const { filter, skip, limit, sort, projection, population } = aqp(request.query);

        User.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, users) => {
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                }
                else{
                    response.send(JSON.stringify(users,null,2));
                }   
            });

    });

    //POST a User in DB.
    app.post(BASE_API_URL+"/users",(request,response) =>{
        let user_data = request.body;

        let user = new User({
            displayName: user_data.displayName,
            avatar: user_data.avatar,
            name: user_data.name,
            last_name: user_data.last_name,
            password: user_data.password,
            email: user_data.email,
            phone: user_data.phone,
            rol: user_data.rol,
            club: user_data.club
        });

        user.save(function(err,doc){
            if(err){
                console.log("Error while trying to post the user into the database.");
                console.log("Check the following error: "+err);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(201, "Created user.");
            }
        });


    });

    //PUT is not allowed when we are working with collections.
    app.put(BASE_API_URL+"/users",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific club.

    //DELETE a specific Club by the ID.
    app.delete(BASE_API_URL+"/users/:user_id",(request,response) =>{
        var user_id = request.params.user_id;

		User.deleteOne({_id: user_id}, function (err){
            if(err){
                console.log("Error while trying to delete the user with id: "+user_id);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted club with id: "+user_id);
            }
        });
		
        
    });

    //GET a specific Club by the ID.
    app.get(BASE_API_URL+"/users/:user_id",(request,response) =>{
        var user_id = request.params.user_id;

        User.findOne({_id: user_id}, function (err, doc){
            if(isNull(doc)){
                console.log("User with id: "+user_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific club.
    app.post(BASE_API_URL+"/users/:user_id",(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific Club in the database.
    app.put(BASE_API_URL+"/users/:user_id",(request,response) =>{

        var user_id = request.params.user_id;
        var updatedData = request.body;

        User.findOne({_id: user_id}, function (err, user){
            if(isNull(club)){
                console.log("User with id: "+user_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                user.displayName = updatedData.displayName,
                user.avatar = updatedData.avatar,
                user.name = updatedData.name,
                user.last_name = updatedData.last_name,
                user.password = updatedData.password,
                user.email = updatedData.email,
                user.phone = updatedData.phone,
                user.rol = updatedData.rol,
                user.club = updatedData.club

                user.save();

                response.sendStatus(200, "Updated user "+user_id);
            }
        });

    });

}