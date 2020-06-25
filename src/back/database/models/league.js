const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var leagueSchema = new Schema({
    name: String,
    location: String,
    season: Date,
    teams: [{team_id: {type: Schema.Types.ObjectId, ref: 'Team'}}],
    games_played: Number
});

module.exports = mongoose.model('League', leagueSchema);