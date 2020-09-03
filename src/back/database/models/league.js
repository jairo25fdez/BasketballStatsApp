const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var leagueSchema = new Schema({
    name: String,
    location: String,
    season: {type: Number, min: 2000}, //Year when the season ends.
    quarter_length: {type: Number, min: 1},
    shot_clock: Number, //0 if there is no shot clock.
    max_personal_fouls: {type: Number, min: 1, max: 6},
    teams: [{type: Schema.Types.ObjectId, ref: 'Team'}],
    games_played: [{type: Schema.Types.ObjectId, ref: 'Game'}]
});

leagueSchema.index( {name:1}, { unique: true } );

module.exports = mongoose.model('League', leagueSchema);