const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var clubSchema = new Schema({
    name: String,
    country: String,
    city: String,
    location: String,
    stadium: String,
    teams: [{type: Schema.Types.ObjectId, ref: 'Team'}],
    phone: Number,
    email: {type: String, unique: true}
});

module.exports = mongoose.model('Club', clubSchema);