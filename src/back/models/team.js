const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var teamSchema = new Schema({
    club: {
        _id: false,
        club_id: {type: Schema.Types.ObjectId, ref: 'Club', required: true},
        club_name: {type: String, required: true}
    },
    league: {
        _id: false,
        league_id: {type: Schema.Types.ObjectId, ref: 'League'},
        league_name: String
    },
    season: {type: Number, required: true},
    coach: {type: String},
    coaching_staff: [String],
    roster: [{
        _id: false,
        player_id: {type: Schema.Types.ObjectId, ref: 'Player'},
        player_name: {type: String},
        player_last_name: {type: String},
        player_birth_date: {type: Date},
        player_birthplace: {type: String},
        player_avatar: {type: String},
        player_number: {type: Number},
        player_position: {type: String, enum: ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot']}
    }],
    games_played: [{
        _id: false,
        game_id: {type: Schema.Types.ObjectId, ref: 'Game'},
        game_HomeTeam_id: {type: Schema.Types.ObjectId, ref: 'Team'},
        game_HomeTeam_name: {type: String},
        game_VisitorTeam_id: {type: Schema.Types.ObjectId, ref: 'Team'},
        game_VisitorTeam_name: {type: String},
        winner_team: {type: Schema.Types.ObjectId, ref: 'Team'},
        winner_team_name: {type: String},
        home_team_score: Number,
        visitor_team_score: Number
    }]
});

teamSchema.index( {club:1, league:1, season: 1}, { unique: true } );

module.exports = mongoose.model('Team', teamSchema);

/*
teamSchema = mongoose.Schema(teamSchema);
teamModel = mongoose.model('Team', teamSchema);

module.exports = {
    TeamSchema: teamSchema,
    TeamModel: teamModel
}
*/
