const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const player_stats_gameModule = require('./player_stats_game.js');
const player_stats_gameSchema = player_stats_gameModule.Player_stats_gameSchema;

const playModule = require('./play.js');
const playSchema = playModule.PlaySchema;

var gameSchema = new Schema({
    date: Date,
    season : Number,
    league: {
        league_id: {type: Schema.Types.ObjectId, ref: 'League', required: true},
        league_name: String
    },
    home_team: {
        club_id: {type: Schema.Types.ObjectId, ref: 'Club', required: true},
        club_name: {type: String, required: true},
        club_img: {type: String, required: true},
        team_id: {type: Schema.Types.ObjectId, ref: 'Team', required: true}
    },
    visitor_team: {
        club_id: {type: Schema.Types.ObjectId, ref: 'Club', required: true},
        club_name: {type: String, required: true},
        club_img: {type: String, required: true},
        team_id: {type: Schema.Types.ObjectId, ref: 'Team', required: true}
    },
    home_team_score: Number,
    visitor_team_score: Number,
    winner_team: {
        team_id: {type: Schema.Types.ObjectId, ref: 'Team'},
        club_name: {type: String},
        club_img: {type: String}
    },
    loser_team: {
        team_id: {type: Schema.Types.ObjectId, ref: 'Team'},
        club_name: {type: String},
        club_img: {type: String}
    },
    minutes_played: Number,
    overtime: Boolean,
    overtime_count: Number,
    stats: {
        home_team_stats:{
            //team_stats: {team_stats_gameSchema},
            player_stats: [player_stats_gameSchema]
        },
        visitor_team_stats:{
            //team_stats: {team_stats_gameSchema},
            player_stats: [player_stats_gameSchema]
        } 
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