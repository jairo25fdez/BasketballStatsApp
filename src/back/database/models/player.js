
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = require('./team.js');


var playerSchema = new Schema({
    name: {type: String, required: true},
    last_name: {type: String, required: true},
    birth_date: Date,
    nationality: String,
    birthplace: String,
    avatar: String,
    email: String,
    phone: Number,
    weight: Number, //Kilogrames
    height: Number, //Centimetres
    primary_position: {type: String, enum: ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot']},
    secondary_position: {type: String, enum: ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot']},
    number: {type: Number, min: 0, max: 99},
    actual_team: {
        club_id: {type: Schema.Types.ObjectId, ref: 'Club', required: true},
        club_name: {type: String, required: true},
        team_id: {type: Schema.Types.ObjectId, ref: 'League', required: true},
        team_name: {type: String, required: true},
        season: {type: Number, required: true}
    },
    former_teams: [{
        _id: false,
        club_id: {type: Schema.Types.ObjectId, ref: 'Club', required: true},
        club_name: {type: String, required: true},
        team_id: {type: Schema.Types.ObjectId, ref: 'League', required: true},
        team_name: {type: String, required: true},
        season: {type: Number, required: true}
    }]
});

module.exports = mongoose.model('Player', playerSchema);

/*
playerSchema = mongoose.Schema(playerSchema);
playerModel = mongoose.model('Player', playerSchema);

module.exports = {
    PlayerSchema: playerSchema,
    PlayerModel: playerModel
}
*/
