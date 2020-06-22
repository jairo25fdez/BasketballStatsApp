const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var clubSchema = new Schema({
    name: String,
    location: String,
    stadium: String,
    teams: [{team_id: {type: Schema.Types.ObjectId, ref: 'Team'}, team_name: String}],
    phone: Number,
    email: {type: String, unique: true}
});

module.exports = mongoose.model('Club', clubSchema);