import { EmailValidator } from '@angular/forms';

export class UserModel{
    _id:string;
    name: string;
    last_name: string;
    password: string;
    email: string;
    rol: string;
    club: string;
    club_img: string;
}