import { Component, OnInit } from '@angular/core';

//Services
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  club_logo:string;
  user_rol:string;

  constructor(private loginService:LoginService) { 
    this.club_logo = this.loginService.getClubImage();
    this.user_rol = this.loginService.getUserRol();
  }

  ngOnInit(): void {
  }

  logout(){
    this.loginService.logout();
  }

  getClubLogo(){

  }



}
