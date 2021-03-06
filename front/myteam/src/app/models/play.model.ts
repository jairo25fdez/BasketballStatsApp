export class PlayModel{
    _id?: string;
    player: {
        player_id: string;
        player_name: string;
        player_last_name: string;
        player_img: string;
    };
    team: {
        team_id: string;
        team_img: string;
    };
    game_id: string;
    home_team_score: number;
    visitor_team_score: number;
    time: {
        minute: Number;
        second: Number;
    };
    period: Number;
    type: string;
    //Shot data
    shot_type?: string;
    shot_position?: string;
    shot_made?: Boolean; //true if the shot was made, false if the shot was missed
    rebound_type?: string;
    block_type?: string;
    foul_type?: string;
}