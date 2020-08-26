const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var teamSchema = new Schema({
    club: {type: Schema.Types.ObjectId, ref: 'Club'},
    league: {type: Schema.Types.ObjectId, ref: 'League'},
    season: Date,
    coach: String,
    coach_2: String,
    roster: [{id: {type: Schema.Types.ObjectId, ref: 'Player'}}]
});

teamSchema.index( {club:1, league:1, season: 1}, { unique: true } );

module.exports = mongoose.model('Team', teamSchema); 