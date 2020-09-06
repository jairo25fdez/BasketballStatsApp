const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var leagueSchema = new Schema({
    name: {type: String, required: true},
    location: String,
    quarter_length: {type: Number, min: 1},
    shot_clock: Number, //0 if there is no shot clock.
    max_personal_fouls: {type: Number, min: 1, max: 6},
    teams: [{
        _id: false,
        club_id: {type: Schema.Types.ObjectId, ref: 'Club'},
        club_name: {type: String, required: true},
        team_id: {type: Schema.Types.ObjectId, ref: 'Team'}
    }],
    games_played: [{
        _id: false,
        game_id: {type: Schema.Types.ObjectId, ref: 'Game'}
    }]
});

leagueSchema.index( {name: 1, season: 1}, { unique: true } );

module.exports = mongoose.Schema(leagueSchema);
module.exports = mongoose.model('League', leagueSchema);