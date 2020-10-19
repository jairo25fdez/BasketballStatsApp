const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var zone_shotsSchema = new Schema({
    _id: false,
    made: Number,
    attempted: Number
});

var shots_listSchema = new Schema({
    _id: false,
    lc3: zone_shotsSchema,
    le3: zone_shotsSchema,
    c3: zone_shotsSchema,
    re3: zone_shotsSchema,
    rc3: zone_shotsSchema,
    lmc2: zone_shotsSchema,
    lme2: zone_shotsSchema,
    cm2: zone_shotsSchema,
    rme2: zone_shotsSchema,
    rmc2: zone_shotsSchema,
    lp2: zone_shotsSchema,
    rp2: zone_shotsSchema,
    lft2: zone_shotsSchema,
    rft2: zone_shotsSchema
});

var player_stats_gameSchema = new Schema({
    player_id: {type: Schema.Types.ObjectId, ref: 'Player', required: true},
    game_id: {type: Schema.Types.ObjectId, ref: 'Game', required: true},
    team_id: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
    starter: {type: Boolean},
    player_name: String,
    player_lastName: String,
    player_img: String,
    time_played: {
        minutes: Number,
        seconds: Number
    },
    points: {type: Number, min: 0},
    t2_made: {type: Number, min: 0},
    t2_attempted: {type: Number, min: 0},
    t2_percentage: {type: Number, min: 0},
    t3_made: {type: Number, min: 0},
    t3_attempted: {type: Number, min: 0},
    t3_percentage: {type: Number, min: 0},
    t1_made: {type: Number, min: 0},
    t1_attempted: {type: Number, min: 0},
    t1_percentage: {type: Number, min: 0},
    shots_list: shots_listSchema, //We will save the shot locations.
    total_rebounds: {type: Number, min: 0},
    defensive_rebounds: {type: Number, min: 0},
    offensive_rebounds: {type: Number, min: 0},
    assists: {type: Number, min: 0},
    steals: {type: Number, min: 0},
    turnovers: {type: Number, min: 0},
    blocks_made: {type: Number, min: 0},
    blocks_received: {type: Number, min: 0},
    fouls_made: {type: Number, min: 0},
    fouls_received: {type: Number, min: 0},
    usage: {
        personal: Number,
        team: Number,
        percentage: Number
    }
});

player_stats_gameSchema.index( {player_id: 1, game_id: 1}, { unique: true } );

player_stats_gameSchema = mongoose.Schema(player_stats_gameSchema);
player_stats_gameModel = mongoose.model('Player Stats Game', player_stats_gameSchema);

module.exports = {
    Player_stats_gameSchema: player_stats_gameSchema,
    Player_stats_gameModel: player_stats_gameModel
}