const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');
const { stringify } = require('querystring');

const mongoose_util = require(path.join(__dirname, '/../controllers/mongoose_util.js'));

var clubSchema = new Schema({
    name: {type: String, required: true},
    img: String,
    acronym: String,
    country: String,
    city: String,
    location: {type: String, required: true},
    stadium: String,
    /*
    active_teams: [{
        _id: false,
        team_id: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
        league_id: {type: Schema.Types.ObjectId, ref: 'League', required: true},
        league_name: {type: String, required: true}
    }],
    former_teams:[{
        _id: false,
        team_id: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
        league_id: {type: Schema.Types.ObjectId, ref: 'League', required: true},
        league_name: {type: String, required: true},
        season: {type: Number, required: true}
    }],
    */
    teams: [{
        _id: false,
        team_id: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
        team_name: {type: String, required: true},
        league_id: {type: Schema.Types.ObjectId, ref: 'League', required: true},
        league_name: {type: String, required: true},
        active: {type: Boolean, required: true}
    }],
    phone: Number,
    email: String
});

clubSchema.index( {name:1, city:1}, { unique: true } );

module.exports = mongoose.model('Club', clubSchema);

//clubSchema = mongoose.Schema(clubSchema);
//clubModel = mongoose.model('Club', clubSchema);

/*
module.exports = {
    ClubSchema: clubSchema,
    ClubModel: clubModel
}
*/