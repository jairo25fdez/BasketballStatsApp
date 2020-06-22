const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var teamSchema = new Schema({
    club: {type: Schema.Types.ObjectId, ref: 'Club'},
    season: Date,
    coach: String,
    coach_2: String,
    roster: [{id: {type: Schema.Types.ObjectId, ref: 'Player'}}]
});

module.exports = mongoose.model('Team', teamSchema); 