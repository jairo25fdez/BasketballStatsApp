import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../models/user.model';

@Injectable()
export class UsersService{

    private usersUrl = 'http://localhost:8000/api/v1/users';

    constructor(private http: HttpClient){
        //console.log("Users service ready");
    }

    //Users collection

    getUsers(search = ""){
        return this.http.get(this.usersUrl+search).toPromise();
    }

    deleteUsers(){
        return this.http.delete(this.usersUrl, {responseType: 'text'}).toPromise();
    }

    //Single user

    createUser(user:UserModel){
        return this.http.post(this.usersUrl, user, {responseType: 'text'}).toPromise();
    }

    getUser(user_id:string){
        return this.http.get(this.usersUrl+"/"+user_id).toPromise();
    }

    updateUser(user:UserModel){

        const userTemp = {
            ...user
        };

        delete userTemp._id;

        return this.http.put(this.usersUrl+"/"+user._id, userTemp, {responseType: 'text'}).toPromise();
    }

    deleteUser(user_id:string){
        return this.http.delete(this.usersUrl+"/"+user_id, {responseType: 'text'}).toPromise();
    }

}