import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClubModel } from '../models/club.model';

@Injectable()
export class ClubsService{

    private clubsUrl = 'http://localhost:8000/api/v1/clubs';

    constructor(private http: HttpClient){
        console.log("Clubs service ready");
    }

    //Clubs collection

    getClubs(){
        return this.http.get(this.clubsUrl).toPromise();
    }

    deleteClubs(){
        return this.http.delete(this.clubsUrl, {responseType: 'text'}).toPromise();
    }

    //Single club

    createClub(club:ClubModel){
        return this.http.post(this.clubsUrl, club, {responseType: 'text'}).toPromise();
    }

    getClub(club_id:string){
        return this.http.get(this.clubsUrl+"/"+club_id).toPromise();
    }

    updateClub(club:ClubModel){

        const clubTemp = {
            ...club
        };

        delete clubTemp._id;

        return this.http.put(this.clubsUrl+"/"+club._id, clubTemp, {responseType: 'text'}).toPromise();
    }

    deleteClub(club_id:string){
        return this.http.delete(this.clubsUrl+"/"+club_id, {responseType: 'text'}).toPromise();
    }

}