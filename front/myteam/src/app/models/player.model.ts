export class PlayerModel{
    _id: string;
    name: string;
    last_name: string;
    birth_date: Date;
    nationality: string;
    birthplace: string;
    img: string;
    email: string;
    phone: number;
    weight: number;
    height: number;
    primary_position: string;
    secondary_position: string;
    number: number;
    teams: {
        club_id: string;
        club_name: string;
        club_img: string;
        team_id: string;
        team_name: string;
        league_id: string;
        league_name: string;
        season: number;
    };
}