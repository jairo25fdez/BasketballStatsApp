import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayModel } from '../models/play.model';

@Injectable()
export class PlaysService{

    private playsUrl = 'http://localhost:8000/api/v1/plays';

    constructor(private http: HttpClient){
        //console.log("Plays service ready");
    }

    //Plays collection

    getPlays(search = ""){
        return this.http.get(this.playsUrl+search).toPromise();
    }

    deletePlays(){
        return this.http.delete(this.playsUrl, {responseType: 'text'}).toPromise();
    }

    //Single play

    createPlay(play:PlayModel){
        return this.http.post(this.playsUrl, play, {responseType: 'text'}).toPromise();
    }

    getPlay(play_id:string){
        return this.http.get(this.playsUrl+"/"+play_id).toPromise();
    }

    updatePlay(play:PlayModel){

        const playTemp = {
            ...play
        };

        delete playTemp._id;

        return this.http.put(this.playsUrl+"/"+play._id, playTemp, {responseType: 'text'}).toPromise();
    }

    deletePlay(play_id:string){
        return this.http.delete(this.playsUrl+"/"+play_id, {responseType: 'text'}).toPromise();
    }

}