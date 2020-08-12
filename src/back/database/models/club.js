const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');

const mongoose_util = require(path.join(__dirname, '/../mongoose_util.js'));
const db = mongoose_util.getDB;

var clubSchema = new Schema({
    name: String,
    acronym: String,
    country: String,
    city: String,
    location: String,
    stadium: String,
    teams: [{type: Schema.Types.ObjectId, ref: 'Team'}],
    phone: Number,
    email: String
});

clubSchema.index( {name:1, city:1}, { unique: true } );

module.exports = mongoose.model('Club', clubSchema);