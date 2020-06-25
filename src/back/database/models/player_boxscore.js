const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var player_boxscoreSchema = new Schema({
    player: {type: Schema.Types.ObjectId, ref: 'Player'},
    game: {type: Schema.Types.ObjectId, ref: 'Game'},
    minutes_played: Date,
    points: {type: Number, min: 0},
    t2_made: {type: Number, min: 0},
    t2_attempted: {type: Number, min: 0},
    t3_made: {type: Number, min: 0},
    t3_attempted: {type: Number, min: 0},
    t1_made: {type: Number, min: 0},
    t1_attempted: {type: Number, min: 0},
    total_rebounds: {type: Number, min: 0},
    defensive_rebounds: {type: Number, min: 0},
    offensive_rebounds: {type: Number, min: 0},
    assists: {type: Number, min: 0},
    steals: {type: Number, min: 0},
    turnovers: {type: Number, min: 0},
    blocks_made: {type: Number, min: 0},
    blocks_received: {type: Number, min: 0},
    personal_fouls: {type: Number, min: 0},
    fouls_received: {type: Number, min: 0},
    plus_minus: Number,
    approximate_value: Number,
    //Advanced stats
    usage: Number,
    plays: [{type: Schema.Types.ObjectId, ref: 'Play'}]
    
});

module.exports = mongoose.model('Player Boxscore', player_boxscoreSchema);