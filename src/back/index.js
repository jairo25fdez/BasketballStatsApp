const club_methods = require('./database/API/club_methods.js');
const game_methods = require('./database/API/game_methods.js');
const player_methods = require('./database/API/player_methods.js');
const team_methods = require('./database/API/team_methods.js');
const league_methods = require('./database/API/league_methods.js');
const user_methods = require('./database/API/user_methods.js');
const play_methods = require('./database/API/play_methods.js');

module.exports = function(app){
    
    const mongoose_util = require('./database/mongoose_util.js');

    //Connection to DB.
    mongoose_util.connectDB();

    //Initialize API methods.
    club_methods(app);
    game_methods(app);
    player_methods(app);
    team_methods(app);
    league_methods(app);
    user_methods(app);
    play_methods(app);


}