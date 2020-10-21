const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var zone_shotsSchema = new Schema({
    _id: false,
    made: Number,
    attempted: Number
});

var shots_listSchema = new Schema({
    _id: false,
    lc3: zone_shotsSchema,
    le3: zone_shotsSchema,
    c3: zone_shotsSchema,
    re3: zone_shotsSchema,
    rc3: zone_shotsSchema,
    lmc2: zone_shotsSchema,
    lme2: zone_shotsSchema,
    cm2: zone_shotsSchema,
    rme2: zone_shotsSchema,
    rmc2: zone_shotsSchema,
    lp2: zone_shotsSchema,
    rp2: zone_shotsSchema,
    lft2: zone_shotsSchema,
    rft2: zone_shotsSchema
});

var player_stats_seasonSchema = new Schema({
    player_id: {type: Schema.Types.ObjectId, ref: 'Player', required: true},
    team_id: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
    season: Number,
    player_name: String,
    player_lastName: String,
    player_img: String,
    time_played: {
        minutes: Number,
        seconds: Number,
        average: Number,
    },
    games_played: {type: Number, min: 0}, //Number of games played through the season.
    wins: {type: Number, min: 0},
    losses: {type: Number, min: 0},
    win_percentage: {type: Number, min: 0},
    //Points stats
    points_stats: {
        _id: false,
        total_points: {type: Number, min: 0},
        average_points: {type: Number, min: 0},
        points_per_minute: {type: Number, min: 0},
        points_per_field_shot: {type: Number, min: 0}, // (t2_made*2 + t3_made*3) / total_shots
        points_per_shot_t2: {type: Number, min: 0}, // (t2_made*2) / t2_total
        points_per_shot_t3: {type: Number, min: 0}, // (t3_made*3) / t3_total
        points_per_possesion: {type: Number, min: 0} // total_points / usage.player
    },
    //Shots stats
    shots_stats: {
        _id: false,
        //Shots location stats
        total_shots: {type: Number, min: 0}, //Number of shots through the season (free throws not included)
        shots_list: shots_listSchema, //We will save the shot locations.
        eFG: {type: Number, min: 0}, //
        fg_percentage: {type: Number, min: 0},
        t2_stats: {
            _id: false,
            //T2
            t2_made: {type: Number, min: 0},
            t2_attempted: {type: Number, min: 0},
            t2_total: {type: Number, min: 0}, // = t2_made + t2_attempted
            t2_percentage: {type: Number, min: 0}, // %t2
            t2_volume_percentage: {type: Number, min: 0}, // %t2 compared to total shots, = total shots / t2_total
        },
        t3_stats: {
            _id: false,
            //T3
            t3_made: {type: Number, min: 0},
            t3_attempted: {type: Number, min: 0},
            t3_total: {type: Number, min: 0}, // = t3_made + t3_attempted
            t3_percentage: {type: Number, min: 0}, // %t3
            t3_volume_percentage: {type: Number, min: 0}, // %t3 compared to total shots, = total shots / t3_total
        },
        t1_stats: {
            _id: false,
            //FT
            t1_made: {type: Number, min: 0},
            t1_attempted: {type: Number, min: 0},
            t1_percentage: {type: Number, min: 0}, //%t1
            t1_volume_percentage: {type: Number, min: 0}, // %t2 compared to total field goals, = total shots / t1_total
        }
    },
    //Assists stats
    assists_stats: {
        _id: false,
        total_assists: {type: Number, min: 0},
        assists_percentage: {type: Number, min: 0}, // 100*total_assists / (((minutes_played / (Team_Minutes/5)) * Team_FG_Made) - FG_Made )
        assists_per_lost: {type: Number, min: 0} // total_assists / total_lost_balls
    },
    //Steals stats
    steals_stats: {
        _id: false,
        total_steals: {type: Number, min: 0},
        steals_per_minute: {type: Number, min: 0},
        steals_per_game: {type: Number, min: 0}
    },
    //Lost balls stats
    lost_balls_stats: {
        total_losts: {type: Number, min: 0}
    },
    //Rebounds stats
    rebounds_stats: {
        _id: false,
        total_rebounds: {type: Number, min: 0},
        average_rebounds: {type: Number, min: 0}, // total_rebounds / games_played
        offensive_rebounds: {type: Number, min: 0},
        defensive_rebounds: {type: Number, min: 0},
        total_rebounds_per_minute: {type: Number, min: 0}, // total_rebounds / minutes_played
        off_rebounds_per_minute: {type: Number, min: 0}, // off_rebounds / minutes_played
        def_rebounds_per_minute: {type: Number, min: 0}, // def_rebounds / minutes_played
        rebounds_percentage: {type: Number, min: 0}, //100*(total_rebounds*(Team Minutes Played/5))/(Minutes Played*(Team Total Rebounds + Opponent Team’s Total Rebounds))
    },
    //Blocks stats
    blocks_stats: {
        _id: false,
        total_blocks_made: {type: Number, min: 0},
        total_blocks_received: {type: Number, min: 0},
        blocks_made_per_game: {type: Number, min: 0},
        blocks_received_per_game: {type: Number, min: 0},
        blocks_received_per_minute: {type: Number, min: 0},
        blocks_made_per_minute: {type: Number, min: 0},
    },
    //Usage stats
    usage: Number,
    //Fouls stats
    fouls_stats: {
        _id: false,
        total_fouls_made: {type: Number, min: 0},
        fouls_made_per_minute: {type: Number, min: 0}, // total_fouls_made / minutes_played
        total_fouls_received: {type: Number, min: 0},
        fouls_received_per_minute: {type: Number, min: 0}, // total_fouls_received / minutes_played
    }

});

player_stats_seasonSchema.index( {player_id: 1, season_id: 1, team_id: 1}, { unique: true } );

player_stats_seasonSchema = mongoose.Schema(player_stats_seasonSchema);
player_stats_seasonModel = mongoose.model('Player Stats Season', player_stats_seasonSchema);

module.exports = {
    Player_stats_seasonSchema: player_stats_seasonSchema,
    Player_stats_seasonModel: player_stats_seasonModel
}