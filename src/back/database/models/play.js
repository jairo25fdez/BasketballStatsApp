const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var playSchema = new Schema({
    game: {type: Schema.Types.ObjectId, ref: 'Game'},
    player: {type: Schema.Types.ObjectId, ref: 'Player'},
    team: {type: Schema.Types.ObjectId, ref: 'Team'},
    time: Date,
    period: {Number, min: 1, max: 4},
    type: {type: String, enum: ['shot', 'rebound', 'assist', 'steal', 'block', 'personal_foul', 'sustitution'] },
    //Shot data
    shot_type: {type: String, enum: ['ft', 'fg']},
    shot_position: Number,
    shot_made: Boolean, //true if the shot was made, false if the shot was missed
    assisted_shot: Boolean, //true if the shot was assisted, false if not.
    //Rebound data
    rebound_type: {type: String, enum:['offensive', 'defensive']},
    //Sustitution data
    player_in: {type: Schema.Types.ObjectId, ref: 'Player'},
    player_out: {type: Schema.Types.ObjectId, ref: 'Player'},
    //Generic data for assists, steals, blocks or personal fouls
    from: {type: Schema.Types.ObjectId, ref: 'Player'}, //Player that creates the action
    to: {type: Schema.Types.ObjectId, ref: 'Player'}, //Player that receives the action
});

module.exports = mongoose.model('Play', gameSchema);