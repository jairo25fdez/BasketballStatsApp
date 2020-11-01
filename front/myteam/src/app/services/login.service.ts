import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Models
import { UserModel } from '../models/user.model';

@Injectable()
export class LoginService{

    private loginUrl = 'http://localhost:8000/api/v1/login';

    constructor(private http: HttpClient){
        //console.log("Player_stats_games service ready");
    }

    //Player_stats_games collection

    checkLogin(user:UserModel){
        return this.http.post(this.loginUrl, user).toPromise();
    }

}