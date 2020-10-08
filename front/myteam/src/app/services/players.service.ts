import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerModel } from '../models/player.model';

@Injectable()
export class PlayersService{

    private playersUrl = 'http://localhost:8000/api/v1/players';

    constructor(private http: HttpClient){
        console.log("Players service ready");
    }

    //Players collection

    getPlayers(){
        return this.http.get(this.playersUrl).toPromise();
    }

    deletePlayers(){
        return this.http.delete(this.playersUrl, {responseType: 'text'}).toPromise();
    }

    //Single player

    createPlayer(player:PlayerModel){
        return this.http.post(this.playersUrl, player, {responseType: 'text'}).toPromise();
    }

    getPlayer(player_id:string){
        return this.http.get(this.playersUrl+"/"+player_id).toPromise();
    }

    updatePlayer(player:PlayerModel){

        const playerTemp = {
            ...player
        };

        delete playerTemp._id;

        return this.http.put(this.playersUrl+"/"+player._id, playerTemp, {responseType: 'text'}).toPromise();
    }

    deletePlayer(player_id:string){
        return this.http.delete(this.playersUrl+"/"+player_id, {responseType: 'text'}).toPromise();
    }

}