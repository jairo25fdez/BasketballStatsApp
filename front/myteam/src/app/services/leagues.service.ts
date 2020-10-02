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

    getLeagues(){
        return this.http.get(this.leaguesUrl).toPromise();
    }

    createLeague(league: LeagueModel){
        return this.http.post(this.leaguesUrl, league, {responseType: 'text'}).toPromise();
    }


}
