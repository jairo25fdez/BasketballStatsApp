import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';

//Models
import { UserModel } from '../models/user.model';

@Injectable()
export class LoginService{

    private loginUrl = 'http://localhost:8000/api/v1/login';

    private userToken:string;
    private user:UserModel;

    constructor(private http: HttpClient, private router:Router){
    }

    checkLogin(user:UserModel){
        return this.http.post(this.loginUrl, user).toPromise();
    }

    setUser(user:UserModel){
        this.user = user;
    }

    getClubImage(){
        return this.user.club_img;
    }

    getUserRol(){
        return this.user.rol;
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