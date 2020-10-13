import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameModel } from '../models/game.model';

@Injectable()
export class GamesService{

    private gamesUrl = 'http://localhost:8000/api/v1/games';

    constructor(private http: HttpClient){
        //console.log("Games service ready");
    }

    //Games collection

    getGames(search = ""){
        return this.http.get(this.gamesUrl+search).toPromise();
    }

    deleteGames(){
        return this.http.delete(this.gamesUrl, {responseType: 'text'}).toPromise();
    }

    //Single game

    createGame(game:GameModel){
        return this.http.post(this.gamesUrl, game, {responseType: 'text'}).toPromise();
    }

    getGame(game_id:string){
        return this.http.get(this.gamesUrl+"/"+game_id).toPromise();
    }

    updateGame(game:GameModel){

        const gameTemp = {
            ...game
        };

        delete gameTemp._id;

        return this.http.put(this.gamesUrl+"/"+game._id, gameTemp, {responseType: 'text'}).toPromise();
    }

    deleteGame(game_id:string){
        return this.http.delete(this.gamesUrl+"/"+game_id, {responseType: 'text'}).toPromise();
    }

}