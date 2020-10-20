import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Player_stats_seasonModel } from '../models/player_stats_season.model';

@Injectable()
export class Player_stats_seasonsService{

    private player_stats_seasonUrl = 'http://localhost:8000/api/v1/player_stats_season';

    constructor(private http: HttpClient){
        //console.log("Player_stats_seasons service ready");
    }

    //Player_stats_seasons collection

    getPlayer_stats_seasons(search = ""){
        return this.http.get(this.player_stats_seasonUrl+search).toPromise();
    }

    deletePlayer_stats_seasons(){
        return this.http.delete(this.player_stats_seasonUrl, {responseType: 'text'}).toPromise();
    }

    //Single player_stats_season

    createPlayer_stats_season(player_stats_season:Player_stats_seasonModel){
        return this.http.post(this.player_stats_seasonUrl, player_stats_season, {responseType: 'text'}).toPromise();
    }

    getPlayer_stats_season(player_stats_season_id:string){
        return this.http.get(this.player_stats_seasonUrl+"/"+player_stats_season_id).toPromise();
    }

    updatePlayer_stats_season(player_stats_season:Player_stats_seasonModel){

        const player_stats_seasonTemp = {
            ...player_stats_season
        };

        delete player_stats_seasonTemp._id;

        return this.http.put(this.player_stats_seasonUrl+"/"+player_stats_season._id, player_stats_seasonTemp, {responseType: 'text'}).toPromise();
    }

    deletePlayer_stats_season(player_stats_season_id:string){
        return this.http.delete(this.player_stats_seasonUrl+"/"+player_stats_season_id, {responseType: 'text'}).toPromise();
    }

}