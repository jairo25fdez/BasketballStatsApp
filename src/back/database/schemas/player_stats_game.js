const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var zone_shotsSchema = new Schema({
    made: Number,
    attempted: Number
});

var shots_listSchema = new Schema({
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
    cp2: zone_shotsSchema,
    rp2: zone_shotsSchema
});

var player_stats_gameSchema = new Schema({
    player_name: String,
    player_lastName: String,
    minutes_played: Date, //We will use HH:mm.
    points: {type: Number, min: 0},
    t2_made: {type: Number, min: 0},
    t2_attempted: {type: Number, min: 0},
    t3_made: {type: Number, min: 0},
    t3_attempted: {type: Number, min: 0},
    t1_made: {type: Number, min: 0},
    t1_attempted: {type: Number, min: 0},
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
    plus_minus: Number,
    approximate_value: Number,
    //Advanced stats
    usage: Number, //Using %.
});

module.exports = mongoose.Schema(player_stats_gameSchema);