const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let playerSchema = new Schema({
    name: String,
    last_name: String,
    birth: Date,
    avatar: String,
    email: String,
    phone: Number,
    weight: Number,
    height: Number,
    position: {type: String, enum: ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot']},
    number: Number,
    clubs: [{club: String, season: Date}]
});

mongoose.model('Player', playerSchema);