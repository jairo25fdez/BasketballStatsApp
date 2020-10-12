export class TeamModel{
    _id: string;
    club: {
        club_id: string;
        club_name: string;
        club_img: string;
    };
    league: {
        league_id: string;
        league_name: string;
        wins: number;
        losses: number;
    };
    season: number;
    coach: string;
    coaching_staff: [string];
    roster: {
        player_id: string;
        player_name: string;
        player_last_name: string;
        player_birth_date: Date;
        //player_birthplace: string;
        player_img: string;
        player_number: number;
        player_primary_position: string;
    }[];
    games_played: {
        game_id: string;
        game_HomeTeam_id: string;
        game_HomeTeam_name: string;
        game_VisitorTeam_id: string;
        game_VisitorTeam_name: string;
        winner_team: string;
        winner_team_name: string;
        home_team_score: number;
        visitor_team_score: number;
    }[];

    constructor(){
        this.roster = [];
        this.games_played = [];
    }

}