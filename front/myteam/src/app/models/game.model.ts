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
        club_acronym: string;
        team_id: string;
    };
    visitor_team: {
        club_id: string;
        club_name: string;
        club_img: string;
        club_acronym: string;
        team_id: string;
    };
    home_team_score?: number;
    visitor_team_score?: number;
    winner_team?: {
        team_id: string;
        club_name: string;
        club_img: string;
    };
    loser_team?: {
        team_id: string;
        club_name: string;
        club_img: string;
    };
    minutes_played?: number;
    overtime?: boolean;
    overtime_count?: number;
    play_by_play?: [{
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

    constructor(){
        
    }

}