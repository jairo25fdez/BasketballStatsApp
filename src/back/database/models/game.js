const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var gameSchema = new Schema({
    date: Date,
    league: {
        league_name: String,
        season: Date
    },
    home_team: String,
    visitor_team: String,
    home_team_score: Number,
    visitor_team_score: Number,
    winner_team: String,
    loser_team: String,
    minutes_played: Number,
    overtime: Boolean,
    overtime_count: Number,
    boxscore: {
        home_team: String,
        home_boxscore: [{
            player_stats: {type: Schema.Types.ObjectId, ref: 'Player Boxscore'}
        }],
        visitor_team: String,
        visitor_boxscore: [{
            player_stats: {type: Schema.Types.ObjectId, ref: 'Player Boxscore'}
        }]
    },
    play_by_play: [{type: Schema.Types.ObjectId, ref: 'Play'}]
});

gameSchema.index( {date:1, league:1, home_team: 1, visitor_team: 1}, { unique: true } );

module.exports = mongoose.model('Game', gameSchema);