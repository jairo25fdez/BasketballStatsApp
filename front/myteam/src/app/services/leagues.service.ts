import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LeagueModel } from '../models/league.model';

@Injectable()
export class LeaguesService{

    
    private leaguesUrl = 'http://localhost:8000/api/v1/leagues';

    constructor(private http: HttpClient){
        console.log("Leagues services ready");
    }

    //Methods that work with the whole collection.

    getLeagues(search=""){
        return this.http.get(this.leaguesUrl+search).toPromise();
    }

    deleteLeagues(){

    }

    //Methods that work with a single object.

    getLeague(league_id:string){
        return this.http.get(this.leaguesUrl+"/"+league_id).toPromise();
    }

    createLeague(league: LeagueModel){
        return this.http.post(this.leaguesUrl, league, {responseType: 'text'}).toPromise();
    }

    updateLeague(league:LeagueModel){

        const leagueTemp = {
            ...league
        };

        delete leagueTemp._id;

        return this.http.put(this.leaguesUrl+"/"+league._id, leagueTemp, {responseType: 'text'}).toPromise();
    }

    deleteLeague(league_id:string){
        return this.http.delete(this.leaguesUrl+"/"+league_id, {responseType: 'text'}).toPromise();
    }



}
