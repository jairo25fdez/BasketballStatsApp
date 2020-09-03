const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const player_stats_gameSchema = require('../schemas/player_stats_game.js');
const playSchema = require('../schemas/play.js');

var gameSchema = new Schema({
    date: Date,
    league: {type: Schema.Types.ObjectId, ref: 'League'},
    home_team: {type: Schema.Types.ObjectId, ref: 'Team'},
    visitor_team: {type: Schema.Types.ObjectId, ref: 'Team'},
    home_team_score: Number,
    visitor_team_score: Number,
    winner_team: {type: Schema.Types.ObjectId, ref: 'Team'},
    loser_team: {type: Schema.Types.ObjectId, ref: 'Team'},
    overtime: Boolean,
    overtime_count: Number,
    boxscore: {
        home_team_boxscore: [player_stats_gameSchema],
        visitor_team_boxscore: [player_stats_gameSchema]
    },
    play_by_play: [playSchema]
});

gameSchema.index( {date: 1, home_team: 1, visitor_team: 1}, { unique: true } );

module.exports = mongoose.model('Game', gameSchema);