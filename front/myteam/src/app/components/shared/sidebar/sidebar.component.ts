import { Component, OnInit } from '@angular/core';

//Services
import { LoginService } from '../../../services/login.service';

//Models
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  user:UserModel;
  club_logo:string;
  user_rol:string;

  constructor(private loginService:LoginService) { 

    this.user = this.loginService.getUser();
    this.club_logo = this.user.club_img;
    this.user_rol = this.user.rol;

  }

  ngOnInit(): void {
  }

  logout(){
    this.loginService.logout();
  }


}
