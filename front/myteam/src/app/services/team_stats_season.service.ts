import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team_stats_seasonModel } from '../models/team_stats_season.model';

@Injectable()
export class Team_stats_seasonService{

    private team_stats_seasonUrl = 'http://localhost:8000/api/v1/team_stats_season';

    constructor(private http: HttpClient){
        //console.log("Team_stats_teams service ready");
    }

    //Team_stats_teams collection

    getTeams_stats_season(search = ""){
        return this.http.get(this.team_stats_seasonUrl+search).toPromise();
    }

    deleteTeams_stats_season(){
        return this.http.delete(this.team_stats_seasonUrl, {responseType: 'text'}).toPromise();
    }

    //Single team_stats_season

    createTeam_stats_season(team_stats_season:Team_stats_seasonModel){
        return this.http.post(this.team_stats_seasonUrl, team_stats_season, {responseType: 'text'}).toPromise();
    }

    getTeam_stats_season(team_stats_season_id:string){
        return this.http.get(this.team_stats_seasonUrl+"/"+team_stats_season_id).toPromise();
    }

    updateTeam_stats_season(team_stats_season:Team_stats_seasonModel){

        const team_stats_seasonTemp = {
            ...team_stats_season
        };

        delete team_stats_seasonTemp._id;

        return this.http.put(this.team_stats_seasonUrl+"/"+team_stats_season._id, team_stats_seasonTemp, {responseType: 'text'}).toPromise();
    }

    deleteTeam_stats_season(team_stats_season_id:string){
        return this.http.delete(this.team_stats_seasonUrl+"/"+team_stats_season_id, {responseType: 'text'}).toPromise();
    }

}