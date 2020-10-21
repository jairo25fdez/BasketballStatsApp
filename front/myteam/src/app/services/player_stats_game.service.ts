import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Player_stats_gameModel } from '../models/player_stats_game.model';

@Injectable()
export class Player_stats_gamesService{

    private player_stats_gameUrl = 'http://localhost:8000/api/v1/player_stats_game';

    constructor(private http: HttpClient){
        //console.log("Player_stats_games service ready");
    }

    //Player_stats_games collection

    getPlayer_stats_games(search = ""){
        return this.http.get(this.player_stats_gameUrl+search).toPromise();
    }

    deletePlayer_stats_games(){
        return this.http.delete(this.player_stats_gameUrl, {responseType: 'text'}).toPromise();
    }

    //Single player_stats_game

    createPlayer_stats_game(player_stats_game:Player_stats_gameModel){
        return this.http.post(this.player_stats_gameUrl, player_stats_game, {responseType: 'text'}).toPromise();
    }

    getPlayer_stats_game(player_stats_game_id:string){
        return this.http.get(this.player_stats_gameUrl+"/"+player_stats_game_id).toPromise();
    }

    updatePlayer_stats_game(player_stats_game:Player_stats_gameModel){

        console.log("PLAYER_STAT RECIBIDO: "+JSON.stringify(player_stats_game._id));

        const player_stats_gameTemp = {
            ...player_stats_game
        };

        delete player_stats_gameTemp._id;

        return this.http.put(this.player_stats_gameUrl+"/"+player_stats_game._id, player_stats_gameTemp, {responseType: 'text'}).toPromise();
    }

    deletePlayer_stats_game(player_stats_game_id:string){
        return this.http.delete(this.player_stats_gameUrl+"/"+player_stats_game_id, {responseType: 'text'}).toPromise();
    }

}