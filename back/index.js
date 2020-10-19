const club_methods = require('./controllers/club_methods.js');
const game_methods = require('./controllers/game_methods.js');
const player_methods = require('./controllers/player_methods.js');
const team_methods = require('./controllers/team_methods.js');
const league_methods = require('./controllers/league_methods.js');
const user_methods = require('./controllers/user_methods.js');
const play_methods = require('./controllers/play_methods.js');
const player_stats_game_methods = require('./controllers/player_stats_game_methods.js');

const image_methods = require('./controllers/image_methods.js');

module.exports = function(app){
    
    const mongoose_util = require('./controllers/mongoose_util.js');

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
    image_methods(app);
    player_stats_game_methods(app);


}