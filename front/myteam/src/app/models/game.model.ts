export class GameModel{
    _id: string;
    date: Date;
    season: number;
    league: {
        league_id: string;
        league_name: string;
    };
    home_team: {
        club_id: string;
        club_name: string;
        club_img: string;
        team_id: string;
    };
    visitor_team: {
        club_id: string;
        club_name: string;
        club_img: string;
        team_id: string;
    };
    home_team_score: number;
    visitor_team_score: number;
    winner_team: {
        team_id: string;
        club_name: string;
        club_img: string;
    };
    loser_team: {
        team_id: string;
        club_name: string;
        club_img: string;
    };
    minutes_played: number;
    overtime: boolean;
    overtime_count: number;
    stats: {
        home_team_stats: {
            team_stats: [{

            }];
            player_stats: [{
                player_id: string;
                player_name: string;
                player_lastName: string;
                time_played:{
                    minutes: number;
                    seconds: number;
                };
                points: number;
                t2_made: number;
                t2_attempted: number;
                t3_made: number;
                t3_attempted: number;
                t1_made: number;
                t1_attempted: number;
                shots_list: {
                    lc3: {made: number; attempted: number};
                    le3: {made: number; attempted: number};
                    c3: {made: number; attempted: number};
                    re3: {made: number; attempted: number};
                    rc3: {made: number; attempted: number};
                    lmc2: {made: number; attempted: number};
                    lme2: {made: number; attempted: number};
                    cm2:  {made: number; attempted: number};
                    rme2: {made: number; attempted: number};
                    rmc2: {made: number; attempted: number};
                    lp2:  {made: number; attempted: number};
                    rp2:  {made: number; attempted: number};
                    lft2: {made: number; attempted: number};
                    rft2: {made: number; attempted: number}
                };
                total_rebounds: number;
                defensive_rebounds: number;
                offensive_rebounds: number;
                assists: number;
                steals: number;
                turnovers: number;
                blocks_made: number;
                blocks_received: number;
                fouls_made: number;
                fouls_received: number;
                plus_minus: number;
                approximate_value: number;
                usage: number
            }];
        };
        visitor_team_stats: [{
            team_stats: [{

            }];
            player_stats: [{
                player_id: string;
                player_name: string;
                player_lastName: string;
                time_played:{
                    minutes: number;
                    seconds: number;
                };
                points: number;
                t2_made: number;
                t2_attempted: number;
                t3_made: number;
                t3_attempted: number;
                t1_made: number;
                t1_attempted: number;
                shots_list: {
                    lc3: {made: number; attempted: number};
                    le3: {made: number; attempted: number};
                    c3: {made: number; attempted: number};
                    re3: {made: number; attempted: number};
                    rc3: {made: number; attempted: number};
                    lmc2: {made: number; attempted: number};
                    lme2: {made: number; attempted: number};
                    cm2:  {made: number; attempted: number};
                    rme2: {made: number; attempted: number};
                    rmc2: {made: number; attempted: number};
                    lp2:  {made: number; attempted: number};
                    rp2:  {made: number; attempted: number};
                    lft2: {made: number; attempted: number};
                    rft2: {made: number; attempted: number}
                };
                total_rebounds: number;
                defensive_rebounds: number;
                offensive_rebounds: number;
                assists: number;
                steals: number;
                turnovers: number;
                blocks_made: number;
                blocks_received: number;
                fouls_made: number;
                fouls_received: number;
                plus_minus: number;
                approximate_value: number;
                usage: number
            }];
        }];
    };
    play_by_play: [{
        player: {
            player_id: string;
            player_name: string
        };
        team: string;
        time:{
            minute: number;
            second: number
        };
        period: number;
        type: string;
        shot_type: string;
        shot_position: string;
        shot_made: boolean;
        assisted_shot: boolean;
        rebound_type: string;
        player_in: string;
        player_out: string;
        from: string;
        to: string;
    }];

}