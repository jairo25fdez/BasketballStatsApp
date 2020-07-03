const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const mongo_db_url = process.env.DB_URL;

var db;

module.exports = {

    connectDB: function(){
        mongoose.connect(mongo_db_url, {useNewUrlParser: true});

        db = mongoose.connection;
        
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
        console.log("Connected to DB.");
        });
    },

    getDB: function(){
        return db;
    }

};

