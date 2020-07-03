const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var gameSchema = new Schema({
    date: Date,
    league: {type: Schema.Types.ObjectId, ref: 'League'},
    home_team: {type: Schema.Types.ObjectId, ref: 'Team'},
    visitor_team: {type: Schema.Types.ObjectId, ref: 'Team'},
    home_team_score: Number,
    visitor_team_score: Number,
    winner_team: {type: Schema.Types.ObjectId, ref: 'Team'},
    boxscore: {
        home_team: {type: Schema.Types.ObjectId, ref: 'Team'},
        home_boxscore: [{
            player_stats: {type: Schema.Types.ObjectId, ref: 'Player Boxscore'}
        }],
        visitor_team: {type: Schema.Types.ObjectId, ref: 'Team'},
        visitor_boxscore: [{
            player_stats: {type: Schema.Types.ObjectId, ref: 'Player Boxscore'}
        }]
    },
    play_by_play: [{type: Schema.Types.ObjectId, ref: 'Play'}]
});

module.exports = mongoose.model('Game', gameSchema);