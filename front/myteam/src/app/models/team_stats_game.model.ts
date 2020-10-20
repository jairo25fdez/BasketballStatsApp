export class Team_stats_gameModel{
    _id?: string;
    team_id: string;
    team_name: string;
    game_id: string;
    season: number;
    time_played: {
        minutes: number;
        seconds: number;
    };
    points: number;
    t2_made: number;
    t2_attempted: number;
    t2_percentage: number;
    t3_made: number;
    t3_attempted: number;
    t3_percentage: number;
    t1_made: number;
    t1_attempted: number;
    t1_percentage: number;
    shots_list: {
        lc3: {made: 0, attempted: 0};
        le3: {made: 0, attempted: 0};
        c3: {made: 0, attempted: 0};
        re3: {made: 0, attempted: 0};
        rc3: {made: 0, attempted: 0};
        lmc2: {made: 0, attempted: 0};
        lme2: {made: 0, attempted: 0};
        cm2: {made: 0, attempted: 0};
        rme2: {made: 0, attempted: 0};
        rmc2: {made: 0, attempted: 0};
        lp2: {made: 0, attempted: 0};
        rp2: {made: 0, attempted: 0};
        lft2: {made: 0, attempted: 0};
        rft2: {made: 0, attempted: 0};
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
    possessions: number;
}