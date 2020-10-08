export class ClubModel{
    _id: string;
    name: string;
    img: string;
    acronym: string;
    country: string;
    city: string;
    location: string;
    stadium: string;
    teams: [{
        team_id: string;
        team_name: string;
        league_id: string;
        league_name: string;
    }];
    phone: string;
    email: string;

}