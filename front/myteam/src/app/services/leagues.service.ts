import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LeaguesService{

    private leagues:any[] = [];

    constructor(private http: HttpClient){
        console.log("Servicio listo");
    }

    getLeagues(){
        this.http.get("api/v1/leagues").subscribe( (resp:any) => {
            this.leagues = resp;
        });
        return this.leagues;
    }

}