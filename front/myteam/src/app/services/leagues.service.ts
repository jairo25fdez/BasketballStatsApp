import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeagueModel } from '../models/league.model';

@Injectable()
export class LeaguesService{

    private leagues:any[] = [];
    private leaguesUrl = 'http://localhost:8000/api/v1/leagues'

    constructor(private http: HttpClient){
        console.log("Leagues services ready");
    }

    //Methods that work with the whole collection.

    getLeagues(){
        return this.http.get(this.leaguesUrl).toPromise();
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

    updateLeague(league_id:string, league:LeagueModel){
        return this.http.put(this.leaguesUrl+"/"+league_id, league).toPromise();
    }

    


}
