const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const player_stats_gameSchema = require('../schemas/player_stats_game.js');
const playSchema = require('../schemas/play.js');

var gameSchema = new Schema({
    date: Date,
    league: {
        league_id: {type: Schema.Types.ObjectId, ref: 'League', required: true},
        league_name: String
    },
    home_team: {
        club_id: {type: Schema.Types.ObjectId, ref: 'Club', required: true},
        club_name: {type: String, required: true}
    },
    visitor_team: {
        club_id: {type: Schema.Types.ObjectId, ref: 'Club', required: true},
        club_name: {type: String, required: true}
    },
    home_team_score: Number,
    visitor_team_score: Number,
    winner_team: {
        team_id: {type: Schema.Types.ObjectId, ref: 'Team'},
        club_name: {type: String, required: true}
    },
    loser_team: {
        team_id: {type: Schema.Types.ObjectId, ref: 'Team'},
        club_name: {type: String, required: true}
    },
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

/*
gameSchema = mongoose.Schema(gameSchema);
gameModel = mongoose.model('Game', gameSchema);

module.exports = {
    GameSchema: gameSchema,
    GameModel: gameModel
}
*/