const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var leagueSchema = new Schema({
    name: String,
    location: String,
    season: Date,
    teams: [{type: Schema.Types.ObjectId, ref: 'Team'}],
    games_played: [{type: Schema.Types.ObjectId, ref: 'Game'}]
});

module.exports = mongoose.model('League', leagueSchema);