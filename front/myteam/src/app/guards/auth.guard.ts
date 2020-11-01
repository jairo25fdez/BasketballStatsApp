import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

//Services
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService:LoginService, private router:Router){

  }

  canActivate():boolean{

    console.log("ENTRO EN CAN_ACTIVATE");

    if(this.loginService.isAuth()){
      console.log("GUARD TRUE");
      return true;
    }
    else{
      console.log("GUARD FALSE");

      this.router.navigate(['login']);
      return false;
    }

  }
  
}
