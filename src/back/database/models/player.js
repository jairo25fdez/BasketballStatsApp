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
    position: {type: String, enum: ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot']},
    number: {type: Number, min: 0, max: 99},
    clubs: [{club_id: {type: Schema.Types.ObjectId, ref: 'Club'}, season: Date}]
});

mongoose.model('Player', playerSchema);