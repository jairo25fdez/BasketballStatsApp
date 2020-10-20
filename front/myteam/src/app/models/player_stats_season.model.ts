export class Player_stats_seasonModel{
    _id?: string;
    team_id: string;
    season: number;
    team_name: string;
    time_played: {
        minutes: number;
        seconds: number;
    };
    games_played: number;
    wins: number;
    losses: number;
    win_percentage: number;
    points_stats: {
        total_points: number;
        average_points: number;
        points_per_minute: number;
        points_per_field_shot: number;
        points_per_shot_t2: number;
        points_per_shot_t3: number;
        points_per_possesion: number;
    };
    shots_stats: {
        total_shots: number;
        shots_list: number;
        eFG: number;
        t2_stats: {
            t2_made: number;
            t2_attempted: number;
            t2_total: number;
            t2_percentage: number;
            t2_volume_percentage: number;
        },
        t3_stats: {
            t3_made: number;
            t3_attempted: number;
            t3_total: number;
            t3_percentage: number;
            t3_volume_percentage: number;
        },
        t1_stats: {
            t1_made: number;
            t1_attempted: number;
            t1_percentage: number;
            t1_volume_percentage: number;
        }
    };
    assists_stats: {
        total_assists: number;
        assists_percentage: number;
        assists_per_lost: number;
    };
    steals_stats: {
        total_steals: number;
        steals_per_minute: number;
        steals_per_game: number;
    };
    lost_balls_stats: {
        total_losts: number;
    };
    rebounds_stats: {
        total_rebounds: number;
        average_rebounds: number;
        offensive_rebounds: number;
        defensive_rebounds: number;
        total_rebounds_per_minute: number;
        off_rebounds_per_minute: number;
        def_rebounds_per_minute: number;
        rebounds_percentage: number;
    };
    blocks_stats: {
        total_blocks_made: number;
        total_blocks_received: number;
        blocks_made_per_game: number;
        blocks_received_per_game: number;
        blocks_received_per_minute: number;
        blocks_made_per_minute: number;
    };
    possessions: {
        total_possessions: number;
        possessions_per_game: number;
    };
    fouls_stats: {
        total_fouls_made: number;
        fouls_made_per_minute: number;
        total_fouls_received: number;
        fouls_received_per_minute: number;
    }
}