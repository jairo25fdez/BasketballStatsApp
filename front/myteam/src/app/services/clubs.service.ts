import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClubModel } from '../models/club.model';

@Injectable()
export class ClubsService{

    private clubsUrl = 'http://localhost:8000/api/v1/clubs';

    constructor(private http: HttpClient){
        console.log("Clubs service ready");
    }

    getClubs(){
        return this.http.get(this.clubsUrl).toPromise();
    }

    deleteClub(club_id:string){
        return this.http.delete(this.clubsUrl+"/"+club_id, {responseType: 'text'}).toPromise();
    }

}