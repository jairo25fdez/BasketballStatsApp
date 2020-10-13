import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TeamModel } from '../models/team.model';

@Injectable()
export class TeamsService{

    
    private teamsUrl = 'http://localhost:8000/api/v1/teams';

    constructor(private http: HttpClient){
        //console.log("Teams services ready");
    }

    //Methods that work with the whole collection.

    getTeams(search=""){
        return this.http.get(this.teamsUrl+search).toPromise();
    }

    deleteTeams(){
        return this.http.delete(this.teamsUrl).toPromise();
    }

    //Methods that work with a single object.

    getTeam(team_id:string){
        return this.http.get(this.teamsUrl+"/"+team_id).toPromise();
    }

    createTeam(team: TeamModel){
        return this.http.post(this.teamsUrl, team, {responseType: 'text'}).toPromise();
    }

    updateTeam(team:TeamModel){

        const teamTemp = {
            ...team
        };

        delete teamTemp._id;

        return this.http.put(this.teamsUrl+"/"+team._id, teamTemp, {responseType: 'text'}).toPromise();
    }

    deleteTeam(team_id:string){
        return this.http.delete(this.teamsUrl+"/"+team_id, {responseType: 'text'}).toPromise();
    }



}
