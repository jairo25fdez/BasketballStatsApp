export class PlayModel{
    _id?: string;
    player: {
        player_id: string;
        player_name: string;
        player_last_name: string;
        player_img: string;
    };
    team: string;
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
}