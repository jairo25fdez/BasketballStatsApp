const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var playSchema = new Schema({
    player: {
        player_id: {type: Schema.Types.ObjectId, ref: 'Player', required: true},
        player_name: String,
        player_last_name: String,
        player_img: String,
    },
    team: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
    time: {
        minute: Number,
        second: Number
    },
    period: {type: Number, min: 1, required: true},
    type: {type: String, enum: ['shot', 'rebound', 'assist', 'steal', 'lost ball', 'made block', 'received block', 'personal foul', 'sustitution'], required: true },
    //Shot data
    shot_type: {type: String, enum: ['ft', 'fg']},
    shot_position: {type: String, enum: ['lc3', 'le3', 'c3', 're3', 'rc3', 'lmc2', 'lme2', 'cm2', 'rme2', 'rmc2', 'lp2', 'rp2', 'lft2', 'rft2']}, //lb2 = left board 2, nearest zone to the rim.
    shot_made: Boolean, //true if the shot was made, false if the shot was missed
    //assisted_shot: Boolean, //true if the shot was assisted, false if not.
    //Rebound data
    rebound_type: {type: String, enum:['offensive', 'defensive']},
    //Sustitution data
    //player_in: {type: Schema.Types.ObjectId, ref: 'Player'},
    //player_out: {type: Schema.Types.ObjectId, ref: 'Player'},
    //Generic data for assists, steals, blocks or personal fouls
    //from: {type: Schema.Types.ObjectId, ref: 'Player'}, //Player that creates the action
    //to: {type: Schema.Types.ObjectId, ref: 'Player'} //Player that receives the action, for example the player that assists a teammate.
});

playSchema = mongoose.Schema(playSchema);
playModel = mongoose.model('Play', playSchema);

//module.exports = mongoose.Schema(playSchema);

module.exports = {
    PlaySchema: playSchema,
    PlayModel: playModel
}
