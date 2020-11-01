import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Models
import { UserModel } from '../models/user.model';

@Injectable()
export class LoginService{

    private loginUrl = 'http://localhost:8000/api/v1/login';

    private userToken:string;

    constructor(private http: HttpClient){
        //console.log("Player_stats_games service ready");
    }

    //Player_stats_games collection

    checkLogin(user:UserModel){
        return this.http.post(this.loginUrl, user).toPromise();
    }

    saveToken(token:string){
        this.userToken = token;
        localStorage.setItem('token', token);
    }

    readToken(){

        if(localStorage.getItem('token')){
            this.userToken = localStorage.getItem('token');
        }
        else{
            this.userToken = "";
        }
        
    }

}