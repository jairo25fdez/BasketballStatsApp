import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';

//Models
import { UserModel } from '../models/user.model';

import jwt_decode from 'jwt-decode';

@Injectable()
export class LoginService{

    private loginUrl = 'http://localhost:8000/api/v1/login';

    private userToken:string;
    private user:UserModel;
    private decoded_token;

    constructor(private http: HttpClient, private router:Router){
    }

    checkLogin(user:UserModel){
        return this.http.post(this.loginUrl, user).toPromise();
    }

    getUser(){
        this.decoded_token = jwt_decode(localStorage.getItem('token'));
        this.user = this.decoded_token.user;
        return this.user;
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

    getToken(){
        this.readToken();
        return this.userToken;
    }

    isAuth():boolean{
        this.readToken();
        return this.userToken.length > 2;
    }

    logout(){
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

}