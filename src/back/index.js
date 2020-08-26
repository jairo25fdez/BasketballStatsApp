const club_methods = require('./database/API/club_methods.js');
const game_methods = require('./database/API/game_methods.js');

module.exports = function(app){
    
    const mongoose_util = require('./database/mongoose_util.js');

    //Connection to DB.
    mongoose_util.connectDB();

    //Initialize API methods.
    club_methods(app);
    game_methods(app);



}