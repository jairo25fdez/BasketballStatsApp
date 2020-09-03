const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var playerSchema = new Schema({
    name: String,
    last_name: String,
    birth: Date,
    avatar: String,
    email: String,
    phone: Number,
    weight: Number,
    height: Number,
    primary_position: {type: String, enum: ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot']},
    secondary_position: {type: String, enum: ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot']},
    number: {type: Number, min: 0, max: 99},
    actual_team: {club_id: {type: Schema.Types.ObjectId, ref: 'Club'}, team_id: {type: Schema.Types.ObjectId, ref: 'Team'}},
    former_teams: [{club_id: {type: Schema.Types.ObjectId, ref: 'Club'}, team_id: {type: Schema.Types.ObjectId, ref: 'Team'}, season: Date}]
});


module.exports = mongoose.model('Player', playerSchema);