const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var teamSchema = new Schema({
    club: {type: Schema.Types.ObjectId, ref: 'Club', required: true},
    league: {type: Schema.Types.ObjectId, ref: 'League', required: true},
    season: {type: Date, required: true},
    coach: {type: String, required: true},
    coaching_staff: [String],
    roster: [{id: {type: Schema.Types.ObjectId, ref: 'Player'}}]
});

teamSchema.index( {club:1, league:1, season: 1}, { unique: true } );

module.exports = mongoose.model('Team', teamSchema); 